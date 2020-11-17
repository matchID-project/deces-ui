import Default from '../views/Default.svelte';
import Search from '../views/Search.svelte';
import Link from '../views/Link.svelte';
import Stats from '../views/Stats.svelte';

import {
    route,
    activeElement
} from './stores.js'

let myRoute;

import { URLSearchSubmit } from './search.js';

export const routes = {
    '/': { component: Search },
    '/search': { component: Search,
        query: ['view', 'advanced', 'fuzzy',
        'ln', 'fn', 'sex','bd','bc','bdep','bco',
        'dd','dc','ddep','dco','dage'],
        cb: (query) => URLSearchSubmit(new URLSearchParams(query))
    },
    '/about': { component: Default, props: {title: 'à propos'} },
    '/link': { component: Link },
    '/stats': { component: Stats },
    '/notFound': { component: Default, props: {title: 'pas de page à l\'adresse indiquée'} },
};

const rs = route.subscribe((value) => {
    myRoute=value;
    if (!myRoute.path) {
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
    } else if (!Object.keys(routes).includes(myRoute.path)) {
        window.history.replaceState({}, '', `/notFound`);
        route.update(v => {
            v.path = '/notFound';
            return v;
        });
    }
});

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
    } else {
        goTo({path: 'notFound'})
    }
};



