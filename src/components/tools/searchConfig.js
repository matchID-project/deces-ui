import buildRequest from "./buildRequest";
import runRequest from "./runRequest";
// import applyDisjunctiveFaceting from "./applyDisjunctiveFaceting";
import buildState from "./buildState";

const config = {
  // debug: true,
  // hasA11yNotifications: true,
  onResultClick: () => {
    /* Not implemented */
  },
  onAutocompleteResultClick: () => {
    /* Not implemented */
  },
  onAutocomplete: async state => {
    const searchParams = state.searchParams;
    const searchTerm = state.searchTerm;
    const requestBody = buildRequest({ searchParams, searchTerm });
    if (!state.isFetching) {
      const json = await runRequest(requestBody);
      const state = buildState(json);
      return {
        autocompletedResults: state.results
      };
    }
  },
  onSearch: async state => {
    console.log(state)
    const { resultsPerPage } = state;
    const requestBody = buildRequest(state);
    // Note that this could be optimized by running all of these requests
    // at the same time. Kept simple here for clarity.
    const responseJson = await runRequest(requestBody);
    // const responseJsonWithDisjunctiveFacetCounts = await applyDisjunctiveFaceting(
    //   responseJson,
    //   state,
    //   ["PAYS_NAISSANCE", "COMMUNE_NAISSANCE"]
    // );
    return buildState(responseJson, resultsPerPage);
    // return buildState(responseJsonWithDisjunctiveFacetCounts, resultsPerPage);
  }
};

const searchParamsList = [
  {
    inputs: [
      {
       field: "fullText",
       placeholder: "prénom, nom, date de naissance ou de décès ... e.g Georges Pompidou",
       size: 12
      }
    ],
    fuzzy: true
  },
  {
    inputs: [
      {
        field: "fullText",
        placeholder: "prénom, nom, date de naissance ou de décès ... e.g Georges Pompidou",
        size: 12
       },
      {
        field: "NOM",
        placeholder: "nom ... e.g Pompidou",
        size: 7
      },
      {
        field: "PRENOM",
        placeholder: "prenom ... e.g Georges",
        size: 5
      },
      {
        field: "ANNEE_NAISSANCE",
        placeholer: "année de naissance ... eg 1904",
        size: 2
      },
      {
        field: "DEP_NAISSANCE",
        placeholer: "département de naissance ... eg 66",
        size: 3
      },
      {
        field: "COMMUNE_NAISSANCE",
        placeholer: "commune de naissance ... eg Perpignan",
        size: 7
      },
      {
        field: "ANNEE_DECES",
        placeholer: "année de décès ... eg 1904",
        size: 2
      },
      {
        field: "DEP_DECES",
        placeholer: "département de décès ... eg 66",
        size: 3
      },
      {
        field: "COMMUNE_DECES",
        placeholer: "commune de décès ... eg Perpignan",
        size: 7
      }
    ]
  }
];
