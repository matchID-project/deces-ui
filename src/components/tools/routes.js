import About from '../views/About.svelte';
import Search from '../views/Search.svelte';
import Link from '../views/Link.svelte';

import {
    advancedSearch,
    current,
    displayMode,
    fuzzySearch,
    resultsPerPage,
    searchCanvas,
    searchInput,
    updateURL,
    route
} from './stores.js'

import { URLSearchSubmit } from './search.js';

let mySearchInput;
let myUpdateURL;
let myFuzzySearch;
let myRoute;

const s = searchInput.subscribe((value) => { mySearchInput=value });
const u = updateURL.subscribe((value) => { myUpdateURL=value });
const f = fuzzySearch.subscribe((value) => { myFuzzySearch=value });
const r = route.subscribe((value) => { myFuzzySearch=value });

export const routes = {
    '/': { component: Search },
    '/search': { component: Search,
        query: ['view', 'advanced', 'fuzzy',
        'ln', 'fn', 'sex','bd','bc','bdep','bco',
        'dd','dc','ddep','dco','dage'],
        cb: (query) => URLSearchSubmit(new URLSearchParams(query))
    },
    '/about/service': { component: About, props: { page: 'service'} },
    '/about/data': { component: About, props: { page: 'data'} },
    '/link': { component: Link }
};

export const redirect = () => {
    const mySearchParams = new URLSearchParams(location.search);
    const query = {};
    mySearchParams.forEach((key, value) => query[key] =  value);
    if (location.pathname === '/') {
        if (`${location.search}`) {
            window.history.replaceState({}, '', `/search${location.search}`);
        } else {
            window.history.replaceState({}, '', `/search`);
        }
    }
    route.update(v => { return {path: location.pathname, query: query}; });
};

export const goTo =  (r) => {
    if (Object.keys(routes).includes(r.path)) {
        const queryString = Object.keys(r.query || {})
            .filter(k => routes[r.path] && routes[r.path].query)
            .map(k => `${k=params[k]}`).join('&');
        if (queryString) {
            window.history.replaceState({}, '', `${r.path}?${queryString}`);
        } else {
            window.history.replaceState({}, '', `${r.path}`);
        }
        route.update(v => r);
        if (routes[r.path] && routes[r.path].cb) {
            routes[r.path].cb(queryString);
        }
    }
};



