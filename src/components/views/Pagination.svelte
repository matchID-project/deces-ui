
{#if $wasSearched}
    <div class="rf-container-fluid" style="padding-top:6px; margin-top:-8px;margin-bottom:-8px;height:45px; overflow: hidden;">
        <div class="rf-grid-row" style="justify-content: center;">
            <nav class="rf-pagination" role="navigation" aria-label="pagination">
                {#if $totalPages > 1}
                    <ul class="rf-pagination__list rf-text--xs">
                    {#if $current === 1}
                        <li class="rf-pagination__item--prev rf-pagination__item rf-pagination__item--disabled"></li>
                    {:else}
                        <li
                            class="rf-href rf-pagination__item--prev rf-pagination__item"
                            title="page {$current-1}"
                            on:click|preventDefault={goTo($current-1)}
                        >
                            <a
                                class="rf-pagination__link"
                                href={pageLink($current-1)}
                                aria-label="page {$current-1}"
                            >
                            </a>
                        </li>
                    {/if}
                    {#each pages as page}
                        {#if page === '.'}
                            <li class="rf-pagination__item rf-pagination__item--from-md">&hellip;</li>
                        {:else}
                            <li
                                class="rf-href rf-pagination__item {$current === page ? "rf-pagination__item--active" : ""} rf-pagination__item--from-md"
                                title="page {page}"
                                on:click|preventDefault={goTo(page)}
                            >
                                <a
                                    class="rf-pagination__link"
                                    href={pageLink(page)}
                                    aria-label="page {page}"
                                >
                                    {page}
                                </a>
                            </li>
                        {/if}
                    {/each}
                    {#if $current === $totalPages}
                        <li class="rf-pagination__item--next rf-pagination__item rf-pagination__item--disabled"></li>
                    {:else}
                        <li
                            class="rf-href rf-pagination__item--next rf-pagination__item"
                            title="page {$current+1}"
                            on:click|preventDefault={goTo($current+1)}
                        >
                            <a
                                class="rf-pagination__link"
                                href={pageLink($current+1)}
                                aria-label="page {$current+1}"
                            >
                            </a>
                        </li>
                    {/if}
                    </ul>
                {/if}
            </nav>
        </div>
    </div>
{/if}

<script>
    import { current, totalResults, totalPages, resultsPerPage, maxResults,
    searchInput, sortInput, wasSearched, scrollId, activeElement } from '../tools/stores.js'
    import { searchString, searchSubmit, searchURLUpdate } from '../tools/search.js'
    import { validScrollId } from '../tools/buildRequest.js';

    let from, to, query, pages;

    $: query = searchString($searchInput);
    $: pages = computePages($current, $totalPages);
    $: from = 1 + ($current - 1) * $resultsPerPage;
    $: to = Math.min($totalResults, $current * $resultsPerPage);

    $: if (!$scrollId) {
        goTo(1);
    };

    const computePages = (index,total) => {
        if (total === 0) {return}
        let pages;
        if (total <= 5) {
            pages = [...Array(total).keys()].map(n => n+1);
        } else if (index <= 3) {
            pages = [...Array(index+1).keys()].map(n => n+1);
            pages.push('.');
            pages.push(total);
        } else if (index < (total - 3)) {
            pages = [1,'.',index-1,index,index+1,'.',total];
        } else {
            pages = [1,'.'].concat([...Array(total-index+2).keys()].map(n => n+index-1));
        }
        return pages;
    }

    const pageLink = (index) => {
        let params = new URLSearchParams(location.search);
        params.set('current', `n_${index}_n`);
        return `${location.pathname}?${params}`;
    }

    const goTo = async (page) => {
        if ((page>0) && (page <= $totalPages)) {
            activeElement.update(v => {
                v && v.blur();
                return undefined;
            });
            if (!validScrollId($scrollId,$searchInput,$sortInput) && (page !==1)) {
                await searchSubmit(1);
            }
            await searchSubmit(page);
            await searchURLUpdate();
        }
    }

</script>



