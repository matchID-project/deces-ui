import { writable } from 'svelte/store';
import {
    dateRangeTypingMask,
    dateRangeValidationMask,
    dateRangeTransformMask
} from './masks.js';
import {
    prefixQuery,
    dateRangeStringQuery,
    firstNameQuery,
    fuzzyTermQuery,
    matchQuery
} from './queries.js'

export const searchInput = writable({
    fullText: {
        path: "fullText",
        url: "q",
        backendQuery: "q",
        value: "",
        field: "fullText",
        placeholder: "nom, prénom, date de naissance ou de décès, ... e.g. Pompidou Georges",
        title: "saisissez en recherche libre nom, prénom, date de naissance ou de décès",
        size: 12,
        active: true,
    },
    lastName: {
        path: "name",
        url: "ln",
        value: "",
        section:"nom/prénoms",
        field: "NOM",
        sortField: "NOM.raw",
        query: fuzzyTermQuery,
        fuzzy: "auto",
        placeholder: "Pompidou",
        title: "saisissez le nom",
        size: 6,
        active: true,
    },
    firstName: {
        path: "name",
        url: "fn",
        value: "",
        field: ["PRENOM","PRENOMS"],
        sortField: "PRENOM.raw",
        query: firstNameQuery,
        fuzzy: "auto",
        placeholder: "Georges",
        title: "saisissez le prénom",
        size: 4,
        active: true,
    },
    birthDate: {
        path: "birth.date",
        url: "bd",
        before: "le",
        section:"naissance",
        value: "",
        field: "DATE_NAISSANCE",
        sortField: "DATE_NAISSANCE.raw",
        placeholder: "1910-1912 ou 1911 ou 05/07/1911",
        query: dateRangeStringQuery,
        fuzzy: "auto",
        title:"saisissez la date de naissance: 05/07/1911 ou 1911 ou un intervalle : 1909-1915, 01/01/1911-01/09/1911",
        mask: {
            typing: dateRangeTypingMask,
            validation: dateRangeValidationMask,
            transform: dateRangeTransformMask
        },
        size: 2,
        active: true
    },
    birthCity: {
        path: "birth.location",
        url: "bc",
        before: "à",
        value: "",
        field: "COMMUNE_NAISSANCE",
        sortField: "COMMUNE_NAISSANCE.raw",
        query: fuzzyTermQuery,
        fuzzy: "auto",
        placeholder: "commune: Montboudif",
        title:"saisissez la commune de naissance",
        size: "3-5",
        active: true,
    },
    birthDepartment: {
        path: "birth.location",
        url: "bdep",
        before: "dans le",
        value: "",
        field: "DEPARTEMENT_NAISSANCE",
        sortField: "DEPARTEMENT_NAISSANCE",
        query: matchQuery,
        fuzzy: false,
        placeholder: "dépt: 15",
        title:"saisissez le département de naissance",
        size: "1-5",
        active: true,
    },
    birthCountry: {
        path: "birth.location",
        url: "bco",
        before: "en/au",
        value: "",
        field: "PAYS_NAISSANCE",
        sortField: "PAYS_NAISSANCE.raw",
        query: fuzzyTermQuery,
        fuzzy: "auto",
        title:"saisissez le pays de naissance",
        placeholder: "pays: France",
        size: 3,
        active: true,
    },
    deathDate: {
        path: "death.date",
        url: "dd",
        before: "le",
        section:"décès",
        value: "",
        field: "DATE_DECES",
        sortField: "DATE_DECES.raw",
        query: dateRangeStringQuery,
        fuzzy: "auto",
        placeholder: "1970-1980 ou 1974 ou 04/02/1974",
        multiQuery: "range",
        title:"saisissez la date de décès: 04/02/1974 ou 1974 ou un intervalle : 1970-1980 ou 01/01/1974-01/06/1974",
        mask: {
            typing: dateRangeTypingMask,
            validation: dateRangeValidationMask,
            transform: dateRangeTransformMask
        },
        size: 2,
        active: true,
    },
    deathCity: {
        path: "death.location",
        url: "dc",
        before: "à",
        value: "",
        field: "COMMUNE_DECES",
        sortField: "COMMUNE_DECES.raw",
        query: fuzzyTermQuery,
        fuzzy: "auto",
        title:"saisissez la commune de décès",
        placeholder: "commune: Paris",
        size: "3-5",
        active: true,
    },
    deathDepartment: {
        path: "death.location",
        url: "ddep",
        before: "dans le",
        value: "",
        field: "DEPARTEMENT_DECES",
        sortField: "DEPARTEMENT_DECES",
        query: matchQuery,
        fuzzy: false,
        placeholder: "dépt: 75",
        title:"saisissez le département de décès",
        size: "1-5",
        active: true,
    },
    deathCountry: {
        path: "death.location",
        url: "dco",
        before: "en/au",
        value: "",
        field: "PAYS_DECES",
        sortField: "PAYS_DECES.raw",
        query: fuzzyTermQuery,
        fuzzy: "auto",
        placeholder: "pays: France",
        title:"saisissez le pays de décès",
        size: 3,
        active: true,
    }
});

export const searchInputFocus = writable({
    fullText: {
        focus: false
    },
    lastName: {
        focus: false
    },
    firstName: {
        focus: false
    },
    birthDate: {
        focus: false
    },
    birthYear: {
        focus: false
    },
    // birthYearRange: {
    //     focus: false
    // },
    birtCity: {
        focus: false
    },
    birthDepartment: {
        focus: false
    },
    birthCountry: {
        focus: false
    },
    deathDate: {
        focus: false
    },
    deathYear: {
        focus: false
    },
    // deathYearRange: {
    //     focus: false
    // },
    deathCity: {
        focus: false
    },
    deathDepartment: {
        focus: false
    },
    deathCountry: {
        focus: false
    }
})

export const searchCanvas = writable({
    fullText: {
        active: true,
        advanced: false
    },
    name: {
        active: false,
        advanced: true
    },
    birth: {
        active: false,
        advanced: true,
        date: {
            active: true
        },
        location: {
            active: true
        }
    },
    death: {
        active: false,
        advanced: true,
        date: {
            active: true
        },
        location: {
            active: true
        }
    }
});

export const cachedResponses = writable({});

export const waitSearch = writable(false);

export const accordeonMode = writable(true);

export const autocompleteBypass = writable(true);

export const autocompleteResults = writable([]);

export const autocompleteMinLength = writable(2);

export const fuzzySearch = writable(true);

export const searchMinLength = writable(1);

export const advancedSearch = writable(false);

export const wasSearched = writable(false);

export const searchResults = writable([]);

export const totalResults = writable(0);

export const totalPages = writable(0);

export const facets = writable(0);

export const sortDirection = writable("false");

export const sortField = writable(false);

export const filters = writable(false);

export const resultsPerPage = writable(20);

export const resultsPerPageDefault = 20;

export const current = writable(1);

export const updateURL = writable(false);

export const autocompleteDisplay = writable(false);

export const searchTyping = writable(0);

export const socialIcons = false;

export const sortInput = writable([
    {
        label: "score",
        input: "score",
        field: "_score",
        order: "desc"
    },
    {
        label: "nom",
        input: "lastName",
    },
    {
        label: "prénom",
        input: "firstName",
    },
    {
        label: "naissance: date",
        input: "birthDate"
    },
    {
        label: "naissance: commune",
        input: "birthCity",
    },
    {
        label: "naissance: département",
        input: "birthDepartment",
    },
    {
        label: "naissance: pays",
        input: "birthCountry",
    },
    {
        label: "décès: date",
        input: "deathDate"
    },
    {
        label: "décès: commune",
        input: "deathCity",
    },
    {
        label: "décès: département",
        input: "deathDepartment",
    },
    {
        label: "décès: pays",
        input: "deathCountry",
    }
]);

export const sortInputDisplay = writable(false);

export const dataGouvCatalog = writable(null);

export const infoDisplayOption = writable(false);

export const apiVersion = writable(
    ((Math.floor(Math.random() * (101)) > parseInt('__AB_THRESHOLD__')) ? 'elasticsearch' : 'backend')
);
