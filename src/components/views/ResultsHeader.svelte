{#if $wasSearched || ($displayMode === 'geo')}
    <table class="rf-table rf-table--narrow rf-text--xs rf-color--black rf-margin-bottom-0" style="width: 100%!important;">
        <tr>
            <td class="rf-hide--mobile rf-td--vcenter rf-text--left" style="width: 20px;">
                <Download/>
            </td>
            <td class="rf-td--vcenter">
                    <span>
                        {#if query}
                            résultats <strong>{from}</strong> à <strong>{to}</strong> parmi <strong>{$totalResults}</strong>
                            pour: <i>{query}</i>
                        {:else}
                            recherche en cours &hellip;
                        {/if}
                    </span>
            </td>
            {#if (!($displayMode === 'geo') && ($totalPages > 1))}
                <td class="rf-display--xl rf-td--vcenter rf-text--center">
                    <Pagination/>
                </td>
            {/if}
            {#if (!($displayMode === 'geo'))}
                {#if $totalPages > 1}
                    <td class="rf-hide--mobile rf-td--vcenter rf-text--center rf-text--right" style="width: 100px;">
                        par page
                        <select class="rf-select rf-select--aside rf-text--xs rf-color--black" bind:value={$resultsPerPage}>
                            {#each resultsPerPageList as option}
                                <option>{option}</option>
                            {/each}
                        </select>
                    </td>
                {/if}
                <td class="rf-hide--mobile rf-td--vcenter rf-text--center" style="width: 100px;">
                    <div
                        on:click={() => {$sortInputDisplay=!$sortInputDisplay}}
                        class="rf-href"
                        title="cliquez pour paramétrer le tri"
                    >
                        <span>

                        </span>
                        <span>tri:</span>
                        <span>
                        {#if ($sortInput.filter(s => s.order).length) > 0}
                            {#each $sortInput.filter(s => s.order) as t}
                                <span>
                                    {t.label}
                                    <span style="margin-left:-0.2rem">
                                        {#if t.order === "desc"}
                                            <FontAwesomeIcon icon={faSortDown} class="is-small is-low"/>
                                        {:else}
                                            <FontAwesomeIcon icon={faSortUp} class="is-small is-low"/>
                                        {/if}
                                    </span>
                                </span>
                            {/each}
                        {:else}
                            aucun
                        {/if}
                        </span>
                    </div>
                </td>
            {/if}
            <td class="rf-td--vcenter rf-text--right" style="width:150px;">
                <span>
                    {#each displayChoices as choice}
                        <span
                            class={choice.mode === "table" ? "rf-display--xl" : ""}
                            title={`${choice.mode === $displayMode ? "mode d'affichage actuel:" : "basculez au mode d'affichage:"} ${choice.label}`}
                            on:click|preventDefault={() => enableDisplayMode(choice.mode)}
                        >
                            <FontAwesomeIcon icon={choice.icon} class={`rf-margin-2px is-24 is-high ${choice.mode === $displayMode ? "rf-color--bf" : "rf-color--g400"}`}/>
                        </span>
                    {/each}
                </span>
            </td>
        </tr>
    </table>
    {#if (!($displayMode === 'geo') && $sortInputDisplay)}
        <div class="rf-container-fluid">
            <div class="rf-grid-row">
                <div class="rf-col-1"></div>
                <div class="rf-col-10 rf-text--center"><SortInput/></div>
                <div class="rf-col-1"></div>
            </div>
        </div>
    {/if}
{/if}

<script>
    import { faSortUp, faSortDown, faPlus, faMinus, faTable, faGlobeEurope, faGripLines, faAddressCard } from '@fortawesome/free-solid-svg-icons';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import { current, searchResults, sortInput, sortInputDisplay, updateURL, totalResults, totalPages,
        resultsPerPage, defaultResultsPerPage, searchInput, wasSearched, displayMode } from '../tools/stores.js'
    import { searchSubmit, searchURLUpdate } from '../tools/search.js'
    import SortInput from './SortInput.svelte';
    import Download from './Download.svelte';
    import Pagination from './Pagination.svelte';

    let from, to, query;

    let resultsPerPageList;

    const displayChoices = [
        {mode: 'card', icon: faGripLines, label: "fiche compacte"},
        {mode: 'card-expand', icon: faAddressCard, label: "fiche complète"},
        {mode: 'table', icon: faTable, label: "tableur"},
        {mode: 'geo', icon: faGlobeEurope, label: "géographique"},
    ];

    $: resultsPerPageList = [20,40,60].includes($resultsPerPage) ? [20,40,60] : [$resultsPerPage,20,40,60].sort()

    $: from = Math.min($totalResults, 1 + ($current - 1) * $resultsPerPage);
    $: to = Math.min($totalResults, $current * $resultsPerPage);
    $: query = $wasSearched;


  const enableDisplayMode = async (mode) => {
    if (mode !== 'geo') {
        $resultsPerPage = $defaultResultsPerPage;
    }

    if ($displayMode) {
        if (($displayMode === 'geo') && (mode !== 'geo')) {
            $searchResults = $searchResults.splice(0, $defaultResultsPerPage);
            $resultsPerPage = $defaultResultsPerPage;
        }
      $displayMode = mode;
    }
    searchURLUpdate();
  }

</script>
<style>

    .select select.is-hovered, .select select:hover {
         border-color: #b5b5b5;
    }
    .select select {
        cursor: pointer;
        display: block;
        font-size: .75rem;
        max-width: 100%;
        outline: 0;
        background-color: #fff;
        border-color: #dbdbdb;
        border-radius: 4px;
        color: inherit;
        -moz-appearance: none;
        -webkit-appearance: none;
        align-items: center;
        border: 1px solid;
        border-radius: 4px;
        box-shadow: none;
        display: inline-flex;
        justify-content: flex-start;
        line-height: 1.5;
        padding-left: calc(.75em - 1px);
        padding-right: calc(.75em - 1px);
        position: relative;
    }
</style>

