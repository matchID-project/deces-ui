import Default from '../views/Default.svelte';
import Search from '../views/Search.svelte';
import ShowId from '../views/ShowId.svelte';
import Link from '../views/Link.svelte';
import LinkJobs from '../views/LinkJobs.svelte';
import Stats from '../views/Stats.svelte';

import {
    route,
    activeElement,
    wasSearched
} from './stores.js'

let myRoute;

import { URLSearchSubmit, getById } from './search.js';

export const routes = {
    '/': {
        component: Search,
        title: 'Moteur de recherche des personnes décédées',
        desc: 'Moteur de recherche gratuit des personnes décédées, basé sur la source des fichiers de décès INSEE (1970 à aujourd\'hui)',
    },
    '/id': {
        component: ShowId,
        title: 'Moteur de recherche des personnes décédées',
        desc: 'Moteur de recherche gratuit des personnes décédées, basé sur la source des fichiers de décès INSEE (1970 à aujourd\'hui)',
        pathArgs: ['id'],
        cb: (query) => getById(query)
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
    '/jobs': { component: LinkJobs, title: 'Traitements', desc: 'page d\'administration des traitements' },
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
                window.history.replaceState({}, '', '/search');
            }
        }
        const paths = location.pathname.split('/');
        paths.shift();
        route.update(v => {
            return {
                path: `/${paths.shift()}`,
                params: (paths.length > 0) && paths,
                query: query,
                hash: location.hash.replace(/\?.*/,'')
            };
        });
    } else if (!Object.keys(routes).includes(myRoute.path)) {
        window.history.replaceState({}, '', '/notFound');
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
    wasSearched.update(v => false);
    if (Object.keys(routes).includes(r.path)) {
        let query;
        let queryPath;
        if (r.query && Object.keys(r.query).length) {
            query = Object.keys(r.query)
                .filter(k => routes[r.path] && routes[r.path].query && routes[r.path].query.includes(k))
                .map(k => `${k}=${r.query[k]}`).join('&');
            queryPath = query && `?${query}`;
        }
        if (r.params && r.params.length) {
            query = {};
            (routes[r.path] && routes[r.path].params || []).map((k,i) => {
                query[k] = r.params[i];
            });
            queryPath = `/${r.params.join('/')}`;
        }
        route.update(v => r);
        if (queryPath) {
            window.history.replaceState({}, '', `${r.path}${queryPath}`);
        } else {
            window.history.replaceState({}, '', `${r.path}`);
        }
        if (routes[r.path] && routes[r.path].cb) {
            routes[r.path].cb(query);
        }
    } else {
        goTo({path: 'notFound'})
    }
};



