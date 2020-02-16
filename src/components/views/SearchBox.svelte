<!-- <GoogleAnalytics ga={ga} trackingId={'UA-156429702-1'}/> -->
<div
  class={`container autocomplete column ${($advancedSearch && !$autocompleteBypass) ? "is-10" : "is-8"}`}
  style="margin-top: -15px;"
>
    <form
       class="columns is-vcentered is-multiline"
      on:submit|preventDefault={handleSubmit}
    >
      {#if !$autocompleteBypass}
        <div class="column is-1 is-hidden-mobile">
          <button
            type="reset"
            class="button is-size-5 is-info"
            on:click|preventDefault={ toggleAdvancedSearch }
            title={ $advancedSearch ? "retour à la recherche simple" : "activer la recherche avancée" }
          >
            <FontAwesomeIcon icon={ $advancedSearch ? faMinus : faPlus }/>
          </button>
        </div>
      {/if}

      <div class={`column ${$autocompleteBypass ? "is-11" : "is-9" }`}>
          <div class="columns is-multiline is-mobile">
            {#each inputsKeys as key}
              {#if isActive[key]}
                {#if $searchInput[key].section}
                  <span class="column is-size-5 is-2 is-mobile-fullwidth is-left">{$searchInput[key].section}</span>
                {/if}
                <input
                  autoComplete="off"
                  placeholder={$searchInput[key].placeholder}
                  class={"is-size-5 column is-" + $searchInput[key].size}
                  bind:value={$searchInput[key].value}
                  title={$searchInput[key].title}
                  on:input={handleInput}
                  on:blur={focusInput(key,false)}
                  on:focus={focusInput(key,true)}
                  disabled={$searchInput[key].disabled}
                />
              {/if}
            {/each}
          </div>
      </div>
      {#if !$autocompleteBypass}
        <div class="column is-2">
          <div class="columns is-mobile">
            <div class="column is-desktop12 is-mobile-6">
              <button
                type="submit"
                class="button is-size-5 is-fullwidth is-info"
              >
                Recherche
              </button>
            </div>
            <div class="column is-6 is-hidden-desktop">
              <button
                type="reset"
                class="button is-size-5 is-info is-fullwidth"
                on:click|preventDefault={ toggleAdvancedSearch }
                title={ $advancedSearch ? "retour à la recherche simple" : "activer la recherche avancée" }
              >
                <FontAwesomeIcon icon={ $advancedSearch ? faMinus : faPlus }/>
              </button>
            </div>
          </div>
        </div>
        <Autocomplete/>
      {:else}
        <div class="column is-1">
          <button
            type="reset"
            class="button is-fullwidth is-size-5 is-info small-margin-mobile"
            on:click|preventDefault={ toggleAdvancedSearch }
            title={ $advancedSearch ? "retour à la recherche simple" : "activer la recherche avancée" }
          >
            <FontAwesomeIcon icon={ $advancedSearch ? faMinus : faPlus }/>
          </button>
        </div>
      {/if}
    </form>
</div>


<script>
  import FontAwesomeIcon from './FontAwesomeIcon.svelte'

  import { advancedSearch, searchInput, searchCanvas, autocompleteBypass, autocompleteResults, autocompleteDisplay, searchInputFocus, searchTyping } from '../tools/stores.js';
  import { search, searchString, searchAutocompleteTrigger, searchSubmit, searchURLUpdate, toggleAdvancedSearch } from '../tools/search.js';
  import Autocomplete from './Autocomplete.svelte';

  import {
      faMinus,
      faPlus
  } from '@fortawesome/free-solid-svg-icons';

  let gtag;
  const gtagFail = () => {console.log("GA not loaded")}

  $: gtag = window.gtag || gtagFail;

  let inputKeys;

  $: inputsKeys = Object.keys($searchInput);

  $: $autocompleteDisplay=Object.keys($searchInputFocus).some(key => $searchInputFocus.focus);

  let isActive;

  $: isActive = Object.keys($searchInput).map((key) => {
    let path = $searchInput[key].path ? $searchInput[key].path.replace(/\..*/,"") : undefined
    let subPath = $searchInput[key].path ? $searchInput[key].path.replace(/(^[^\.]*$|.*\.(.*)$)/,"$2") : ""
    subPath = subPath ?
                ( path ?
                  ( ( $searchCanvas[path] && $searchCanvas[path][subPath] ) ?
                      $searchCanvas[path][subPath].active && $searchInput[key].active
                      : false )
                  : false )
              : true
    path = path ? ( $searchCanvas[path] ? $searchCanvas[path].active : false ) : true
    return [ key, path && subPath ]
  }).reduce((a, b) => {
    a = Array.isArray(a) ? { [a[0]]: a[1] } : a;
    a[b[0]]=b[1];
    return a;
  }

  );

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
    // gtag('config', 'UA-156429702-1');
    gtag('event', 'button', {
      event_category: 'recherche',
      event_label: searchString($searchInput)
    });
  }

  const startDate = new Date().getTime();

  const date = () => {
    return Math.round(new Date().getTime() - startDate);
  }

  const handleInput = () => {
    $searchTyping = date() + 350;
    setTimeout(() => {
      if (date() > $searchTyping) {
        if ($autocompleteBypass) {
          handleSubmit();
        } else {
          autocomplete();
        }
      } else {
        console.log("key input limiter")
      } }, 355);
  }

  const autocomplete = async () => {
    if (searchAutocompleteTrigger($searchInput)) {
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

  @media print,screen and (min-width:769px) {
    .column.is-1 {
      flex: none;
      width: 8%;
    }

    .column.is-1-5 {
      flex: none;
      width: 12.5%;
    }

    .column.is-2 {
      flex: none;
      width: 17%;
    }

    .column.is-3 {
      flex: none;
      width: 25%;
    }

    .column.is-4 {
      flex: none;
      width: 33%;
    }

    .column.is-5 {
      flex: none;
      width: 42%;
    }

    .column.is-6 {
      flex: none;
      width: 50%;
    }

    .column.is-7 {
      flex: none;
      width: 58%;
    }

    .column.is-8 {
      flex: none;
      width: 67%;
    }

    .column.is-9 {
      flex: none;
      width: 75%;
    }

    .column.is-11 {
      flex: none;
      width: 92%;
    }

    .column.is-12,
    .column.is-desktop-12 {
      flex: none;
      width: 100%;
    }
  }

  .is-left {
    text-align: left!important;
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

  @media print,screen and (max-width:768px) {
    .small-margin-mobile {
      margin-top: 0.75rem!important;
      margin-bottom:-1rem!important;
    }

    .is-hidden-mobile {
      display: none;
    }

  .columns.is-mobile>.column.is-1,
  .columns.is-mobile>.column.is-1-5,
  .columns.is-mobile>.column.is-2,
  .columns.is-mobile>.column.is-3,
  .columns.is-mobile>.column.is-4,
  .columns.is-mobile>.column.is-5,
  .columns.is-mobile>.column.is-6,
  .columns.is-mobile>.column.is-mobile-6,
  .columns.is-mobile>.column.is-7
   {
    flex: none;
    width: 50%;
  }

  .columns.is-mobile>.column.is-8,
  .columns.is-mobile>.column.is-9,
  .columns.is-mobile>.column.is-10,
  .columns.is-mobile>.column.is-11,
  .columns.is-mobile>.column.is-12,
  .columns.is-mobile>.column.is-mobile-fullwidth
  {
    flex: none;
    width: 100%;
  }


  }

  @media print,screen and (min-width:769px) {
    .is-hidden-desktop {
      display: none;
    }
    .columns:not(.is-desktop) {
      display: flex;
    }
  }

  *, ::after, ::before {
    box-sizing: inherit;
  }

</style>