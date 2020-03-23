import {
    searchInput,
    searchCanvas,
    searchResults,
    searchMinLength,
    totalResults,
    totalPages,
    facets,
    current,
    updateURL,
    resultsPerPage,
    resultsPerPageDefault,
    autocompleteBypass,
    autocompleteDisplay,
    autocompleteMinLength,
    advancedSearch,
    wasSearched,
    waitSearch,
    fuzzySearch,
    apiVersion
} from './stores.js'

import buildRequest from "./buildRequest.js";
import runRequest from "./runRequest.js";
import buildState from "./buildState.js";

let mySearchInput;
let mySearchCanvas;
let myCurrent;
let myResultsPerPage;
let myAutocompleteBypass;
let myAutocompleteMinLength;
let myAdvancedSearch;
let mySearchMinLength;
let myWaitSearch;
let myFuzzySearch;
let myApiVersion;

const s = searchInput.subscribe((value) => { mySearchInput=value });
const sc = searchCanvas.subscribe((value) => { mySearchCanvas=value });
const sm = searchMinLength.subscribe((value) => { mySearchMinLength=value });
const c = current.subscribe((value) => { myCurrent=value });
const r = resultsPerPage.subscribe((value) => { myResultsPerPage=value });
const a = autocompleteMinLength.subscribe((value) => { myAutocompleteMinLength=value });
const av = advancedSearch.subscribe((value) => { myAdvancedSearch=value });
const b = autocompleteBypass.subscribe((value) => { myAutocompleteBypass=value });
const w = waitSearch.subscribe((value) => { myWaitSearch=value });
const f = fuzzySearch.subscribe((value) => {myFuzzySearch = value});
const p = apiVersion.subscribe((value) => {myApiVersion = value});

export const searchAutocompleteTrigger = (searchInput) => {
    return Object.keys(searchInput).some(key => searchInput[key].value.length >= myAutocompleteMinLength);
};

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
      }).join(' ')
};

export const search = async (searchInput, newCurrent) => {
    if (newCurrent) { current.update(v => newCurrent) }
    else { current.update(v => 1) }
    const request = buildRequest(searchInput);
    const json = await runRequest(request);
    const state = buildState(json, myResultsPerPage);
    return state;
};

export const searchSubmit = async (newCurrent) => {
    if (searchTrigger(mySearchInput) && (!myWaitSearch)) {
        waitSearch.update( v => true);
        const state = await search(mySearchInput, newCurrent);
        searchResults.update( v => state.results );
        totalResults.update(v => state.totalResults);
        totalPages.update(v => state.totalPages);
        facets.update(v => state.facets);
        autocompleteDisplay.update(v => false);
        wasSearched.update(v => searchString(mySearchInput));
        waitSearch.update( v => false);
    }
};

export const buildURLParams = () => {
    const params = new URLSearchParams(location.search);
    if (myAdvancedSearch) {
        params.set('advanced',true)
    } else {
        params.delete('advanced')
    }
    if (!myFuzzySearch) {
        params.set('fuzzy',false)
    } else {
        params.delete('fuzzy')
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
