import {
    searchInput,
    searchResults,
    totalResults,
    totalPages,
    facets,
    current,
    updateURL,
    resultsPerPage,
    autocompleteDisplay,
    wasSearched
} from './stores.js'

import buildRequest from "./buildRequest.js";
import runRequest from "./runRequest.js";
import buildState from "./buildState.js";

let mySearchInput;
let myCurrent;
let myResultsPerPage;

const s = searchInput.subscribe((value) => { mySearchInput=value })
const c = current.subscribe((value) => { myCurrent=value })
const r = resultsPerPage.subscribe((value) => { myResultsPerPage=value })

export const search = async (searchInput, newCurrent) => {
    // console.log(JSON.stringify(searchInput.fullText))
    if (newCurrent) { current.update(v => newCurrent) }
    else { current.update(v => 1) }
    const requestBody = buildRequest(searchInput);
    const json = await runRequest(requestBody);
    const state = buildState(json, myResultsPerPage);
    return state;
}

export const searchSubmit = async (newCurrent) => {
    const state = await search(mySearchInput, newCurrent);
    searchResults.update( v => state.results );
    totalResults.update(v => state.totalResults);
    totalPages.update(v => state.totalPages);
    facets.update(v => state.facets);
    autocompleteDisplay.update(v => false);
    wasSearched.update(v => true);
}

export const searchURLUpdate = async () => {
    updateURL.update(v => true);
    const params = new URLSearchParams(location.search);
    if (mySearchInput.fullText.value) {
        params.set('q', mySearchInput.fullText.value);
        params.set('size', `n_${myResultsPerPage}_n`);
        if (myCurrent > 1) {
            params.set('current', `n_${myCurrent}_n`)
        };
        window.history.replaceState({}, '', `${location.pathname}?${params}`);
        updateURL.update(v => false);
    };

}
