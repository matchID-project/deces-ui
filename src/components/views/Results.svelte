{#if searchTrigger($searchInput) }
  <div class="results-body">
    <div class="container">
      <div class="margin">
        <ResultsHeader/>
        {#if ($displayMode && ['card','card-expand'].includes($displayMode))}
          <div class="columns is-vcentered is-multiline is-mobile">
            {#each $searchResults as result, index}
              <ResultCard result={result}/>
            {/each}
          </div>
        {:else }
          <div class="content">
            <table class="table is-narrow is-striped is-size-7" style="margin-top:24px!important;">
              {#each columns as column}
                <col style={column.width ? `width: ${column.width};`: ""}/>
              {/each}
              <tr class="is-grey" >
                <th colspan="3" scope="colgroup">état civil</th>
                <th colspan="5" scope="colgroup">naissance</th>
                <th colspan="8" scope="colgroup">décès</th>
              </tr>
              <tr class="is-grey" >
                {#each columns as column, index}
                  <th class={`th-label ${column.field ? "th-sortable" : ""}`} scope="col"
                    on:click={e => toggleSort(column.field)}
                    title={column.field ? "cliquez pour activer/désactiver le tri" : undefined}
                  >
                    {column.label}
                    {#if column.order}
                      <FontAwesomeIcon icon={column.order === "desc" ? faSortDown : faSortUp } class="is-small is-low"/>
                    {/if}
                  </th>
                {/each}
              </tr>
              {#each $searchResults as result, index}
                <ResultRow result={result} index={index}/>
              {/each}
            </table>
          </div>
        {/if}
        <Pagination/>
      </div>
    </div>
  </div>
{/if}

<script>
  import { onMount } from 'svelte';
  import getDataGouvCatalog from '../tools/getDataGouvCatalog.js';
  import { searchResults, searchInput,
    sortInput, displayMode } from '../tools/stores.js';
  import { searchTrigger } from '../tools/search.js';
  import ResultsHeader from './ResultsHeader.svelte';
  import ResultCard from "./ResultCard.svelte";
  import ResultRow from "./ResultRow.svelte";
  import Pagination from './Pagination.svelte';
  import FontAwesomeIcon from './FontAwesomeIcon.svelte';
  import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

  onMount(async () => { getDataGouvCatalog() });

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

  .table {
    table-layout:fixed
  }
  .th-label {
    height: 2.5rem;
  }

  .th-sortable:hover {
        color: #209cee;
        cursor: pointer;
    }

  .is-grey {
    background-color: #fafafa;
  }
  .results-body {
      max-width: 1235px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      padding: 0 24px;
  }

  @media (max-width: 800px) {
    .results-body {
        width: 100%;
        display: block;
        padding: 0 15px;
     }
  }

  .margin {
      padding: 24px 0px 32px 0px;
  }

  @media (max-width: 800px) {
    .margin {
        width: 100%;
        padding-left: 0;
    }
  }

  *, ::after, ::before {
    box-sizing: inherit;
  }
</style>