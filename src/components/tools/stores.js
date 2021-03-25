import { writable } from 'svelte/store';
import {
    dateRangeTypingMask,
    dateRangeValidationMask,
    dateRangeTransformMask,
    sexTypingMask,
    sexValidationMask,
    sexTransformMask,
    ageRangeTypingMask,
    ageRangeValidationMask,
    ageRangeTransformMask
} from './masks.js';
import {
    ageRangeStringQuery,
    dateRangeStringQuery,
    firstNameQuery,
    fuzzyTermQuery,
    matchQuery
} from './queries.js';

export const searchInput = writable({
    fullText: {
        section: "Recherche simplifiée",
        label: "Nom, prénom, date de naissance ou de décès",
        path: "fullText",
        url: "q",
        backendQuery: "q",
        value: "",
        field: "fullText",
        placeholder: "Pompidou Georges 02/04/1974",
        title: "Saisissez en recherche libre nom, prénom, date de naissance ou de décès",
        size: "rf-col-12",
        active: true,
    },
    lastName: {
        section: "Recherche avancée",
        label: "Nom",
        path: "name",
        url: "ln",
        value: "",
        field: "NOM",
        sortField: "NOM.raw",
        query: fuzzyTermQuery,
        fuzzy: "auto",
        placeholder: "Pompidou",
        title: "Saisissez le nom",
        size: "rf-col-12",
        active: true,
    },
    firstName: {
        label: "Prénom",
        path: "name",
        url: "fn",
        value: "",
        field: "PRENOM",
        sortField: "PRENOM.raw",
        query: firstNameQuery,
        fuzzy: "auto",
        placeholder: "Georges",
        title: "Saisissez le prénom",
        size: "rf-col-8",
        active: true,
    },
    sex: {
        label: "Genre",
        path: "birth.location",
        url: "sex",
        value: "",
        field: "SEXE",
        query: matchQuery,
        fuzzy: false,
        placeholder: "F/M",
        title:"Saisissez le sexe",
        mask: {
            typing: sexTypingMask,
            validation: sexValidationMask,
            transform: sexTransformMask
        },
        size: "rf-col-4",
        active: true,
    },
    birthDate: {
        section: "Naissance",
        label: "Date",
        path: "birth.date",
        url: "bd",
        before: "le",
        value: "",
        field: "DATE_NAISSANCE",
        sortField: "DATE_NAISSANCE.raw",
        placeholder: "1910-1912 ou 1911 ou 05/07/1911",
        query: dateRangeStringQuery,
        fuzzy: "auto",
        title:"Saisissez la date de naissance: 05/07/1911 ou 1911 ou un intervalle : 1909-1915, 01/01/1911-01/09/1911",
        mask: {
            typing: dateRangeTypingMask,
            validation: dateRangeValidationMask,
            transform: dateRangeTransformMask
        },
        size: "rf-col-6",
        active: true
    },
    birthCity: {
        label: "Commune",
        path: "birth.location",
        url: "bc",
        before: "à",
        value: "",
        field: "COMMUNE_NAISSANCE",
        sortField: "COMMUNE_NAISSANCE.raw",
        query: fuzzyTermQuery,
        fuzzy: "auto",
        placeholder: "Montboudif",
        title:"Saisissez la commune de naissance",
        size: "rf-col-6",
        active: true,
    },
    birthDepartment: {
        label: "Département",
        path: "birth.location",
        url: "bdep",
        before: "dans le",
        value: "",
        field: "DEPARTEMENT_NAISSANCE",
        sortField: "DEPARTEMENT_NAISSANCE",
        query: matchQuery,
        fuzzy: false,
        placeholder: "15",
        title:"Saisissez le département de naissance",
        size: "rf-col-6",
        active: true,
    },
    birthCountry: {
        label: "Pays",
        path: "birth.location",
        url: "bco",
        before: "en/au",
        value: "",
        field: "PAYS_NAISSANCE",
        sortField: "PAYS_NAISSANCE.raw",
        query: fuzzyTermQuery,
        fuzzy: "auto",
        title:"Saisissez le pays de naissance",
        placeholder: "France",
        size: "rf-col-6",
        active: true,
    },
    deathDate: {
        label: "Date",
        path: "death.date",
        url: "dd",
        before: "le",
        section:"Décès",
        value: "",
        field: "DATE_DECES",
        sortField: "DATE_DECES.raw",
        query: dateRangeStringQuery,
        fuzzy: "auto",
        placeholder: "1970-1980 ou 1974 ou 04/02/1974",
        multiQuery: "range",
        title:"Saisissez la date de décès: 04/02/1974 ou 1974 ou un intervalle : 1970-1980 ou 01/01/1974-01/06/1974",
        mask: {
            typing: dateRangeTypingMask,
            validation: dateRangeValidationMask,
            transform: dateRangeTransformMask
        },
        size: "rf-col-6",
        active: true,
    },
    deathAge: {
        label: "Âge",
        path: "death.location",
        url: "dage",
        value: "",
        field: "AGE_DECES",
        sortField: "AGE_DECES",
        query: ageRangeStringQuery,
        fuzzy: false,
        title: "Saisissez l'âge au décès, ou une plage d'âge : 75-80",
        placeholder: "78",
        multiQuery: "range",
        mask: {
            typing: ageRangeTypingMask,
            validation: ageRangeValidationMask,
            transform: ageRangeTransformMask
        },
        size: "rf-col-6",
        active: true
    },
    deathCity: {
        label: "Commune",
        path: "death.location",
        url: "dc",
        before: "à",
        value: "",
        field: "COMMUNE_DECES",
        sortField: "COMMUNE_DECES.raw",
        query: fuzzyTermQuery,
        fuzzy: "auto",
        title:"Saisissez la commune de décès",
        placeholder: "Paris",
        size: "rf-col-4",
        active: true,
    },
    deathDepartment: {
        label:"Département",
        path: "death.location",
        url: "ddep",
        before: "dans le",
        value: "",
        field: "DEPARTEMENT_DECES",
        sortField: "DEPARTEMENT_DECES",
        query: matchQuery,
        fuzzy: false,
        placeholder: "75",
        title:"Saisissez le département de décès",
        size: "rf-col-4",
        active: true,
    },
    deathCountry: {
        label: "Pays",
        path: "death.location",
        url: "dco",
        before: "en/au",
        value: "",
        field: "PAYS_DECES",
        sortField: "PAYS_DECES.raw",
        query: fuzzyTermQuery,
        fuzzy: "auto",
        placeholder: "France",
        title:"Saisissez le pays de décès",
        size: "rf-col-4",
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

export const fuzzySearch = writable(true);

export const searchMinLength = writable(1);

export const advancedSearch = writable(false);

export const wasSearched = writable(false);

export const searchResults = writable([]);

export const totalResults = writable(0);

export const totalBuckets = writable(0);

export const actualBuckets = writable(0);

export const totalPages = writable(0);

export const facets = writable(0);

export const sortDirection = writable("false");

export const sortField = writable(false);

export const filters = writable(false);

export const resultsPerPage = writable(20);

export const maxResults = writable(__ES_MAX_RESULTS__);

export const maxResultsPerPage = writable(__ES_MAX_RESULTS__);

export const resultsPerPageDefault = 20;

export const current = writable(1);

export const scrollId = writable(null);

export const route = writable({});

export const scrollIdTimeout = 59000;

export const updateURL = writable(false);

export const displayMode = writable('card');

export const searchTyping = writable(0);

export const triggerAggregations = writable(false);

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
        label: "sexe",
        input: "sex"
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
        label: "décès: âge",
        input: "deathAge"
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

export const liveConfig = writable(null);

export const mitmUrl = writable('__MITM_URL__');

export const themeDnum = writable(parseInt('__THEME_DNUM__'))

export const linkFile = writable(null);

export const linkWaiter = writable(false);

export const linkFileSizeLimit = writable('__API_MAX_BODY__'.replace(/m$/,'000000'));

export const linkFileName = writable(null);

export const linkFileSize = writable(null);

export const linkStep = writable(1);

export const linkSourceHeader = writable(null);

export const linkSourceHeaderTypes = writable(null);

export const linkOptions = writable({
    csv: undefined,
    api: {
        candidateNumber: 10,
        pruneScore: 0.3
    },
    check: {
        autoCheckSimilar: true,
        displayUnmappedColumns: false,
        autoCheckThreshold: 0.85,
        similarThreshold: 0.97,
        filter: ''
    }
});

export const linkMapping = writable({});

export const linkMinFields = writable(3);

export const linkJob = writable(null);

export const linkResults = writable(null);
export const linkCompleteResults = writable(null);

export const linkValidations = writable(null);

export const linkCompleted = writable(false);

export const version = writable({
    ui: '__APP__ version __APP_VERSION__',
    data: {
        version: 'd8cd99c0',
        updateDate: '12/03/2021',
        lastRecordDate: '26/02/2021',
        lastDataset: 'deces-2021-m02',
        rawRecordsCount: 25721738,
        uniqRecordsCount: 25562141
    }
})

export const activeElement = writable(undefined);

const updateActiveElement = (event) => {
    activeElement.update(v => {
        return document.activeElement;
    })
};

document.addEventListener('focus', updateActiveElement, true);
document.addEventListener('blur', updateActiveElement, true);

export const firstSearch = writable(true);

export const alphaFeatures = writable(false);

export const accessToken = writable('');

export const user = writable('');