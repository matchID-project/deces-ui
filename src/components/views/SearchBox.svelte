<GoogleAnalytics {...tag}/>
<div
  class="container margin column is-8"
>
    <form
       class="columns is-vcentered is-multiline"
      on:submit|preventDefault={handleSubmit}
    >
      <div class="column is-11">
          <div class="columns is-multiline is-mobile">
            {#each inputsKeys as key}
              {#if isActive[key]}
                {#if $searchInput[key].section}
                  <span class="column is-higher is-right-desktop is-2 is-mobile-fullwidth is-mobile-centered">{$searchInput[key].section}</span>
                {/if}
                <div class={`column low-padding is-${$searchInput[key].size}`}>
                  <div class="field padding" style="flex-direction:column;text-align:left!important;">
                    <input
                      autoComplete="off"
                      placeholder={$searchInput[key].placeholder}
                      class={`padding is-size-5 ${isValid(key) ? "" : "is-danger"}`}
                      bind:value={$searchInput[key].value}
                      title={$searchInput[key].title}
                      on:input={() => handleInput(key)}
                      on:blur={focusInput(key,false)}
                      on:focus={focusInput(key,true)}
                      disabled={$searchInput[key].disabled}
                    />
                  </div>
                </div>
              {/if}
            {/each}
          </div>
      </div>
      <div class="column is-1">
        <button
          type="reset"
          class="button is-fullwidth is-size-5 is-white small-margin-mobile"
          on:click|preventDefault={ toggleAdvancedSearch }
          title={ $advancedSearch ? "retour à la recherche simple" : "activer la recherche avancée" }
        >
          <FontAwesomeIcon icon={ $advancedSearch ? faMinus : faPlus }/>
        </button>
      </div>
        <div class="column is-2 is-hidden-mobile" style="margin-bottom:-1rem!important;"></div>
      {#if $advancedSearch}
        <div class={`column is-${$displayMode === 'geo' ? "12" : "5" } is-size-5`}>
          <div
            class="field is-centered small-margin-mobile"
            style="margin-top:-0.25rem;margin-bottom:-1rem!important;"
            on:click|preventDefault={ toggleFuzzySearch }
          >
            <input id="switchRoundedInfo" type="checkbox" name="switchRoundedInfo" class="switch is-rounded is-white is-unchecked-grey" bind:checked={$fuzzySearch}>
            <label for="switchRoundedInfo">
              {#if $fuzzySearch} recherche floue
              {:else} <strike> recherche floue</strike>{/if}
              </label>
          </div>
        </div>
      {/if}
      {#if ($displayMode !== 'geo')}
        <div class="is-hidden-mobile column is-${$advancedSearch ? "3" : "12" } is-size-5">
          <div
            class="field small-margin-mobile"
            style="margin-top:0.5rem;margin-bottom:-1rem!important;"
          >

            {#each displayChoices as choice}
              <span style="margin: 0.25rem;"
                title={`${choice.mode === $displayMode ? "mode d'affichage actuel:" : "basculez au mode d'affichage:"} ${choice.label}`}
                on:click={() => enableDisplayMode(choice.mode)}>
                <FontAwesomeIcon icon={choice.icon} class={`is-36 is-higher ${choice.mode === $displayMode ? "is-info" : ""}`}/>
              </span>
            {/each}
          </div>
        </div>
      {/if}
        <div class="column is-2 is-hidden-mobile" style="margin-bottom:-1rem!important;"></div>
    </form>
</div>
{#if infoDisplay}
  <div
    class="info-footer"
    on:click={infoDisplay=false}
  >
      <p><FontAwesomeIcon icon={faQuestionCircle} class="is-lower"/></p>
      <p>
      {#each inputsKeys as key}
        {#if $searchInputFocus[key] && $searchInputFocus[key].focus}
          {$searchInput[key].title}
        {/if}
      {/each}
      </p>
  </div>
{/if}

<script>
  import FontAwesomeIcon from './FontAwesomeIcon.svelte'

  import { advancedSearch, searchInput, searchCanvas, infoDisplayOption,
    sortInput, resultsPerPage, searchInputFocus,
    searchTyping, fuzzySearch, displayMode } from '../tools/stores.js';
  import { search, searchString, searchSubmit, searchURLUpdate, toggleAdvancedSearch, toggleFuzzySearch } from '../tools/search.js';
  import GoogleAnalytics from './GoogleAnalytics.svelte';

  import {
      faAddressCard,
      faGlobeEurope,
      faGripLines,
      faMinus,
      faPlus,
      faQuestionCircle,
      faTable
  } from '@fortawesome/free-solid-svg-icons';

  let lastInput = {}

  let tag={};

  let displayChoices = [
    {mode: 'card', icon: faGripLines, label: "fiche compacte"},
    {mode: 'card-expand', icon: faAddressCard, label: "fiche complète"},
    {mode: 'table', icon: faTable, label: "tableur"},
  ];

  let inputsKeys;

  let infoDisplay;

  $: inputsKeys = Object.keys($searchInput);

  $: infoDisplay=$infoDisplayOption && Object.keys($searchInputFocus).some(key => $searchInputFocus[key].focus);

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

  const enableDisplayMode = async (mode) => {
    if ($displayMode) {
      $displayMode = mode;
    }
    searchURLUpdate();
  }

</script>

<style>
.label {
 color:#363636;
 display:block;
 font-size:1rem;
 font-weight:700
}
.label:not(:last-child) {
 margin-bottom:.5em
}
.label.is-small {
 font-size:.75rem
}
.label.is-medium {
 font-size:1.25rem
}
.label.is-large {
 font-size:1.5rem
}
.help {
 display:block;
 font-size:.75rem;
 margin-top:.25rem
}
.help.is-white {
 color:#fff
}
.help.is-black {
 color:#0a0a0a
}
.help.is-light {
 color:#f5f5f5
}
.help.is-dark {
 color:#363636
}
.help.is-primary {
 color:#00d1b2
}
.help.is-link {
 color:#3273dc
}
.help.is-info {
 color:#3298dc
}
.help.is-success {
 color:#48c774
}
.help.is-warning {
 color:#ffdd57
}
.help.is-danger {
 color:#f14668
}
.field:not(:last-child) {
 margin-bottom:.75rem
}
.field.has-addons {
 display:flex;
 justify-content:flex-start
}
.field.has-addons .control:not(:last-child) {
 margin-right:-1px
}
.field.has-addons .control:not(:first-child):not(:last-child) .button,
.field.has-addons .control:not(:first-child):not(:last-child) .input,
.field.has-addons .control:not(:first-child):not(:last-child) .select select {
 border-radius:0
}
.field.has-addons .control:first-child:not(:only-child) .button,
.field.has-addons .control:first-child:not(:only-child) .input,
.field.has-addons .control:first-child:not(:only-child) .select select {
 border-bottom-right-radius:0;
 border-top-right-radius:0
}
.field.has-addons .control:last-child:not(:only-child) .button,
.field.has-addons .control:last-child:not(:only-child) .input,
.field.has-addons .control:last-child:not(:only-child) .select select {
 border-bottom-left-radius:0;
 border-top-left-radius:0
}
.field.has-addons .control .button:not([disabled]).is-hovered,
.field.has-addons .control .button:not([disabled]):hover,
.field.has-addons .control .input:not([disabled]).is-hovered,
.field.has-addons .control .input:not([disabled]):hover,
.field.has-addons .control .select select:not([disabled]).is-hovered,
.field.has-addons .control .select select:not([disabled]):hover {
 z-index:2
}
.field.has-addons .control .button:not([disabled]).is-active,
.field.has-addons .control .button:not([disabled]).is-focused,
.field.has-addons .control .button:not([disabled]):active,
.field.has-addons .control .button:not([disabled]):focus,
.field.has-addons .control .input:not([disabled]).is-active,
.field.has-addons .control .input:not([disabled]).is-focused,
.field.has-addons .control .input:not([disabled]):active,
.field.has-addons .control .input:not([disabled]):focus,
.field.has-addons .control .select select:not([disabled]).is-active,
.field.has-addons .control .select select:not([disabled]).is-focused,
.field.has-addons .control .select select:not([disabled]):active,
.field.has-addons .control .select select:not([disabled]):focus {
 z-index:3
}
.field.has-addons .control .button:not([disabled]).is-active:hover,
.field.has-addons .control .button:not([disabled]).is-focused:hover,
.field.has-addons .control .button:not([disabled]):active:hover,
.field.has-addons .control .button:not([disabled]):focus:hover,
.field.has-addons .control .input:not([disabled]).is-active:hover,
.field.has-addons .control .input:not([disabled]).is-focused:hover,
.field.has-addons .control .input:not([disabled]):active:hover,
.field.has-addons .control .input:not([disabled]):focus:hover,
.field.has-addons .control .select select:not([disabled]).is-active:hover,
.field.has-addons .control .select select:not([disabled]).is-focused:hover,
.field.has-addons .control .select select:not([disabled]):active:hover,
.field.has-addons .control .select select:not([disabled]):focus:hover {
 z-index:4
}
.field.has-addons .control.is-expanded {
 flex-grow:1;
 flex-shrink:1
}
.field.has-addons.has-addons-centered {
 justify-content:center
}
.field.has-addons.has-addons-right {
 justify-content:flex-end
}
.field.has-addons.has-addons-fullwidth .control {
 flex-grow:1;
 flex-shrink:0
}
.field.is-grouped {
 display:flex;
 justify-content:flex-start
}
.field.is-grouped>.control {
 flex-shrink:0
}
.field.is-grouped>.control:not(:last-child) {
 margin-bottom:0;
 margin-right:.75rem
}
.field.is-grouped>.control.is-expanded {
 flex-grow:1;
 flex-shrink:1
}
.field.is-grouped.is-grouped-centered {
 justify-content:center
}
.field.is-grouped.is-grouped-right {
 justify-content:flex-end
}
.field.is-grouped.is-grouped-multiline {
 flex-wrap:wrap
}
.field.is-grouped.is-grouped-multiline>.control:last-child,
.field.is-grouped.is-grouped-multiline>.control:not(:last-child) {
 margin-bottom:.75rem
}
.field.is-grouped.is-grouped-multiline:last-child {
 margin-bottom:-.75rem
}
.field.is-grouped.is-grouped-multiline:not(:last-child) {
 margin-bottom:0
}
@media screen and (min-width:769px),print {
 .field.is-horizontal {
  display:flex
 }
}
.field-label .label {
 font-size:inherit
}
@media screen and (max-width:768px) {
 .field-label {
  margin-bottom:.5rem
 }
}
@media screen and (min-width:769px),print {
 .field-label {
  flex-basis:0;
  flex-grow:1;
  flex-shrink:0;
  margin-right:1.5rem;
  text-align:right
 }
 .field-label.is-small {
  font-size:.75rem;
  padding-top:.375em
 }
}


  input {
    height: 2.35em;
    width: 100%;
  }

  input[type="checkbox"], input[type="radio"] {
      vertical-align: baseline;
  }

  @media screen and (min-width:769px) {
    .container.margin {
      margin-top: 2rem!important;
    }
  }

  @media screen and (max-width:768px) {
    .container.margin {
      /* margin-top: -1.75rem!important; */
    }
  }

  @media print,screen and (min-width:769px) {
    .is-right-desktop {
     text-align:right!important;
    }
  }

  .is-left {
    text-align: left!important;
  }

  @media print,screen and (max-width:768px) {
    .info-footer {
      color: #e2011c;
      z-index: 40;
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 5px;
      background: rgba(255, 255, 255, 0.8);
      border-top: solid 1px #e2011c;
      vertical-align: center;
      justify-content: center;
      display: inline-block;
    }

    .small-margin-mobile {
      margin-top: 1rem!important;
      margin-bottom:-1rem!important;
    }

    [placeholder]{
      text-align:center;
    }

    .is-mobile-centered {
      text-align: center!important;
    }

    .is-hidden-mobile {
      display: none;
    }

  }

  @media print,screen and (min-width:769px) {
    .info-footer {
      display: none;
    }

    .is-hidden-desktop {
      display: none;
    }
  }

  .is-danger {
    border: 3px solid hsl(348, 100%, 61%)!important;
    border-radius: 4px;
  }

  .field {
    display: flex;
    justify-content: center;
  }

  [placeholder]{
      text-overflow:ellipsis;
  }

  @media screen and (max-width:768px) {
    .low-padding {
      padding:0!important;
    }
  }
  @media screen and (min-width:769px) {
    .low-padding {
      padding:0 .15rem!important;
    }
  }

  .help.low-margin {
    margin:.15rem!important;
  }

  .is-higher {
  }

  *, ::after, ::before {
    box-sizing: inherit;
  }

  input.padding {
    padding-left: .35rem;
    padding-right: .35rem;
  }

</style>
