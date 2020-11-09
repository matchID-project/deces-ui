import About from '../views/About.svelte';
import Search from '../views/Search.svelte';
import Link from '../views/Link.svelte';

import {
    route,
    activeElement
} from './stores.js'

let myRoute;

import { URLSearchSubmit } from './search.js';

const r = route.subscribe((value) => { myRoute=value });

export const routes = {
    '/': { component: Search },
    '/search': { component: Search,
        query: ['view', 'advanced', 'fuzzy',
        'ln', 'fn', 'sex','bd','bc','bdep','bco',
        'dd','dc','ddep','dco','dage'],
        cb: (query) => URLSearchSubmit(new URLSearchParams(query))
    },
    '/about': { component: About },
    '/link': { component: Link }
};

export const redirect = () => {
    const mySearchParams = new URLSearchParams(location.search);
    const query = {};
    mySearchParams.forEach((key, value) => query[value] =  key);
    if (location.pathname === '/') {
        if (`${location.search}`) {
            window.history.replaceState({}, '', `/search${location.search}`);
        } else {
            window.history.replaceState({}, '', `/search`);
        }
    }
    route.update(v => { return {path: location.pathname, query: query, hash: location.hash}; });
};

export const goTo =  (r) => {
    activeElement.update(v => {
        v && v.blur();
        return undefined;
    });
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



