
import sum from 'hash-sum';

import {
  current,
  filters,
  resultsPerPage,
  sortInput,
  scrollId,
  advancedSearch,
  fuzzySearch,
  apiVersion,
  scrollIdTimeout
} from './stores.js';

let myAdvancedSearch;
let myFuzzySearch;
let myCurrent;
let myFilters;
let myResultsPerPage;
let mySortInput;
let myApiVersion;
let myScrollId;

const a = advancedSearch.subscribe((value) => { myAdvancedSearch=value })
const f = fuzzySearch.subscribe((value) => { myFuzzySearch=value })
const c = current.subscribe((value) => { myCurrent=value })
const cf = filters.subscribe((value) => { myFilters=value })
const cr = resultsPerPage.subscribe((value) => { myResultsPerPage=value })
const ci = sortInput.subscribe((value) => { mySortInput=value })
const v = apiVersion.subscribe((value) => { myApiVersion=value })
const s = scrollId.subscribe((value) => { myScrollId=value })

import buildRequestFilter from "./buildRequestFilter";

function buildFrom(current, resultsPerPage) {
  if (!current || !resultsPerPage) return;
  return (current - 1) * resultsPerPage;
}

function buildSort(sortInput, searchInput) {
  return sortInput.filter(x => x.order).map(x => {
    let field;
    if (myApiVersion === 'backend') {
      field = x.input;
    } else {
      field = x.field ? x.field : searchInput[x.input].sortField;
    }
    return { [field]: x.order };
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
            let value = searchInput[key].mask && searchInput[key].mask.transform
                        ? searchInput[key].mask.transform(searchInput[key].value)
                        : searchInput[key].value;
            if (value) {
              return searchInput[key].query(searchInput[key].field, value, searchInput[key].fuzzy)
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

export const validScrollId = (scrollId, searchInput, sortInput) => {
  if (scrollId) {
    if ((Date.now() - scrollId.date) > scrollIdTimeout) {
      return undefined;
    }
    if (sum(JSON.stringify(searchInput)+JSON.stringify(sortInput)) !== scrollId.context) {
      return undefined;
    }
    return scrollId.id;
  }
  return undefined;
}

export default function buildRequest(searchInput, options) {
  let body;
  if (myApiVersion === 'backend') {
    let scrollIdLocal = validScrollId((options && options.scrollId) || myScrollId, searchInput, mySortInput);
    body = {
      fuzzy: `${myFuzzySearch}`,
      sort: buildSort(mySortInput, searchInput),
      page: (options && options.page) || myCurrent,
      size: (options && options.size) || myResultsPerPage,
      scroll: ((myCurrent === 1) || scrollIdLocal ) ? '1m' : undefined,
      scrollId: scrollIdLocal
    };
    Object.keys(searchInput).map(key => {
      if (searchInput[key].value !== "") {
        if (searchInput[key].backendQuery) {
          body[searchInput[key].backendQuery] = searchInput[key].value
        } else {
          body[key] = searchInput[key].value
        }
      }
    })
  } else {
    const sort = buildSort(mySortInput, searchInput);
    const match = buildMatch(searchInput);
    const size = myResultsPerPage;
    const from = buildFrom(myCurrent, myResultsPerPage);
    const filter = buildRequestFilter(myFilters);

    body = {
      // Static query Configuration
      // --------------------------
      // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-highlighting.html
      min_score: ( myAdvancedSearch ? 0 : 5 ),
      track_total_hits: true,
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
        "SEXE","UID",
        "SOURCE"],
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
  }
  return body;
}
