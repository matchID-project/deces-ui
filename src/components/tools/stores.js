import { writable } from 'svelte/store';
import {
    dateRangeTypingMask,
    dateRangeValidationMask,
    dateRangeTransformMask
} from './masks.js';
import {
    prefixQuery,
    dateRangeStringQuery,
    fuzzyTermQuery,
    matchQuery
} from './queries.js'

export const searchInput = writable({
    fullText: {
        path: "fullText",
        url: "q",
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
        section:"prénoms/nom",
        field: "NOM",
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
        field: "PRENOM",
        query: fuzzyTermQuery,
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
        placeholder: "1910-1912",
        query: dateRangeStringQuery,
        fuzzy: "auto",
        title:"saisissez la date de naissance: 05/07/1911 ou 1911 ou 1909-1915",
        mask: {
            typing: dateRangeTypingMask,
            validation: dateRangeValidationMask,
            transform: dateRangeTransformMask
        },
        size: 2,
        active: true
    },
    birthYear: {
        path: "birth.date",
        url: "by",
        before: "en",
        section:"naissance",
        value: "",
        field: "DATE_NAISSANCE",
        query: prefixQuery,
        placeholder: "1911",
        fuzzy: false,
        title:"saisissez l'année de naissance",
        size: "1-5",
        active: false,
    },
    birthCity: {
        path: "birth.location",
        url: "bc",
        before: "à",
        value: "",
        field: "COMMUNE_NAISSANCE",
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
        query: dateRangeStringQuery,
        fuzzy: "auto",
        placeholder: "1970-1980",
        query: dateRangeStringQuery,
        fuzzy: "auto",
        multiQuery: "range",
        title:"saisissez la date de naissance: 04/02/1974 ou 1974 ou 1970-1980",
        mask: {
            typing: dateRangeTypingMask,
            validation: dateRangeValidationMask,
            transform: dateRangeTransformMask
        },
        size: 2,
        active: true,
    },
    deathYear: {
        path: "death.date",
        url: "dy",
        section:"décès",
        before: "en",
        value: "",
        field: "DATE_DECES",
        query: prefixQuery,
        fuzzy: false,
        placeholder: "1974",
        size: "1-5",
        active: false
    },
    deathCity: {
        path: "death.location",
        url: "dc",
        before: "à",
        value: "",
        field: "COMMUNE_DECES",
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

export const cachedResponses = writable({})

export const accordeonMode = writable(true);

export const autocompleteBypass = writable(true);

export const autocompleteResults = writable([]);

export const autocompleteMinLength = writable(2);

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
        field: "_score",
        order: "desc"
    },
    {
        label: "nom",
        field: "NOM.raw",
    },
    {
        label: "prénom",
        field: "PRENOM.raw",
    },
    {
        label: "naissance: date",
        field: "DATE_NAISSANCE.raw"
    },
    {
        label: "naissance: commune",
        field: "COMMUNE_NAISSANCE.raw",
    },
    {
        label: "naissance: département",
        field: "DEPARTEMENT_NAISSANCE",
    },
    {
        label: "naissance: pays",
        field: "PAYS_NAISSANCE.raw",
    },
    {
        label: "décès: date",
        field: "DATE_DECES.raw"
    },
    {
        label: "décès: commune",
        field: "COMMUNE_DECES.raw",
    },
    {
        label: "décès: département",
        field: "DEPARTEMENT_DECES",
    },
    {
        label: "décès: pays",
        field: "PAYS_DECES.raw",
    }
])

export const sortInputDisplay = writable(false)