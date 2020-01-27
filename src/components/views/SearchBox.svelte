
  <div class="container autocomplete column is-6" style="margin-top: -15px;">
    <form
      class="columns is-vcentered is-multiline"
      on:submit|preventDefault={handleSubmit}
    >
      <div class="column is-9">
        <div>
          <div>
            {#each Object.keys($searchInput) as key}
              {#if isActive(key)}
                <input
                  autoComplete="off"
                  placeholder={$searchInput[key].placeholder}
                  class="is-size-5 is-fullwidth"
                  bind:value={$searchInput[key].value}
                  on:input={autocomplete}
                  on:blur={focusInput(key,false)}
                  on:focus={focusInput(key,true)}
                />
              {/if}
            {/each}
          </div>
        </div>
      </div>
      <div class="column is-3">
        <button
          type="submit"
          class="button is-size-5 is-fullwidth is-info"
        >
          Recherche
        </button>
      </div>
      <Autocomplete/>
    </form>

  </div>


<script>
  import { searchInput, searchCanvas, autocompleteResults, autocompleteDisplay, searchInputFocus } from '../tools/stores.js';
  import { search, searchSubmit, searchURLUpdate } from '../tools/search.js';
  import Autocomplete from './Autocomplete.svelte';

  $: $autocompleteDisplay=Object.keys($searchInputFocus).some(key => $searchInputFocus.focus);

  const isActive = (key) => {
    let path = $searchInput[key].path ? $searchInput[key].path.replace(/\..*/,"") : undefined
    let subPath = $searchInput[key].path ? $searchInput[key].path.replace(/(^[^\.]*$|.*\.(.*)$)/,"$2") : ""
    subPath = subPath ?
                ( path ?
                  ( ( $searchCanvas[path] && $searchCanvas[path][subPath] ) ?
                      $searchCanvas[path][subPath].active
                      : false )
                  : false )
              : true
    path = path ? ( $searchCanvas[path] ? $searchCanvas[path].active : false ) : true
    return path && subPath
  }

  const focusInput = (key, value) => {
    setTimeout(() => {
      searchInputFocus.update(v => {
        v[key]=value;
        return v
      })
    }, 300);
  }

  const handleSubmit = () => {
    searchSubmit();
    searchURLUpdate();
  }

  const autocomplete = async () => {
    if ($searchInput.fullText.value.length > 1) {
      const state = await search($searchInput);
      $autocompleteResults = state.results;
      $autocompleteDisplay = ($autocompleteResults.length > 0)
    } else {
      $autocompleteResults = []
      $autocompleteDisplay = false
    }
  }

</script>

<style>

  input {
    height: 2.35em;
    width: 100%;
  }

  .container {
    flex-grow: 1;
    margin: 0 auto;
    position: relative;
    width: auto;
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

  .column {
    display: block;
    flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 1;
    padding: .75rem;
  }

  .is-size-5 {
    font-size: 1.25rem!important;
  }

  .button {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    align-items: center;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: none;
    display: inline-flex;
    font-size: 1rem;
    height: 2.25em;
    line-height: 1.5;
    position: relative;
    vertical-align: top;
    background-color: #fff;
    border-color: #dbdbdb;
    border-width: 1px;
    color: #363636;
    cursor: pointer;
    justify-content: center;
    padding: calc(.375em - 1px) .75em;
    text-align: center;
    white-space: nowrap;
    box-sizing: border-box;
  }

  .button:active,.button:focus {
    outline: 0;
  }

  .button:hover {
    border-color: #b5b5b5;
    color: #363636;
  }

  .button:focus {
    border-color: #3273dc;
    color: #363636;
  }

  .button:focus:not(:active) {
    box-shadow: 0 0 0 .125em rgba(50,115,220,.25);
  }

  .button:active {
    border-color: #4a4a4a;
    color: #363636;
  }

  .button.is-info,.button.is-info:hover {
    background-color: #209cee;
    border-color: transparent;
    color: #fff;
  }

  .button.is-info:hover {
    background-color: #1496ed;
  }

  .button.is-info:focus {
    border-color: transparent;
    color: #fff;
  }

  .button.is-info:focus:not(:active) {
    box-shadow: 0 0 0 .125em rgba(32,156,238,.25);
  }

  .button.is-info:active {
    background-color: #118fe4;
    border-color: transparent;
    color: #fff;
  }

  .button.is-fullwidth {
    display: flex;
    width: 100%;
  }


  .columns.is-mobile>.column.is-3 {
    flex: none;
    width: 25%;
  }

  .columns.is-mobile>.column.is-9 {
    flex: none;
    width: 75%;
  }

  @media print,screen and (min-width:769px) {
    .column.is-3 {
      flex: none;
      width: 25%;
    }

    .column.is-6 {
      flex: none;
      width: 50%;
    }

    .column.is-9 {
      flex: none;
      width: 75%;
    }

    .column.is-12 {
      flex: none;
      width: 100%;
    }
  }

  .columns {
    margin-left: -.75rem;
    margin-right: -.75rem;
    margin-top: -.75rem;
  }

  .columns:last-child {
    margin-bottom: -.75rem;
  }

  .columns:not(:last-child) {
    margin-bottom: .75rem;
  }

  .columns.is-mobile {
    display: flex;
  }

  .columns.is-multiline {
    flex-wrap: wrap;
  }

  .columns.is-vcentered {
    align-items: center;
  }

  @media print,screen and (min-width:769px) {
    .columns:not(.is-desktop) {
      display: flex;
    }
  }

  *, ::after, ::before {
    box-sizing: inherit;
  }

</style>