<div class="rf-container-fluid" style="margin-top: -16px;">
  <form on:submit|preventDefault={handleSubmit}>
    <div class="rf-grid-row" style="position: relative;">
      <div class="rf-col-12">
        {#if Object.values($searchInput).some(item => item.value != "")}
          <span
            class="rf-color--bf"
            title="Réinitialiser"
            on:click|preventDefault={clearInputs}
            on:keydown|preventDefault={clearInputs}
            style="position: absolute;top: 12px; right: 36px;"
            >
            <Icon icon='ri:eraser-line' class="rf-fi--lg"/>
          </span>
        {/if}
        <span
          title={$advancedSearch ? "Recherche simplifiée" : "Recherche avancée"}
          on:click|preventDefault={toggleAdvancedSearch}
          on:keydown|preventDefault={toggleAdvancedSearch}
          class="rf-color--bf"
          style="position: absolute;top: 12px; right: 10px;"
        >
          <Icon icon={$advancedSearch ? 'ri:zoom-out-line' : 'ri:zoom-in-line'} class="rf-fi--lg"/>
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

                    <div class="rf-margin-top-1N rf-padding-left-4px rf-padding-right-4px rf-padding-bottom-4px {$searchInput[key].size}">
                      <label
                        class="rf-label"
                        for={$searchInput[key].url}
                        style="overflow: hidden;text-overflow:ellipsis;"
                      >
                        {$searchInput[key].label}
                      </label>
                      <div class="rf-field">
                        <input
                          id={$searchInput[key].url}
                          name={$searchInput[key].path}
                          autoComplete="off"
                          placeholder={$searchInput[key].placeholder}
                          class="rf-input {isValid(key) ? "" : "rf-color--rm rf-input--error"}"
                          bind:value={$searchInput[key].value}
                          title={$searchInput[key].title}
                          on:input={handleInput(key)}
                          on:change={handleSubmit()}
                          on:blur={focusInput(key,false)}
                          on:focus={focusInput(key,true)}
                          disabled={$searchInput[key].disabled}
                          list={$searchInput[key].datalist ? `${key}-datalist` : null || null}
                        />
                        {#if $searchInput[key].datalist && $searchInput[key].datalist.length > 0}
                          <datalist id="{key}-datalist">
                            {#each $searchInput[key].datalist as element}
                              <option value="{element}"></option>
                            {/each}
                          </datalist>
                        {/if}
                      </div>
                    </div>
                {/if}
              {/each}
            </div>
        </div>
      </div>
      {#if $advancedSearch}
        <div class="rf-margin-top-1N rf-col-{$displayMode === 'agg' ? '6' : '12'}" style="text-align: center">
          <div
            on:click|preventDefault={ toggleFuzzySearch }
            on:keydown|preventDefault={ toggleFuzzySearch }
          >
            <input style="width: 0px" id="switchRoundedInfo" type="checkbox" name="switchRoundedInfo" class="switch is-rounded is-white is-unchecked-grey" bind:checked={$fuzzySearch}>
            <label for="switchRoundedInfo">
              {#if $fuzzySearch} Recherche floue
              {:else} <strike> Recherche floue</strike>{/if}
              </label>
          </div>
        </div>
      {/if}
      {#if ($displayMode === 'agg')}
        <div class="rf-col-{$advancedSearch ? '6' : '12'} rf-text--center rf-margin-top-2N">
          <input value="Rechercher" type="submit" class="rf-btn">
        </div>
      {/if}
    </div>
  </form>
</div>

<script>
  import { onMount } from 'svelte';
  import { useLocalSync } from '../tools/useLocalStorage.js';
  import Icon from './Icon.svelte'

  let isMounted = false;

  import { accessToken, advancedSearch, searchInput, searchCanvas,
    sortInput, resultsPerPage, searchInputFocus,
    searchTyping, fuzzySearch, displayMode, triggerAggregations } from '../tools/stores.js';
  import { search, searchString, searchSubmit, searchURLUpdate, toggleAdvancedSearch, toggleFuzzySearch } from '../tools/search.js';
  import { ga } from '@beyonk/svelte-google-analytics';

  let lastInput = {}

  let tag={};

  let inputsKeys;

  $: inputsKeys = Object.keys($searchInput);

  $: if (isMounted) { handleSubmit($resultsPerPage) };
  $: if (isMounted || $accessToken) { handleSubmit($sortInput) };

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

  const clearInputs = () => {
    inputsKeys.forEach(key => {
      if ($searchInput[key].value != "") {
        $searchInput[key].value = "";
      }
    });
  }

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
    if ($displayMode === 'agg') {
      $triggerAggregations = true;
    }
    ga.all.search(searchString($searchInput));
  }

  const startDate = new Date().getTime();

  const date = () => {
    return Math.round(new Date().getTime() - startDate);
  }

  const isValid = (key) => {
    if ($searchInput[key].datalist) {
      return $searchInput[key].datalist.includes($searchInput[key].value) || $searchInput[key].value === '';
    } else if ($searchInput[key].mask && $searchInput[key].mask.validation) {
      return $searchInput[key].mask.validation($searchInput[key].value);
    } else {
      return true;
    }
  }

  const handleInput = (key) => {
    if ($displayMode !== 'agg') {
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
  }

  onMount(async () => {
    await useLocalSync(accessToken, 'accessToken');
    isMounted = true;
  });

</script>

<style>
</style>
