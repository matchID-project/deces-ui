import sum from 'hash-sum';

import {
    searchInput,
    searchCanvas,
    searchResults,
    searchMinLength,
    sortInput,
    totalResults,
    totalPages,
    facets,
    current,
    updateURL,
    resultsPerPage,
    resultsPerPageDefault,
    advancedSearch,
    wasSearched,
    waitSearch,
    fuzzySearch,
    apiVersion,
    scrollId,
    displayMode
} from './stores.js'

import buildRequest from "./buildRequest.js";
import runRequest from "./runRequest.js";
import buildResults from "./buildResults.js";
import buildState from "./buildState.js";

let mySearchInput;
let mySortInput;
let mySearchCanvas;
let myCurrent;
let myResultsPerPage;
let myAdvancedSearch;
let mySearchMinLength;
let myWaitSearch;
let myFuzzySearch;
let myApiVersion;
let myDisplayMode;

const s = searchInput.subscribe((value) => { mySearchInput=value });
const so = sortInput.subscribe((value) => { mySortInput=value });
const sc = searchCanvas.subscribe((value) => { mySearchCanvas=value });
const sm = searchMinLength.subscribe((value) => { mySearchMinLength=value });
const c = current.subscribe((value) => { myCurrent=value });
const r = resultsPerPage.subscribe((value) => { myResultsPerPage=value });
const av = advancedSearch.subscribe((value) => { myAdvancedSearch=value });
const w = waitSearch.subscribe((value) => { myWaitSearch=value });
const f = fuzzySearch.subscribe((value) => {myFuzzySearch = value});
const p = apiVersion.subscribe((value) => {myApiVersion = value});
const d = displayMode.subscribe((value) => {myDisplayMode = value});

const computeTotalPages = (resultsPerPage, totalResults) => {
    if (!resultsPerPage) return 0;
    if (totalResults === 0) return 1;
    return Math.ceil(totalResults / resultsPerPage);
  }

export const searchTrigger = (searchInput) => {
    return Object.keys(searchInput).some(key => searchInput[key].value.length >= mySearchMinLength) &&
           Object.keys(searchInput).every(key =>
            (searchInput[key].mask && searchInput[key].mask.validation)
            ? searchInput[key].mask.validation(searchInput[key].value)
            : true
           )
};

export const searchString = (searchInput) => {
    return Object.keys(searchInput).map(key => {
        if (searchInput[key].value.length >= 1) {
          return ( key === "fullText" )
            ? searchInput[key].value
            : `${searchInput[key].field}: ${searchInput[key].value}`
        }
      }).filter(x => x).join(' ');
};

export const search = async (searchInput, newCurrent) => {
    if (newCurrent) { current.update(v => newCurrent) }
    else { current.update(v => 1) }
    const request = buildRequest(searchInput);
    const json = await runRequest(request);
    let state;
    if (myApiVersion === 'elasticsearch') {
        state = buildResults(json, myResultsPerPage, myCurrent);
    } else {
        state = json;
    }
    return state && state.response;
};

export const searchSubmit = async (newCurrent) => {
    if (searchTrigger(mySearchInput) && (!myWaitSearch)) {
        await waitSearch.update( v => true);
        const state = await search(mySearchInput, newCurrent);
        await searchResults.update( v => state.persons );
        await totalResults.update(v => state.total);
        await totalPages.update(v => computeTotalPages(state.size, state.total));
        if (state.scrollId) {
            await scrollId.update(v => { return {
                context: sum(JSON.stringify(mySearchInput)+JSON.stringify(mySortInput)),
                id: state.scrollId,
                date: Date.now()
            }});
        }
        await wasSearched.update(v => searchString(mySearchInput));
        await waitSearch.update( v => false);
    }
};

export const buildURLParams = () => {
    const params = new URLSearchParams(location.search);
    if (myAdvancedSearch) {
        params.set('advanced',true)
    } else {
        params.delete('advanced');
    }
    if (!myFuzzySearch) {
        params.set('fuzzy',false)
    } else {
        params.delete('fuzzy');
    }
    if (['table','card-expand'].includes(myDisplayMode)) {
        params.set('view', myDisplayMode);
    } else {
        params.delete('view');
    }
    Object.keys(mySearchInput).map(key => {
        if (mySearchInput[key].value !== "") {
            params.set(mySearchInput[key].url, mySearchInput[key].value);
        } else {
            params.delete(mySearchInput[key].url);
        }
    })
    if (myResultsPerPage !== resultsPerPageDefault) {
        params.set('size', `n_${myResultsPerPage}_n`);
    } else {
        params.delete('size');
    }
    if (myCurrent > 1) {
        params.set('current', `n_${myCurrent}_n`);
    } else {
        params.delete('current');
    }
    return params
}

export const searchURLUpdate = async () => {
    updateURL.update(v => true);
    const params = buildURLParams();
    if (`${params}`) {
        window.history.replaceState({}, '', `${location.pathname}?${params}`);
    } else {
        window.history.replaceState({}, '', `${location.pathname}`);
    }
    updateURL.update(v => false);
};

export const toggleAdvancedSearch = async () => {
    await searchCanvas.update(v => {
      Object.keys(v).map(key => {
        v[key].active = !v[key].active;
      });
      return v
    });
    await searchInput.update(v => {
      Object.keys(v).map(key => {
        v[key].value = '';
      });
      return v
    });
    await advancedSearch.update(v => Object.keys(mySearchCanvas).some(key => mySearchCanvas[key].active === mySearchCanvas[key].advanced))
    await searchURLUpdate();
};

export const toggleFuzzySearch = async () => {
    await fuzzySearch.update(v => !v);
    await searchInput.update(v => {
        Object.keys(v).map(key => {
          v[key].fuzzy = myFuzzySearch ? "auto" : false;
        });
        return v
    });
    searchSubmit();
    searchURLUpdate();
    gtag('event', 'button', {
        event_category: 'recherche',
        event_label: searchString(mySearchInput)
      });
};
