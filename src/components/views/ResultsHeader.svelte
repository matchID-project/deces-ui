
{#if $wasSearched}
    <div class="columns is-vcentered is-mobile">
        <div class="column is-6 is-size-7"><span>Résultats <strong>{from}</strong> à <strong>{to}</strong> parmi <strong>{$totalResults}</strong></span>
        <span>pour: <i>{query}</i></span>  </div>
        <div class="column is-6 has-text-right is-size-7">résultats par page
            <span class="select is-size-7">
                <select bind:value={$resultsPerPage}>
                    {#each resultsPerPageList as option}
                        <option>{option}</option>
                    {/each}
                </select>
            </span>
        </div>
    </div>
{/if}

<script>
    import { current, totalResults, totalPages, resultsPerPage, searchInput, wasSearched } from '../tools/stores.js'
    import { searchSubmit, searchURLUpdate } from '../tools/search.js'

    let from, to, query;

    let resultsPerPageList;

    $: resultsPerPageList = $resultsPerPage === 20 ? [20,40,60] : [$resultsPerPage,20,40,60]

    $: from = Math.min($totalResults, 1 + ($current - 1) * $resultsPerPage);
    $: to = Math.min($totalResults, $current * $resultsPerPage);
    $: query = $wasSearched;

    $: updateResultsPerPage($resultsPerPage);

    const updateResultsPerPage = () => {
        searchSubmit(1);
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

    .has-text-right {
        text-align: right!important;
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
        height: 1.5em;
        justify-content: flex-start;
        line-height: 1.5;
        padding-left: calc(.75em - 1px);
        padding-right: calc(.75em - 1px);
        position: relative;
        vertical-align: top;
    }

    select {
        font-family: BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
    }

</style>

