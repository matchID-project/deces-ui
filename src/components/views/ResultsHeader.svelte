{#if $wasSearched}
    <div class="columns is-vcentered is-mobile">
        <div class="column is-4 is-mobile-6 is-size-7">
            <span>Résultats <strong>{from}</strong> à <strong>{to}</strong> parmi <strong>{$totalResults}</strong></span>
            <span>pour: <i>{query}</i></span>
        </div>
        <div
            class="column is-4 is-mobile-3 is-size-7 has-text-centered"
        >
            <div
                on:click={() => {$sortInputDisplay=!$sortInputDisplay}}
                class="pointer"
                title="cliquez pour paramétrer le tri"
            >
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
        </div>
        <div class="column is-4 is-mobile-3 has-text-right is-size-7 is-vcentered">
            <span class="is-hidden-mobile">résultats </span>par page
            <span class="select is-size-7">
                <select bind:value={$resultsPerPage}>
                    {#each resultsPerPageList as option}
                        <option>{option}</option>
                    {/each}
                </select>
            </span>
            <span
                class="has-text-primary expand-icon"
                title={$accordeonMode ? "déplier tous les résultats" : "replier tous les résultats"}
                on:click={() => {$accordeonMode=!$accordeonMode}}
            >
                <FontAwesomeIcon icon={$accordeonMode ? faPlus : faMinus} class="is-lower"/>
            </span>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1"></div>
        <div class="column is-10 is-vcentered has-text-centered"><SortInput/></div>
        <div class="column is-1"></div>
    </div>
{/if}

<script>
    import { faSortUp, faSortDown, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte'
    import { accordeonMode, current, sortInput, sortInputDisplay, updateURL, totalResults, totalPages, resultsPerPage, searchInput, wasSearched } from '../tools/stores.js'
    import { searchSubmit, searchURLUpdate } from '../tools/search.js'
    import SortInput from './SortInput.svelte';

    let from, to, query;

    let resultsPerPageList;

    $: resultsPerPageList = [20,40,60].includes($resultsPerPage) ? [20,40,60] : [$resultsPerPage,20,40,60].sort()

    $: from = Math.min($totalResults, 1 + ($current - 1) * $resultsPerPage);
    $: to = Math.min($totalResults, $current * $resultsPerPage);
    $: query = $wasSearched;

    $: updateResults($resultsPerPage);
    $: updateResults($sortInput);

    const updateResults = () => {
        searchSubmit($current);
        searchURLUpdate();
    }

</script>

<style>

    .column {
        display: block;
        flex-basis: 0;
        flex-grow: 1;
        flex-shrink: 1;
        padding: 0rem 1rem 0rem 0.75rem;
    }


    .columns.is-mobile>.column.is-9 {
        flex: none;
        width: 75%;
    }




    @media print,screen and (max-width:768px) {
        .columns>.column.is-mobile-3 {
            flex: none;
            width: 26%;
        }

        .columns>.column.is-mobile-6 {
            flex: none;
            width: 48%;
        }

        .columns.is-mobile>.column.is-3 {
            flex: none;
            width: 25%;
        }
    }

    @media print,screen and (min-width:769px) {
        .column.is-1 {
            flex: none;
            width: 8%;
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
            width: 33.3%;
        }

        .column.is-6 {
            flex: none;
            width: 50%;
        }

        .column.is-9 {
            flex: none;
            width: 75%;
        }
        .column.is-8 {
            flex: none;
            width: 66%;
        }
        .column.is-10 {
            flex: none;
            width: 83%;
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

    .is-vcentered {
        align-items: center!important;
        justify-content: center!important;
    }

    .expand-icon {
       margin-left:16px;
       margin-right:10px;
    }

    @media print,screen and (max-width:768px) {
        .is-hidden-mobile {
            display: none!important;
        }
        .expand-icon {
            line-height:2rem;
        }
    }

    @media print,screen and (min-width:769px) {
        .columns:not(.is-desktop) {
            display: flex;
        }
    }

    .has-text-primary {
        color: #00d1b2!important;
    }

    .has-text-right {
        text-align: right!important;
    }
    .has-text-centered {
        text-align: center!important;
    }
    .is-size-7 {
        font-size: .75rem !important;
    }

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
        vertical-align: center;
    }

    .pointer {
        cursor: pointer;
    }

</style>

