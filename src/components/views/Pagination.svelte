
{#if $wasSearched}
    <nav class="pagination is-centered is-small" role="navigation" aria-label="pagination">
        {#if $totalPages > 1}
            {#if $current === 1}
                <a class="pagination-previous" href="{pageLink($current-1)}"
                on:click|preventDefault={goTo($current-1)} disabled> &lt; </a>
            {:else}
                <a class="pagination-previous" href="{pageLink($current-1)}"
                on:click|preventDefault={goTo($current-1)}> &lt; </a>
            {/if}
            {#if $current === $totalPages}
                <a class="pagination-next" href="{pageLink($current+1)}"
                on:click|preventDefault={goTo($current+1)} disabled> &gt; </a>
            {:else}
                <a class="pagination-next" href="{pageLink($current+1)}"
                on:click|preventDefault={goTo($current+1)}> &gt; </a>
            {/if}
            <ul class="pagination-list">
                {#each pages as page}
                    {#if page === '.'}
                        <li><span class="pagination-ellipsis">&hellip;</span></li>
                    {:else}
                        <li>
                            <a
                                class="pagination-link"
                                class:is-current={$current === page}
                                href="{pageLink(page)}"
                                on:click|preventDefault={goTo(page)}
                            >
                                {page}
                            </a>
                        </li>
                    {/if}
                {/each}
            </ul>
        {:else}
            <ul><li><i class="pagination-link border-is-white"></i></li></ul>
        {/if}
    </nav>
{/if}

<script>
    import { current, totalResults, totalPages, resultsPerPage, searchInput, wasSearched } from '../tools/stores.js'
    import { searchString, searchSubmit, searchURLUpdate } from '../tools/search.js'

    let from, to, query;

    $: from = 1 + ($current - 1) * $resultsPerPage;
    $: to = Math.min($totalResults, $current * $resultsPerPage);
    $: query = searchString($searchInput);

    $: pages = computePages($current, $totalPages)

    const computePages = (index,total) => {
        if (total === 0) {return}
        let pages;
        if (total <= 5) {
            pages = [...Array(total).keys()].map(n => n+1)
        } else if (index <= 3) {
            pages = [...Array(index+1).keys()].map(n => n+1)
            pages.push('.')
            pages.push(total)
        } else if (index < (total - 3)) {
            pages = [1,'.',index-1,index,index+1,'.',total]
        } else {
            pages = [1,'.'].concat([...Array(total-index+2).keys()].map(n => n+index-1))
        }
        return pages;
    }

    const pageLink = (index) => {
        let params = new URLSearchParams(location.search);
        params.set('current', `n_${index}_n`);
        return `${location.pathname}?${params}`;
    }

    const goTo = (page) => {
        if ((page>0) && (page <= $totalPages)) {
            searchSubmit(page);
            searchURLUpdate();
        }
    }

</script>

<style>

    .button,
    .file-cta,
    .file-name,
    .input,
    .pagination-ellipsis,
    .pagination-link,
    .pagination-next,
    .pagination-previous,
    .select select,
    .textarea {
    -moz-appearance:none;
    -webkit-appearance:none;
    align-items:center;
    border:1px solid transparent;
    border-radius:4px;
    box-shadow:none;
    display:inline-flex;
    font-size:1rem;
    height:2.5em;
    justify-content:flex-start;
    line-height:1.5;
    padding-bottom:calc(.5em - 1px);
    padding-left:calc(.75em - 1px);
    padding-right:calc(.75em - 1px);
    padding-top:calc(.5em - 1px);
    position:relative;
    vertical-align:top;
    text-decoration: none;
    }

    .button[disabled],
    .file-cta[disabled],
    .file-name[disabled],
    .input[disabled],
    .pagination-ellipsis[disabled],
    .pagination-link[disabled],
    .pagination-next[disabled],
    .pagination-previous[disabled],
    .select fieldset[disabled] select,
    .select select[disabled],
    .textarea[disabled],
    fieldset[disabled] .button,
    fieldset[disabled] .file-cta,
    fieldset[disabled] .file-name,
    fieldset[disabled] .input,
    fieldset[disabled] .pagination-ellipsis,
    fieldset[disabled] .pagination-link,
    fieldset[disabled] .pagination-next,
    fieldset[disabled] .pagination-previous,
    fieldset[disabled] .select select,
    fieldset[disabled] .textarea {
    cursor:not-allowed
    }

    .pagination {
        font-size:1rem;
        margin:-0.25rem;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .pagination.is-medium {
    font-size:1.25rem
    }
    .pagination.is-large {
    font-size:1.5rem
    }
    .pagination.is-rounded .pagination-next,
    .pagination.is-rounded .pagination-previous {
    padding-left:1em;
    padding-right:1em;
    border-radius:290486px
    }
    .pagination.is-rounded .pagination-link {
    border-radius:290486px
    }
    .pagination,
    .pagination-list {
    align-items:center;
    display:flex;
    justify-content:center;
    text-align:center
    }
    .pagination-ellipsis,
    .pagination-link,
    .pagination-next,
    .pagination-previous {
    font-size:1em;
    justify-content:center;
    margin:.25rem;
    padding-left:.5em;
    padding-right:.5em;
    text-align:center
    }
    .pagination-link,
    .pagination-next,
    .pagination-previous {
    border-color:#dbdbdb;
    color:#363636;
    min-width:2.5em
    }
    .pagination-link:hover,
    .pagination-next:hover,
    .pagination-previous:hover {
    border-color:#b5b5b5;
    color:#363636
    }
    .pagination-link:focus,
    .pagination-next:focus,
    .pagination-previous:focus {
    border-color:#3273dc
    }
    .pagination-link:active,
    .pagination-next:active,
    .pagination-previous:active {
    box-shadow:inset 0 1px 2px rgba(10,10,10,.2)
    }
    .pagination-link[disabled],
    .pagination-next[disabled],
    .pagination-previous[disabled] {
    background-color:#dbdbdb;
    border-color:#dbdbdb;
    box-shadow:none;
    color:#7a7a7a;
    opacity:.5
    }
    .pagination-next,
    .pagination-previous {
    padding-left:.75em;
    padding-right:.75em;
    white-space:nowrap
    }
    .pagination-link.is-current {
    background-color:#3273dc;
    border-color:#3273dc;
    color:#fff
    }
    .pagination-ellipsis {
    color:#b5b5b5;
    pointer-events:none
    }
    .pagination-list {
    flex-wrap:wrap
    }
    @media screen and (max-width:768px) {
    .pagination {
    flex-wrap:wrap
    }
    .pagination-next,
    .pagination-previous {
        display: none;
    }
    .pagination-list li {
    flex-grow:1;
    flex-shrink:1
    }
    }
    @media screen and (min-width:769px),print {
    .pagination-list {
    flex-grow:1;
    flex-shrink:1;
    justify-content:flex-start;
    order:1
    }
    .pagination-previous {
    order:2
    }
    .pagination-next {
    order:3
    }
    .pagination {
    justify-content:space-between
    }
    .pagination.is-centered .pagination-previous {
    order:1
    }
    .pagination.is-centered .pagination-list {
    justify-content:center;
    order:2
    }
    .pagination.is-centered .pagination-next {
    order:3
    }
    .pagination.is-right .pagination-previous {
    order:1
    }
    .pagination.is-right .pagination-next {
    order:2
    }
    .pagination.is-right .pagination-list {
    justify-content:flex-end;
    order:3
    }
    }

    ul {
       list-style: none;
    }

    .remove-border {
        border:1px solid transparent;
    }
    .border-is-white {
        border-color: #fff;
    }

    .column {
        display: block;
        flex-basis: 0;
        flex-grow: 1;
        flex-shrink: 1;
        padding: .75rem;
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

    ul {
    margin:0;
    padding:0
    }

</style>

