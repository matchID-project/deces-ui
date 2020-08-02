
import sum from 'hash-sum';

import {
  current,
  filters,
  resultsPerPage,
  sortInput,
  scrollId,
  advancedSearch,
  fuzzySearch,
  scrollIdTimeout
} from './stores.js';

let myAdvancedSearch;
let myFuzzySearch;
let myCurrent;
let myFilters;
let myResultsPerPage;
let mySortInput;
let myScrollId;

const a = advancedSearch.subscribe((value) => { myAdvancedSearch=value })
const f = fuzzySearch.subscribe((value) => { myFuzzySearch=value })
const c = current.subscribe((value) => { myCurrent=value })
const cf = filters.subscribe((value) => { myFilters=value })
const cr = resultsPerPage.subscribe((value) => { myResultsPerPage=value })
const ci = sortInput.subscribe((value) => { mySortInput=value })
const s = scrollId.subscribe((value) => { myScrollId=value })

import buildRequestFilter from "./buildRequestFilter";

function buildSort(sortInput, searchInput) {
  return sortInput.filter(x => x.order).map(x => {
    return { [x.input]: x.order };
  });
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
  const page = (options && options.page) || myCurrent;
  const size = (options && options.size) || myResultsPerPage;
  const scrollId = (page === 1) ? undefined
    : (options ? options.scrollId : validScrollId(myScrollId, searchInput, mySortInput));
  const sort = buildSort(mySortInput, searchInput);
  const scroll = ((page === 1) || scrollId ) ? '1m' : undefined;
  body = {
    fuzzy: `${myFuzzySearch}`,
    sort: sort,
    page: page,
    size: size,
    scroll: scroll,
    scrollId: scrollId
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
  return body;
}
