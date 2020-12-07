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
    '/': {
        component: Search,
        title: 'Moteur de recherche des personnes décédées',
        desc: 'Moteur de recherche gratuit des personnes décédées, basé sur la source des fichiers de décès INSEE (1970 à aujourd\'hui)',
    },
    '/search': {
        component: Search,
        title: 'Moteur de recherche des personnes décédées',
        desc: 'Moteur de recherche gratuit des personnes décédées, basé sur la source des fichiers de décès INSEE (1970 à aujourd\'hui)',
        query: ['view', 'advanced', 'fuzzy',
        'ln', 'fn', 'sex','bd','bc','bdep','bco',
        'dd','dc','ddep','dco','dage'],
        cb: (query) => URLSearchSubmit(new URLSearchParams(query))
    },
    '/about': { component: Default, props: {title: 'À propos'}, title: 'À propos', desc: 'À propos de matchID: conditions légales données et code opensource, foire aux questions, documentation de l\'API, statistiques de consultation, ...'},
    '/link': { component: Link, title: 'Appariement', desc: 'matchID permet l\'appariement de votre fichier client, jusque 1 million d\'enregistrements, au fichier des décès de l`INSEE' },
    '/stats': { component: Stats, title: 'statistiques de fréquentation', desc: 'statistiques de consultation de deces.matchid.io: visiteurs uniques, appels API, ... historique depuis début 2020' },
    '/notFound': { component: Default, props: { title: 'Pas de page à l\'adresse indiquée'}, title: '404 - Pas de page à l\'adresse indiquée', desc: '404' },
};

const rs = route.subscribe((value) => {
    myRoute=value;
    if (!myRoute.path) {
        const mySearchParams = new URLSearchParams(location.search || location.href.replace(/.*\?/,''));
        const query = {};
        mySearchParams.forEach((key, value) => query[value] =  key);
        if (location.pathname === '/') {
            if (`${location.search}`) {
                window.history.replaceState({}, '', `/search${location.search}`);
            } else {
                window.history.replaceState({}, '', `/search`);
            }
        }
        route.update(v => { return {path: location.pathname, query: query, hash: location.hash.replace(/\?.*/,'')}; });
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
            .filter(k => routes[r.path] && routes[r.path].query && routes[r.path].query.includes(k))
            .map(k => `${k}=${r.query[k]}`).join('&');
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



