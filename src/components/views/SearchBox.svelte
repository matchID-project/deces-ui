<div class="rf-container-fluid" style="margin-top: -16px;">
  <form on:submit|preventDefault={handleSubmit}>
    <div class="rf-grid-row" style="position:relative;">
      <div class="rf-col-12">
        <span
          title={$advancedSearch ? "recherche simplifiée" : "recherche avancée"}
          on:click|preventDefault={toggleAdvancedSearch}
          class="rf-color--bf"
          style="position: absolute;top: 16px; right: 8px;"
        >
          <FontAwesomeIcon icon={$advancedSearch ? faMinus : faPlus} class="rf-margin-2px is-24 is-high"/>
        </span>
        <div class="rf-container-fluid">
            <div class="rf-grid-row">
              {#each inputsKeys as key}
                {#if isActive[key]}
                    {#if $searchInput[key].section}
                      <div class="rf-col-12 rf-margin-top-2N rf-padding-left-4px">
                          <strong>
                            {$searchInput[key].section}
                          </strong>
                      </div>
                    {/if}

                    <div class="rf-margin-top-1N rf-padding-left-4px rf-padding-right-4px {$searchInput[key].size}">
                      <label
                        class="rf-label"
                        for={$searchInput[key].url}
                        style="overflow:hidden;text-overflow:ellipsis;"
                      >
                        {$searchInput[key].label}
                      </label>
                      <div class="rf-field">
                        <input
                          id={$searchInput[key].url}
                          name={$searchInput[key].path}
                          autoComplete="off"
                          placeholder={$searchInput[key].placeholder}
                          class="rf-input {!$advancedSearch ? "rf-input--btn" : ""} {isValid(key) ? "" : "rf-color--rm rf-input--error"}"
                          bind:value={$searchInput[key].value}
                          title={$searchInput[key].title}
                          on:input={() => handleInput(key)}
                          on:blur={focusInput(key,false)}
                          on:focus={focusInput(key,true)}
                          disabled={$searchInput[key].disabled}
                        />
                        {#if !$advancedSearch}
                          <button class="rf-btn">
                            <span class="rf-fi-search-line rf-fi--lg"></span>
                          </button>
                        {/if}
                      </div>
                    </div>
                {/if}
              {/each}
            </div>
        </div>
      </div>
      {#if $advancedSearch}
        <div class="rf-margin-top-2N rf-col-12" style="text-align: center">
          <div
            class="field is-centered small-margin-mobile"
            style="margin-top:-0.25rem;margin-bottom:-1rem!important;"
            on:click|preventDefault={ toggleFuzzySearch }
          >
            <input style="width:0px" id="switchRoundedInfo" type="checkbox" name="switchRoundedInfo" class="switch is-rounded is-white is-unchecked-grey" bind:checked={$fuzzySearch}>
            <label for="switchRoundedInfo">
              {#if $fuzzySearch} recherche floue
              {:else} <strike> recherche floue</strike>{/if}
              </label>
          </div>
        </div>
      {/if}
    </div>
  </form>
</div>

<script>
  import FontAwesomeIcon from './FontAwesomeIcon.svelte'

  import { advancedSearch, searchInput, searchCanvas,
    sortInput, resultsPerPage, searchInputFocus,
    searchTyping, fuzzySearch } from '../tools/stores.js';
  import { search, searchString, searchSubmit, searchURLUpdate, toggleAdvancedSearch, toggleFuzzySearch } from '../tools/search.js';
  import GoogleAnalytics from './GoogleAnalytics.svelte';

  import {
      faMinus,
      faPlus
  } from '@fortawesome/free-solid-svg-icons';

  let lastInput = {}

  let tag={};

  let inputsKeys;

  $: inputsKeys = Object.keys($searchInput);

  $: handleSubmit($resultsPerPage);
  $: handleSubmit($sortInput);

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
        v[key]={ focus : value };
        return v
      })
    }, 300);
  }

  const handleSubmit = async () => {
    searchSubmit();
    searchURLUpdate();
    tag = {
      command: 'event',
      commandParam: 'button',
      eventParam: {
        event_category: 'recherche',
        event_label: searchString($searchInput)
      }
    };
  }

  const startDate = new Date().getTime();

  const date = () => {
    return Math.round(new Date().getTime() - startDate);
  }

  const isValid = (key) => {
    if ($searchInput[key].mask && $searchInput[key].mask.validation) {
      return $searchInput[key].mask.validation($searchInput[key].value);
    } else {
      return true;
    }
  }

  const handleInput = (key) => {
    if ($searchInput[key].mask && $searchInput[key].mask.typing) {
      if (!$searchInput[key].mask.typing($searchInput[key].value)) {
        $searchInput[key].value = lastInput[key] || '';
      }
      lastInput[key] = $searchInput[key].value
    }
    if (isValid(key)) {
      $searchTyping = date() + 350;
      setTimeout(() => {
        if (date() > $searchTyping) {
          handleSubmit();
        } else {
          console.log("key input limiter")
        } }, 355)
    }
  }

</script>

<style>
</style>
