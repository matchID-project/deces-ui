{#if searchTrigger($searchInput) }
    <div class="rf-container-fluid rf-margin-top-1N rf-padding-left-2N--desktop rf-padding-left-1N--mobile rf-padding-right-1N--mobile">
      <div class="rf-grid-row rf-text--sm">
        {#if $wasSearched && ($searchResults.length === 0)}
          <div class="rf-col-12">
            <h4 class="rf-h4 rf-text--center">Oups... pas de résultats pour votre recherche</h4>
            <Info filter={true}/>
          </div>
        {:else if $wasSearched && ($searchResults.length === 1) && ($searchResults[0].error)}
          {#if $searchResults[0].status === 422}
            <div class="rf-col-xl-2 rf-col-lg-2 rf-col-md-1 rf-col-sm-12 rf-col-xs-12"></div>
            <div class="rf-col-xl-8 rf-col-lg-8 rf-col-md-10 rf-col-sm-12 rf-col-xs-12 rf-margin-top-4N">
                <h4 class="rf-h4 rf-text--center">
                  <strong>
                    Pour poursuivre, enregistrez-vous !
                  </strong>
                </h4>
              <p>
                L'usage anonyme du service est dorénavant limité en nombre de requêtes.
              </p>
              <p>
                Pour poursuivre immédiatement, sans limite d'usage et toujours gratuitement, vous pouvez simplement saisir votre mail, puis le code envoyé pour confirmer
                votre identité. Nous ne faisons strictement aucun usage de cette addresse autre que la journalisation (statistique, légale).
              </p>
              <p>
                Sinon, vous pourrez à nouveau utiliser le service de façon anonyme dans quelques heures.
              </p>
            </div>
            <div class="rf-col-xl-2 rf-col-lg-2 rf-col-md-1 rf-col-sm-12 rf-col-xs-12"></div>
            <div class="rf-col-xl-2 rf-col-lg-2 rf-col-md-1 rf-col-sm-12 rf-col-xs-12"></div>
            <div class="rf-col-xl-8 rf-col-lg-8 rf-col-md-10 rf-col-sm-12 rf-col-xs-12 rf-margin-top-2N rf-content--center">
              <LoginField style="width:100%;max-width: 400px;margin: auto;" button/>
            </div>
          {:else}
            <div class="rf-col-xl-3 rf-col-lg-2 rf-col-md-1 rf-col-sm-12 rf-col-xs-12"></div>
            <div class="rf-col-xl-6 rf-col-lg-8 rf-col-md-10 rf-col-sm-12 rf-col-xs-12 rf-margin-top-4N">
                <h4 class="rf-h4 rf-text--center rf-color--rm">
                    <span class="rf-fi-alert-line rf-fi--xl">
                    </span>
                    <br>
                    {$searchResults[0].status} {$searchResults[0].statusText} {$searchResults[0].msg || ""}
                </h4>
                <p class="rf-text--left rf-padding-left-2N rf-padding-right-2N">
                    {@html $searchResults[0].status === 429
                        ? "Le service étant fortement sollicité, votre requête est temporisée. Veuillez réessayer dans quelques secondes. Si le problème persiste, vous devrez revenir ultérieurement."
                        : "Le service est indisponible. Veuillez réessayer dans quelques minutes. Si l'erreur perdure, veuillez nous contacter __API_EMAIL__"
                    }
                </p>
            </div>
          {/if}
        {:else if $wasSearched}
          <div class="rf-col-12">
            {#if ($displayMode && ['card','card-expand'].includes($displayMode))}
              <div class="rf-container-fluid">
                <div class="rf-grid-row is-vcentered">
                  {#each $searchResults as result, index}
                    <ResultCard result={result} index={index+from}/>
                  {/each}
                </div>
              </div>
            {:else if (($displayMode === 'table') && $wasSearched && ($searchResults.length > 0))}
              <div style="overflow-x: auto">
                <table class="rf-table rf-table--narrow rf-table--striped rf-text--xs rf-color--black rf-margin-top-1N">
                  {#each columns as column}
                    <col style={column.width ? `width: ${column.width};`: ""}/>
                  {/each}
                  <thead>
                    <tr>
                      <th colspan="3" scope="colgroup">état civil</th>
                      <th colspan="5" scope="colgroup">naissance</th>
                      <th colspan="8" scope="colgroup">décès</th>
                    </tr>
                    <tr>
                      {#each columns as column, index}
                        <th
                          class="rf-table-th--label {column.field ? "rf-table-th--sortable" : ""}"
                          scope="col"
                          on:click={e => toggleSort(column.field)}
                          title={column.field ? "cliquez pour activer/désactiver le tri" : undefined}
                        >

                          {#if column.order === "desc"}
                            <span class="rf-fi-arrow-down-s-line rf-fi--md">{column.label}</span>
                          {:else if column.order === "asc"}
                            <span class="rf-fi-arrow-up-s-line rf-fi--md">{column.label}</span>
                          {:else}
                            {column.label}
                          {/if}
                        </th>
                      {/each}
                    </tr>
                  </thead>
                  {#each $searchResults as result, index}
                    <ResultRow result={result} index={index}/>
                  {/each}
                </table>
              </div>

            {:else if ($displayMode === 'geo')}
              {#if Geo}
                <svelte:component this={Geo}/>
              {/if}
            {:else if ($displayMode === 'agg')}
              <Aggregations />
            {/if}
          </div>
          {#if !(['geo', 'agg'].includes($displayMode))}
            <div class="rf-col-12 rf-content--center rf-margin-top-1N rf-margin-bottom-2N">
              <Pagination/>
            </div>
          {/if}
        {/if}
      </div>
    </div>
{/if}

<script>
  import { searchResults, searchInput, totalResults, current, resultsPerPage,
    sortInput, displayMode, wasSearched } from '../tools/stores.js';
  import { searchTrigger } from '../tools/search.js';
  let Geo;
  import('./Geo.svelte').then(module => {
    Geo = module.default;
  });
  import Aggregations from './Aggregations.svelte';
  import Pagination from './Pagination.svelte';
  import ResultCard from "./ResultCard.svelte";
  import ResultRow from "./ResultRow.svelte";
  import ResultsHeader from './ResultsHeader.svelte';
  import Info from './Info.svelte';
  import LoginField from './LoginField.svelte';

  let from;
  let columns = [
    { label: "nom", field: "lastName", width: "100px"},
    { label: "prénom(s)", field: "firstName", width: "160px"},
    { label: "sexe", field: "sex",  width: "30px"},
    { label: "date", field: "birthDate",  width: "80px"},
    { label: "commune", field: "birthCity", width: "120px"},
    { label: "code INSEE", width: "50px"},
    { label: "dép", field: "birthDepartment", width: "30px"},
    { label: "pays", field: "birthCountry", width: "70px"},
    { label: "date", field: "deathDate", width: "80px"},
    { label: "âge", field: "deathAge", width: "35px"},
    { label: "commune", field: "deathCity", width: "120px"},
    { label: "code INSEE", width: "50px"},
    { label: "dep", field: "deathDepartment", width: "30px"},
    { label: "pays", field: "deathCountry", width: "70px"},
    { label: "n° acte", field: "deathCertificateId", width: "50px"},
    { label: "source", field: "source", width: "70px"},
  ]
  const toggleSort= (field) => {
    if (!field) {return}
    sortInput.update(v =>
      v.filter(k => k.input === field).map(item => { return {
        label: item.label,
        input: item.input,
        field: item.field,
        order: item.order ? (item.order === "desc" ? "asc" : undefined ) : "desc"
      }}).concat(v.filter(item => item.input !== field)));
  };

  $: from = Math.min($totalResults, 1 + ($current - 1) * $resultsPerPage);

  $: columns = columns.map(item => {
      return {
        label: item.label,
        field: item.field,
        width: item.width,
        order: $sortInput && $sortInput.filter(k => k.input === item.field) &&
          $sortInput.filter(k => k.input === item.field)[0] &&
          $sortInput.filter(k => k.input === item.field)[0].order
      }
  });

</script>

<style>
</style>
