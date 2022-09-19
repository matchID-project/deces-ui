import sum from 'hash-sum';

import { dataCorrections } from './dataCorrections.js';

import { capitalize } from './masks.js';

import {
    searchInput,
    searchCanvas,
    searchResults,
    searchMinLength,
    sortInput,
    totalResults,
    totalPages,
    current,
    updateURL,
    resultsPerPage,
    resultsPerPageDefault,
    advancedSearch,
    wasSearched,
    waitSearch,
    fuzzySearch,
    scrollId,
    displayMode,
    activeElement,
    triggerAggregations
} from './stores.js';

import buildRequest from "./buildRequest.js";
import { runSearchRequest, runIdRequest } from "./runRequest.js";

let mySearchInput;
let mySortInput;
let mySearchCanvas;
let myCurrent;
let myResultsPerPage;
let myAdvancedSearch;
let mySearchMinLength;
let mySearchResults;
let myWaitSearch;
let myFuzzySearch;
let myDisplayMode;
let myUpdateURL;

const s = searchInput.subscribe((value) => { mySearchInput=value });
const so = sortInput.subscribe((value) => { mySortInput=value });
const sc = searchCanvas.subscribe((value) => { mySearchCanvas=value });
const sr = searchResults.subscribe((value) => { mySearchResults=value });
const sm = searchMinLength.subscribe((value) => { mySearchMinLength=value });
const c = current.subscribe((value) => { myCurrent=value });
const r = resultsPerPage.subscribe((value) => { myResultsPerPage=value });
const av = advancedSearch.subscribe((value) => { myAdvancedSearch=value });
const w = waitSearch.subscribe((value) => { myWaitSearch=value });
const f = fuzzySearch.subscribe((value) => {myFuzzySearch = value});
const d = displayMode.subscribe((value) => {myDisplayMode = value});
const u = updateURL.subscribe((value) => { myUpdateURL=value });

const today = new Date(Date.now());
const currentYear = today.getFullYear();
const currentMonth = today.getMonth()+1;


export const enableDisplayMode = async (mode) => {
    if (myDisplayMode) {
        if ((myDisplayMode === 'geo') && (mode !== 'geo')) {
            if (mySearchResults.length >  resultsPerPageDefault) {
                searchResults.update(v => v.splice(0, resultsPerPageDefault));
            }
            resultsPerPage.update(v => resultsPerPageDefault);
        } else if ((myDisplayMode !== 'agg') && (mode === 'agg')) {
            if (searchTrigger(mySearchInput)) {
                triggerAggregations.update(v => true);
            }
        }
      displayMode.update(v => mode);
    }
    activeElement.update(v => {
        v.blur();
        return undefined;
    });
    searchURLUpdate();
  }

const computeTotalPages = (resultsPerPage, totalResults) => {
    if (!resultsPerPage) return 0;
    if (totalResults === 0) return 1;
    return Math.ceil(totalResults / resultsPerPage);
};

export const searchTrigger = (searchInput) => {
    return (myDisplayMode === 'agg') || Object.keys(searchInput).some(key => searchInput[key].value.length >= mySearchMinLength) &&
           Object.keys(searchInput).every(key =>
            (searchInput[key].mask && searchInput[key].mask.validation)
            ? searchInput[key].mask.validation(searchInput[key].value)
            : true
           )
};

export const searchString = (searchInput) => {
    if (searchInput.fullText.value) return searchInput.fullText.value.split(/\s+/).map(capitalize).join(' ');
    let e = 'é.e';
    if (searchInput.sex.value === 'F') {
        e = 'ée';
    } else if (searchInput.sex.value === 'M') {
        e = 'é';
    }
    let name;
    if (searchInput.lastName.value) {
        if (!searchInput.firstName.value) {
            name = `${searchInput.lastName.value.toUpperCase()}`;
        } else {
            name =`${searchInput.lastName.value.toUpperCase()} ${capitalize(searchInput.firstName.value)}`;
        }
    } else {
        if (searchInput.firstName.value) {
            name = `prénomm${e} ${capitalize(searchInput.firstName.value)}`
        }
    }
    let sex;
    if (searchInput.sex.value === 'F') {
        sex = name ? '(F)' : 'femme';
    } else if (searchInput.sex.value === 'M') {
        sex = name ? '(M)' : 'homme';
    } else {
        sex = name ? '' : 'personne'
    }
    let birth=''
    if (searchInput.birthDate.value||searchInput.birthCity.value||searchInput.birthDepartment.value||searchInput.birthCountry.value) {
        birth = [`n${e}`];
        if (searchInput.birthDate.value) {
            if (searchInput.birthDate.value.length === 4) {
                birth.push(`en ${searchInput.birthDate.value}`)
            } else if (searchInput.birthDate.value.length === 10) {
                birth.push(`le ${searchInput.birthDate.value}`)
            } else if (searchInput.birthDate.value.length === 9) {
                birth.push(`entre ${searchInput.birthDate.value.split('-')[0]} et ${searchInput.birthDate.value.split('-')[1]}`)
            } else {
                birth.push(`entre le ${searchInput.birthDate.value.split('-')[0]} et le ${searchInput.birthDate.value.split('-')[1]}`)
            }
        }
        if (searchInput.birthCity.value) {
            birth.push(`à ${capitalize(searchInput.birthCity.value)}`)
            if (searchInput.birthDepartment.value) {
                birth.push(`(${searchInput.birthDepartment.value})`)
            }
            if (searchInput.birthCountry.value) {
                birth.push(`${capitalize(searchInput.birthCountry.value)}`)
            }
        } else {
            if (searchInput.birthDepartment.value) {
                birth.push(`dans le ${searchInput.birthDepartment.value}`)
                    if (searchInput.birthCountry.value) {
                        birth.push(`${capitalize(searchInput.birthCountry.value)}`)
                    }
                } else {
                    if (searchInput.birthCountry.value) {
                        birth.push(`en ${capitalize(searchInput.birthCountry.value)}`)
                    }
                }
            }
        birth = birth.join(' ');
    }
    let death='';
    if (searchInput.deathDate.value||searchInput.deathAge.value||searchInput.deathCity.value||searchInput.deathDepartment.value||searchInput.deathCountry.value) {
        death = [`décéd${e}`];
        if (searchInput.deathAge.value) {
            death.push(`à l'âge de ${searchInput.deathAge.value} ans`)
        }
        if (searchInput.deathDate.value) {
            if (searchInput.deathDate.value.length === 4) {
                death.push(`en ${searchInput.deathDate.value}`)
            } else if (searchInput.deathDate.value.length === 10) {
                death.push(`le ${searchInput.deathDate.value}`)
            } else if (searchInput.deathDate.value.length === 9) {
                death.push(`entre ${searchInput.deathDate.value.split('-')[0]} et ${searchInput.deathDate.value.split('-')[1]}`)
            } else {
                death.push(`entre le ${searchInput.deathDate.value.split('-')[0]} et le ${searchInput.deathDate.value.split('-')[1]}`)
            }
        }
        if (searchInput.deathCity.value) {
            death.push(`à ${capitalize(searchInput.deathCity.value)}`)
            if (searchInput.deathDepartment.value) {
                death.push(`(${searchInput.deathDepartment.value})`)
            }
            if (searchInput.deathCountry.value) {
                death.push(`${capitalize(searchInput.deathCountry.value)}`)
            }
        } else {
            if (searchInput.deathDepartment.value) {
                death.push(`dans le ${searchInput.deathDepartment.value}`)
                    if (searchInput.deathCountry.value) {
                        death.push(`${capitalize(searchInput.deathCountry.value)}`)
                    }
                } else {
                    if (searchInput.deathCountry.value) {
                        death.push(`en ${capitalize(searchInput.deathCountry.value)}`)
                    }
                }
            }
        death = death.join(' ');
    }
    return [name,sex,birth,death].filter(x => x).join(' ');
};

export const getById = async ({id: id}) => {
    const json = await runIdRequest(id);
    return json && json.response && json.response.persons && json.response.persons.map(correct)[0];
}

export const search = async (searchInput, newCurrent) => {
    if (newCurrent) { current.update(v => newCurrent) }
    else { current.update(v => 1) }
    const request = buildRequest(searchInput);
    const json = await runSearchRequest(request);
    return json && json.response;
};

const correct = (person) => {
    if (dataCorrections[person.id]) {
        person.correction = dataCorrections[person.id];
        if (person.correction.change === "cancel") {
            person.death = undefined;
            if (person.correction.anonymize !== false) {
                // each user may chose to display or not its full data
                // as a proof for them
                person.name.first = person.name.first.map((n,i) => (i) ? `${n[0]}****` : n);
                person.birth.location = {
                    departmentCode: person.birth.location.departmentCode,
                    country: person.birth.location.country,
                    countryCode: person.birth.location.countryCode
                }
            }
        }
        if (person.correction.change === "remove") {
            person.name = { first: ["INCONNU"], last: "INCONNU"};
            person.birth.sex = undefined;
            person.birth.date = "XXXX";
            person.birth.location = {
                departmentCode: "",
                country: person.birth.location.country,
                countryCode: person.birth.location.countryCode
            }
            person.death = undefined;
        }
    } else if ( person.death && (person.death.age !== null) && (person.death.age < 18) ) {
        if (person.death.date) {
            const deathSinceYears = currentYear - parseInt(person.death.date.substring(0,4)) - (currentMonth >= parseInt(person.death.date.substring(4,6)) ? 0 : 1);
            if (deathSinceYears < 10) {
                person.name.first = [ `${person.name.first[0][0]}****` ];
                person.name.last = `${person.name.last[0]}****`;
                person.birth.location = {
                    departmentCode: person.birth.location.departmentCode,
                    country: person.birth.location.country,
                    countryCode: person.birth.location.countryCode
                }
            }
            person.anonymize = "recentKidDeath";
        }
    }
    return person;
  };


export const searchSubmit = async (newCurrent) => {
    if (searchTrigger(mySearchInput) && (!myWaitSearch)) {
        await waitSearch.update( v => true);
        const state = await search(mySearchInput, newCurrent);
        await searchResults.update( v => state.persons.map(correct).filter(x => ! (x.correction && (x.correction.change === "remove"))));
        await totalResults.update(v => state.total);
        await totalPages.update(v => computeTotalPages(state.size, state.total));
        if (state.scrollId) {
            await scrollId.update(v => { return {
                context: sum(JSON.stringify(mySearchInput)+JSON.stringify(mySortInput)),
                id: state.scrollId,
                date: Date.now()
            }});
        }
        await wasSearched.update(v => searchString(mySearchInput));
        await waitSearch.update( v => false);
    }
};

export const buildURLParams = (localSearchInput, localAdvancedSearch, localFuzzySearch, localDisplayMode, localResultsPerPage, localCurrent) => {
    const params = new URLSearchParams();
    if (localAdvancedSearch) {
        params.set('advanced',true)
    } else {
        params.delete('advanced');
    }
    if (!localFuzzySearch) {
        params.set('fuzzy',false)
    } else {
        params.delete('fuzzy');
    }
    if (['geo', 'agg', 'table','card-expand'].includes(localDisplayMode)) {
        params.set('view', localDisplayMode);
    } else {
        params.delete('view');
    }
    Object.keys(localSearchInput).map(key => {
        if (localSearchInput[key].value !== "") {
            params.set(localSearchInput[key].url, localSearchInput[key].value);
        } else {
            params.delete(localSearchInput[key].url);
        }
    })
    if ((localResultsPerPage) && (localResultsPerPage !== resultsPerPageDefault)) {
        params.set('size', `n_${localResultsPerPage}_n`);
    } else {
        params.delete('size');
    }
    if (localCurrent > 1) {
        params.set('current', `n_${localCurrent}_n`);
    } else {
        params.delete('current');
    }
    return params;
}

export const searchURLUpdate = async () => {
    updateURL.update(v => true);
    const params = buildURLParams(mySearchInput, myAdvancedSearch, myFuzzySearch, myDisplayMode, myResultsPerPage, myCurrent);
    if (`${params}`) {
        window.history.replaceState({}, '', `${location.pathname}?${params}`);
    } else {
        window.history.replaceState({}, '', `${location.pathname}`);
    }
    updateURL.update(v => false);
};

export const toggleAdvancedSearch = async (arg) => {
    if (arg !== myAdvancedSearch) {
        await searchCanvas.update(v => {
            Object.keys(v).map(key => {
                v[key].active = !v[key].active;
            });
            return v
        });
        await advancedSearch.update(v => Object.keys(mySearchCanvas).some(key => mySearchCanvas[key].active === mySearchCanvas[key].advanced))
        await searchInput.update(v => {
            let fullText = '';
            let firstName = '';
            let lastName = '';
            if (myAdvancedSearch) {
                const names = v.fullText.value.split(/\s+/);
                lastName = names.length && names[0] || '';
                firstName = (names.length > 0) && names[1] || '';
            } else {
                fullText =  [v.lastName.value, v.firstName.value].filter(x => x).join(' ') || '';
            }
            Object.keys(v).map(key => {
                if (key === 'fullText') { v[key].value = fullText; }
                else if (key === 'firstName') { v[key].value = firstName; }
                else if (key === 'lastName') { v[key].value = lastName; }
                else { v[key].value = ''; }
            });
            return v
        });
        await searchSubmit();
        await searchURLUpdate();
    }
};

export const toggleFuzzySearch = async () => {
    await fuzzySearch.update(v => !v);
    await searchInput.update(v => {
        Object.keys(v).map(key => {
          v[key].fuzzy = myFuzzySearch ? "auto" : false;
        });
        return v
    });
    searchSubmit();
    searchURLUpdate();
    gtag('event', 'button', {
        event_category: 'recherche',
        event_label: searchString(mySearchInput)
      });
};

export const URLSearchSubmit = async (urlParams) => {
    if (!myUpdateURL) {
        displayMode.update(v => urlParams.get('view') ? urlParams.get('view') : 'card');
        const myCurrent = urlParams.get('current') ? parseInt(urlParams.get('current').replace(/n_(.*)_n/,"$1")) : undefined;
        const myResultsPerPage = urlParams.get('size') ? parseInt(urlParams.get('size').replace(/n_(.*)_n/,"$1")) : undefined;
        const myQuery = Object.keys(mySearchInput).map(key => {
            const q = urlParams.get(mySearchInput[key].url) || '';
            return [key, q];
        }).filter(x => x);
        if ( urlParams.get('fuzzy') === 'false' ) {
            fuzzySearch.update(v => false);
        }
        if ( urlParams.get('advanced') === 'true' ) {
            advancedSearch.update(v => true);
            searchCanvas.update(v => {
                Object.keys(v).map(key => {
                    v[key].active = !v[key].active;
                });
                return v
            });
        };

        if (myQuery) {
            if (myCurrent) { current.update(v => 1) }
            if (myResultsPerPage) { resultsPerPage.update(v => myResultsPerPage) }
            searchInput.update( v => {
                myQuery.map(q => {
                    v[q[0]].value = q[1]
                });
                Object.keys(v).map(key => {
                    v[key].fuzzy = myFuzzySearch ? "auto" : false;
                });
                return v;
            });
        }
    }
};
