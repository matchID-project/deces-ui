{#if !$autocompleteBypass && $autocompleteDisplay && !error}
  <div class="autocomplete-container">
    <div class="container is-widescreen" style="margin-left: 15px; margin-top:-20px;">
      <span class="is-uppercase is-size-7 is-small has-text-grey">
        Résultats
      </span>

      <table class="table is-narrow is-striped">
        <thead>
          <tr class="is-uppercase has-text-grey">
            <td class="is-size-7 is-small has-text-grey"> Prénom Nom </td>
            <td class="is-size-7 is-small has-text-grey"> Naissance </td>
            <td class="is-size-7 is-small has-text-grey"> Décès </td>
          </tr>
        </thead>
        <tbody>
          {#each $autocompleteResults as result, index}
            {#if index < 10 && !result.error}
              <tr
                class="is-size-7 is-hoverable"
                on:click|preventDefault={onSelectAutocomplete(result)}
              >
                <td>
                  {result.PRENOM.raw} {result.NOM.raw}
                </td>
                <td>
                  {result.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")
                  } {
                  result.COMMUNE_NAISSANCE
                  ? "- " + result.COMMUNE_NAISSANCE.raw
                  : result.PAYS_NAISSANCE
                    ? "- " + result.PAYS_NAISSANCE.raw
                    : ""
                  }
                </td>
                <td>
                  {result.DATE_DECES.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")
                  } {
                    result.COMMUNE_DECES
                    ? "- " + result.COMMUNE_DECES.raw
                    : result.PAYS_DECES
                      ? "- " + result.PAYS_DECES.raw
                      : ""
                    }
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}

<script>
  import { searchInput, autocompleteBypass, autocompleteResults, autocompleteDisplay, advancedSearch } from '../tools/stores.js';
  import { search, searchSubmit, searchURLUpdate } from '../tools/search.js';

  let error;

  $: error = $autocompleteResults.some(r => r.error)

  const onSelectAutocomplete = async (selection) => {
    searchInput.update( v => {
      if ($advancedSearch) {
        v.lastName.value = selection.NOM.raw;
        v.firstName.value = selection.PRENOM.raw;
        v.birthYear.value = selection.DATE_NAISSANCE.raw.substring(0, 4)
      } else {
        v.fullText.value = selection.PRENOM.raw + " " + selection.NOM.raw + " " +
          selection.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")
      }
      return v
    })
    searchSubmit();
    searchURLUpdate();
  }

</script>

<style>
  .autocomplete-container {
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
    z-index: 1;
    display: flex;
    flex-direction: column;
    left: 0;
    right: 0;
    top: 110%;
    margin: 0;
    padding: 24px 0 12px 0;
    line-height: 1.5;
    background: white;
    position: absolute;
    box-shadow: rgba(59, 69, 79, 0.3) 0px 2px 4px;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .table:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  .table {
    background-color: #fff;
    color: #363636;
    text-align: left;
  }

  .table tbody {
    background-color: transparent;
  }

  .content table:not(:last-child) {
    margin-bottom: 1em;
  }

  .content table {
    width: 100%;
  }

  .content table td,.table td {
    border: solid #dbdbdb;
    border-width: 0 0 1px;
    padding: .5em .75em;
    vertical-align: top;
  }

  .content table tbody tr:last-child td,.content table tbody tr:last-child th,.table tbody tr:last-child td,.table tbody tr:last-child th {
    border-bottom-width: 0;
  }

  .table.is-fullwidth {
    width: 100%;
  }

  .table.is-narrow td {
    padding: .25em .5em;
  }

  .table.is-striped tbody tr:not(.is-selected):nth-child(2n) {
    background-color: #fafafa;
  }

  @media screen and (min-width:1024px) {
    .container {
      max-width: 960px;
    }
  }

  @media screen and (min-width:1216px) {
    .container {
      max-width: 1152px;
    }
  }

  @media screen and (min-width:1408px) {
    .container {
      max-width: 1344px;
    }
  }

.container {
  flex-grow: 1;
  margin: 0 auto;
  position: relative;
  width: auto;
}

  .is-uppercase {
    text-transform: uppercase!important;
  }

  .is-size-7 {
    font-size: .75rem !important;
  }

  .has-text-grey {
    color: hsl(0, 0%, 48%)!important;
  }



</style>
