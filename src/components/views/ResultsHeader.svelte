{#if searchTrigger($searchInput) && ($wasSearched || ($displayMode === 'geo')) && !(($searchResults.length === 1) && ($searchResults[0].error))}
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
                                            <span class="rf-fi-arrow-down-s-line"></span>
                                        {:else}
                                            <span class="rf-fi-arrow-up-s-line"></span>
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
            <td class="rf-td--vcenter rf-text--right" style="width: 125px">
                <div style="display: flex;">
                    {#each displayChoices as choice}
                        <span
                            on:click={() => enableDisplayMode(choice.mode)}
                            title={`${choice.mode === $displayMode ? "mode d'affichage actuel:" : "basculez au mode d'affichage:"} ${choice.label}`}
                        >
                            <Icon
                                icon={choice.icon}
                                class="rf-fi--lg {choice.mode === $displayMode ? "rf-color--bf" : "rf-color--g400"}"
                            />
                        </span>
                    {/each}
                </div>
            </td>
        </tr>
    </table>
    {#if (!($displayMode === 'geo') && $sortInputDisplay)}
        <div class="rf-container-fluid">
            <div class="rf-grid-row">
                <div class="rf-col-1 rf-hide--mobile"></div>
                <div class="rf-col-xl-10 rf-col-lg-10 rf-col-md-12 rf-col-sm-12 rf-col-xs-12 rf-text--center"><SortInput/></div>
                <div class="rf-col-1 rf-hide--mobile"></div>
            </div>
        </div>
    {/if}
{/if}

<script>
    import Icon from './Icon.svelte';
    import { current, searchResults, sortInput, sortInputDisplay, updateURL, totalResults, totalPages,
        resultsPerPage, searchInput, wasSearched, displayMode } from '../tools/stores.js'
    import { enableDisplayMode, searchTrigger } from '../tools/search.js'
    import SortInput from './SortInput.svelte';
    import Download from './Download.svelte';
    import Pagination from './Pagination.svelte';

    let from, to, query;

    let resultsPerPageList;

    const displayChoices = [
        {mode: 'card', icon: 'ri:list-check-2', label: "fiche compacte"},
        {mode: 'card-expand', icon: 'ri:profile-line', label: "fiche complète"},
        {mode: 'table', icon: 'ri:table-line', label: "tableur"},
        {mode: 'geo', icon: 'ri:earth-line', label: "géographique"},
    ];

    $: resultsPerPageList = [20,40,60].includes($resultsPerPage) ? [20,40,60] : [$resultsPerPage,20,40,60].sort()

    $: from = Math.min($totalResults, 1 + ($current - 1) * $resultsPerPage);
    $: to = Math.min($totalResults, $current * $resultsPerPage);
    $: query = $wasSearched;


</script>

<style>

</style>

