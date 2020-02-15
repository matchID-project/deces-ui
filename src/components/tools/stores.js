import { writable } from 'svelte/store';

export const searchInput = writable({
    fullText: {
        path: "fullText",
        url: "q",
        value: "",
        field: "fullText",
        placeholder: "prénom, nom, date de naissance ou de décès, ... e.g. Georges Pompidou",
        title: "saisissez en recherche libre nom, prénom, date de naissance ou de décès",
        size: 12,
        active: true,
    },
    firstName: {
        path: "name",
        url: "fn",
        value: "",
        section:"prénoms/nom",
        field: "PRENOM",
        placeholder: "Georges",
        title: "saisissez le prénom",
        size: 4,
        active: true,
    },
    lastName: {
        path: "name",
        url: "ln",
        value: "",
        field: "NOM",
        placeholder: "Pompidou",
        title: "saisissez le nom",
        size: 6,
        active: true,
    },
    birthDate: {
        path: "birth.date",
        url: "bd",
        before: "le",
        section:"naissance",
        value: "",
        field: "ANNEE_NAISSANCE",
        placeholder: "05/07/1911",
        title:"saisissez la date de naissance",
        size: 2,
        active: false,
    },
    birthYear: {
        path: "birth.date",
        url: "by",
        before: "en",
        section:"naissance",
        value: "",
        field: "DATE_NAISSANCE",
        query: "prefix",
        placeholder: "1911",
        title:"saisissez l'année de naissance",
        size: "1-5",
        active: true,
    },
    // birthYearRange: {
    //     path: "birth.date",
    //     url: "byr",
    //     before: ["entre", "et"],
    //     section:"naissance",
    //     value: ["", ""],
    //     field: "ANNEE_NAISSANCE",
    //     placeholder: ["1910", "1920"],
    //     size: 1,
    //     active: false,
    // },
    birthCity: {
        path: "birth.location",
        url: "bc",
        before: "à",
        value: "",
        field: "COMMUNE_NAISSANCE",
        placeholder: "commune: Montboudif",
        title:"saisissez la commune de naissance",
        size: 4,
        active: true,
    },
    birthDepartment: {
        path: "birth.location",
        url: "bdep",
        before: "dans le",
        value: "",
        query: "match",
        field: "DEPARTEMENT_NAISSANCE",
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
        title:"saisissez le pays de naissance",
        placeholder: "pays: France",
        size: 3,
        active: true,
    },
    deathDate: {
        path: "death.date",
        url: "dd",
        section:"décès",
        before: "le",
        value: "",
        field: "DATE_DECES",
        title:"recherche par date de décès bientôt disponible",
        placeholder: "05/07/1911",
        size: 1,
        active: false,
    },
    deathYear: {
        path: "death.date",
        url: "dy",
        section:"décès",
        before: "en",
        value: "",
        field: "DATE_DECES",
        query: "prefix",
        placeholder: "1974",
        size: "1-5",
        active: true
    },
    // deathYearRange: {
    //     path: "death.date",
    //     url: "dyr",
    //     section:"décès",
    //     before: ["entre", "et"],
    //     value: ["", ""],
    //     field: "DATE_DECES",
    //     placeholder: ["1911", "1974"],
    //     size: 1,
    //     active: false,
    // },
    deathCity: {
        path: "death.location",
        url: "dc",
        before: "à",
        value: "",
        field: "COMMUNE_DECES",
        title:"saisissez la commune de décès",
        placeholder: "commune: Paris",
        size: 4,
        active: true,
    },
    deathDepartment: {
        path: "death.location",
        url: "ddep",
        before: "dans le",
        value: "",
        field: "DEPARTEMENT_DECES",
        query: "match",
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