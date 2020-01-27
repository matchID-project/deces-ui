import { writable } from 'svelte/store';

export const searchInput = writable({
    fullText: {
        path: "fullText",
        value: "",
        field: "fullText",
        placeholder: "prénom, nom, date de naissance ou de décès, ... e.g. Georges Pompidou",
        size: 12,
        active: true,
    },
    lastName: {
        path: "name",
        value: "",
        field: "NOM",
        placeholder: "Pompidou",
        size: 7,
        active: true,
    },
    firstName: {
        path: "name",
        value: "",
        field: "PRENOM",
        placeholder: "Georges",
        size: 5,
        active: true,
    },
    birthDate: {
        path: "birth.date",
        before: "le",
        value: "",
        field: "ANNEE_NAISSANCE",
        placeholder: "05/07/1911",
        size: 1,
        active: false,
    },
    birthYear: {
        path: "birth.date",
        before: "en",
        value: "",
        field: "ANNEE_NAISSANCE",
        placeholder: "1911",
        size: 1,
        active: true,
    },
    birthYearRange: {
        path: "birth.date",
        before: ["entre", "et"],
        value: ["", ""],
        field: "ANNEE_NAISSANCE",
        placeholder: ["1910", "1920"],
        size: 1,
        active: false,
    },
    birtCity: {
        path: "birth.location",
        before: "à",
        value: "",
        field: "COMMUNE_NAISSANCE",
        placeholder: "Montboudif",
        size: 4,
        active: true,
    },
    birthDepartment: {
        path: "birth.location",
        before: "dans le",
        value: "",
        field: "DEP_NAISSANCE",
        placeholder: "15",
        size: 1,
        active: true,
    },
    birthCountry: {
        path: "birth.location",
        before: "en/au",
        value: "",
        field: "PAYS_NAISSANCE",
        placeholder: "France",
        size: 2,
        active: true,
    },
    deathDate: {
        path: "death.date",
        before: "le",
        value: "",
        field: "ANNEE_NAISSANCE",
        placeholder: "05/07/1911",
        size: 1,
        active: false,
    },
    deathYear: {
        path: "death.date",
        before: "en",
        value: "",
        field: "ANNEE_NAISSANCE",
        placeholder: "1911",
        size: 1,
        active: true,
    },
    deathYearRange: {
        path: "death.date",
        before: ["entre", "et"],
        value: ["", ""],
        field: "ANNEE_NAISSANCE",
        placeholder: ["1910", "1920"],
        size: 1,
        active: false,
    },
    deathCity: {
        path: "death.location",
        before: "à",
        value: "",
        field: "COMMUNE_NAISSANCE",
        placeholder: "Montboudif",
        size: 4,
        active: true,
    },
    deathDepartment: {
        path: "death.location",
        before: "dans le",
        value: "",
        field: "DEP_NAISSANCE",
        placeholder: "15",
        size: 1,
        active: true,
    },
    deathCountry: {
        path: "death.location",
        before: "en/au",
        value: "",
        field: "PAYS_NAISSANCE",
        placeholder: "France",
        size: 2,
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
    birthYearRange: {
        focus: false
    },
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
    deathYearRange: {
        focus: false
    },
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
        active: true
    },
    name: {
        active: false
    },
    birth: {
        active: false,
        date: {
            active: true
        },
        location: {
            active: true
        }
    },
    death: {
        active: false,
        date: {
            active: true
        },
        location: {
            active: true
        }
    }
});

export const cachedResponses = writable({})

export const autocompleteResults = writable([]);

export const wasSearched = writable(false);

export const searchResults = writable([]);

export const totalResults = writable(0);

export const totalPages = writable(0);

export const facets = writable(0);

export const sortDirection = writable("false");

export const sortField = writable(false);

export const filters = writable(false);

export const resultsPerPage = writable(20);

export const current = writable(1);

export const updateURL = writable(false);

export const autocompleteDisplay = writable(false);