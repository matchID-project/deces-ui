import { searchInput, searchResults, totalResults, totalPages, facets } from './stores.js'
import buildRequest from "./buildRequest.js";
import runRequest from "./runRequest.js";
import buildState from "./buildState.js";

let mySearchInput;

const s = searchInput.subscribe((value) => { mySearchInput=value })

export const search = async (searchInput) => {
    const requestBody = buildRequest(searchInput);
    const json = await runRequest(requestBody);
    const state = buildState(json);
    return state;
}

export const searchSubmit = async () => {
    const state = await search(mySearchInput);
    searchResults.update( v => state.results );
    totalResults.update(v => state.totalResults);
    totalPages.update(v => state.totalPages);
    facets.update(v => state.facets);
}
