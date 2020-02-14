
import {
  current,
  filters,
  resultsPerPage,
  sortInput,
  advancedSearch
} from './stores.js';

let myAdvancedSearch;
let myCurrent;
let myFilters;
let myResultsPerPage;
let mySortInput;

const a = advancedSearch.subscribe((value) => { myAdvancedSearch=value })
const c = current.subscribe((value) => { myCurrent=value })
const cf = filters.subscribe((value) => { myFilters=value })
const cr = resultsPerPage.subscribe((value) => { myResultsPerPage=value })
const ci = sortInput.subscribe((value) => { mySortInput=value })

import buildRequestFilter from "./buildRequestFilter";

function buildFrom(current, resultsPerPage) {
  if (!current || !resultsPerPage) return;
  return (current - 1) * resultsPerPage;
}

function buildSort(sortInput) {
  return sortInput.filter(x => x.order).map(x => {
      return { [x.field]: x.order }
  });
}

function buildMatch(searchInput) {
  if (myAdvancedSearch) {
    return buildAvancedMatch(searchInput)
  } else {
    return buildSimpleMatch(searchInput)
  }
}

function buildAvancedMatch(searchInput) {
  return {
    function_score: {
      query: {
        bool: {
          must: Object.keys(searchInput).map(key => {
            if (searchInput[key].value) {
              return {
                bool: searchInput[key].query
                  ? {
                      must: [
                        {
                          [searchInput[key].query]: {
                            [searchInput[key].field]: searchInput[key].value
                          }
                        }
                      ]
                    }
                  : {
                      must: [
                        {
                          match: {
                            [searchInput[key].field]: {
                              query: searchInput[key].value,
                              fuzziness: 2
                            }
                          }
                        }
                      ],
                      should: [
                        {
                          match: {
                            [searchInput[key].field]: searchInput[key].value
                          }
                        }
                      ]
                    }
              }
            }
          }).filter(x => x),
        }
      }
    }
  }
}

function buildSimpleMatch(searchInput) {
  let query = searchInput.fullText.value;
  let searchTerm = query.normalize('NFKD').replace(/[\u0300-\u036f]/g, "").split(/\s+/)
  let date = searchTerm.filter( x => x.match(/^\d{2}\/\d{2}\/\d{4}$/)).map( x => x.replace(/(\d{2})\/(\d{2})\/(\d{4})/,"$3$2$1"));
  date = date.length ? date[0] : null;
  let names = searchTerm.filter( x => x.match(/[a-z]+/)).filter( x => !x.match(/^(el|d|le|de|la|los)$/));

  const default_query = { match_all: {} }

  let names_query
  let date_query

  if (names.length > 0) {
    names_query = {
      bool: {
        must: [
          {
            match: {
              PRENOMS_NOM: {
                query: names.join(" "),
                fuzziness: "auto"
              }
            }
          }
        ],
        should: [
          {
            match: {
              PRENOM_NOM: names.join(" "),
            }
          },
          {
            match: {
              PRENOM_NOM: {
                query: names.join(" "),
                fuzziness: "auto"
              }
            }
          }
        ]
      }
    }

    if (names.length === 2) {
      names_query.bool.must.push(
        {
          bool: {
            minimum_should_match: 1,
            should: [
              {
                bool: {
                  must: [
                    {
                      bool: {
                        must: [
                          {
                            match: {
                              NOM: {
                                query: names[0],
                                fuzziness: "auto"
                              }
                            }
                          }
                        ],
                        should: [
                          {
                            match: {
                              NOM: names[0]
                            }
                          }
                        ]
                      }
                    },
                    {
                      bool: {
                        must: [
                          {
                            match: {
                              PRENOMS: {
                                query: names[1],
                                fuzziness: "auto"
                              }
                            }
                          }
                        ],
                        should: [
                          {
                            match: {
                              PRENOM: {
                                query: names[1],
                                fuzziness: "auto"
                              }
                            }
                          },
                          {
                            match: {
                              PRENOM: names[1]
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                bool: {
                  must: [
                    {
                      bool: {
                        must: [
                          {
                            match: {
                              NOM: {
                                query: names[1],
                                fuzziness: "auto"
                              }
                            }
                          }
                        ],
                        should: [
                          {
                            match: {
                              NOM: names[1]
                            }
                          }
                        ]
                      }
                    },
                    {
                      bool: {
                        must: [
                          {
                            match: {
                              PRENOMS: {
                                query: names[0],
                                fuzziness: "auto"
                              }
                            }
                          }
                        ],
                        should: [
                          {
                            match: {
                              PRENOM: {
                                query: names[0],
                                fuzziness: "auto"
                              }
                            }
                          },
                          {
                            match: {
                              PRENOM: names[0]
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      )
    }
  }

  if (date) {
    date_query = {
      bool: {
        minimum_should_match: 1,
        should: [
          {
            match: {
              DATE_NAISSANCE: {
                query: date,
                fuzziness: "auto"
              }
            }
          },
          {
            match: {
              DATE_DECES: {
                query: date,
                fuzziness: "auto"
              }
            }
          }
        ]
      }
    }
  }

  query = date_query
    ? names_query
      ? {
          function_score: {
            query: {
              bool: {
                must: [ names_query ],
                should: [ date_query ]
              }
            }
          }
        }
      : date_query
    : names_query
      ?
        names_query
      :
        default_query

  return query

}

/*

  Converts current application state to an Elasticsearch request.

  When implementing an onSearch Handler in Search UI, the handler needs to take the
  current state of the application and convert it to an API request.

  For instance, there is a "current" property in the application state that you receive
  in this handler. The "current" property represents the current page in pagination. This
  method converts our "current" property to Elasticsearch's "from" parameter.

  This "current" property is a "page" offset, while Elasticsearch's "from" parameter
  is a "item" offset. In other words, for a set of 100 results and a page size
  of 10, if our "current" value is "4", then the equivalent Elasticsearch "from" value
  would be "40". This method does that conversion.

  We then do similar things for searchTerm, filters, sort, etc.
*/

export default function buildRequest(searchInput) {
  const sort = buildSort(mySortInput);
  const match = buildMatch(searchInput);
  const size = myResultsPerPage;
  const from = buildFrom(myCurrent, myResultsPerPage);
  const filter = buildRequestFilter(myFilters);

  const body = {
    // Static query Configuration
    // --------------------------
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-highlighting.html
    min_score: ( myAdvancedSearch ? 0 : 5 ),
    // highlight: {
    //   fragment_size: 200,
    //   number_of_fragments: 1,
    //   fields: {
    //     title: {},
    //     description: {}
    //   }
    // },
    //https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-source-filtering.html#search-request-source-filtering
    _source: [
      "CODE_INSEE_DECES","CODE_INSEE_NAISSANCE",
      "COMMUNE_DECES","COMMUNE_NAISSANCE",
      "DATE_DECES","DATE_NAISSANCE",
      "DEPARTEMENT_DECES","DEPARTEMENT_NAISSANCE",
      "NOM","PRENOM","PRENOMS",
      "NUM_DECES",
      "PAYS_DECES","PAYS_DECES_CODEISO3",
      "PAYS_NAISSANCE","PAYS_NAISSANCE_CODEISO3",
      "SEXE","UID"],
    // aggs: {
    //   COMMUNE_NAISSANCE: { terms: { field: "COMMUNE_NAISSANCE.keyword", size: 30 } },
    //   PAYS_NAISSANCE: {
    //     terms: { field: "PAYS_NAISSANCE.keyword" }
    //   }
    // },

    // Dynamic values based on current Search UI state
    // --------------------------
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/full-text-queries.html
    query: {
      bool: {
        must: [match],
        filter: filter
      }
    },
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-sort.html
    sort: sort,
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-from-size.html
    size: size,
    from: from
  };

  return body;
}
