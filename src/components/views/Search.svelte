<div style="width:100%">
    {#if ($waitSearch && !($displayMode === 'geo'))}
        <div class="rf-wait-container" in:fade out:fade>
            <div class="rf-wait-content">
                <strong>Recherche en cours</strong>
                <br/>
                <Icon icon="ri:loader-line" class="rf-fi--xxl rf-margin-top-1N" spin center/>
            </div>
        </div>
    {/if}
</div>
<div class="rf-container-fluid">
    <div class="rf-grid-row">
        {#if !displayResults && $firstSearch}
            <div class="rf-col-3"></div>
        {/if}
        <div
            class="rf-padding-left-2N--desktop rf-padding-left-1N--mobile rf-padding-right-1N--mobile rf-padding-top-2N {$advancedSearch ? "" : "rf-padding-bottom-2N"} rf-col-xs-12 rf-col-sm-12 rf-col-md-{size.md} rf-col-lg-{size.lg} rf-col-xl-{size.xl} {margin}"
            style="transition: all 300ms ease;"
        >
            <SearchBox/>
        </div>
        {#if reduceSearchBox}
            <div
                class="rf-col-xs-12 rf-col-sm-12 rf-col-md-{12 - size.md} rf-col-lg-{12 - size.lg} rf-col-xl-{12 - size.xl}"
                style="transition: all 300ms ease;"
            >
                <div class="rf-container--fluid">
                    <div class="rf-grid-row">
                        {#if displayResults}
                            <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-12 rf-col-lg-12 rf-col-xl-10">
                                <ResultsHeader/>
                            </div>
                            <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-12 rf-col-lg-12 rf-col-xl-{$displayMode === 'table' ? "12" : "10"}">
                                <Results/>
                            </div>
                        {:else}
                            <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-12 rf-col-lg-12 rf-col-xl-10">
                                <PunchMessage/>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        {:else}
            <div class="rf-col-3"></div>
            {#if !$advancedSearch}
                <div class="rf-col-12">
                    <PunchMessage/>
                </div>
            {/if}
        {/if}
    </div>
</div>

<script>
    import { fade } from 'svelte/transition';
    import { firstSearch, advancedSearch, displayMode, searchInput, waitSearch} from '../tools/stores.js';
    import { searchTrigger } from '../tools/search.js';
	import SearchBox from './SearchBox.svelte';
    import ResultsHeader from './ResultsHeader.svelte';
    import Results from './Results.svelte';
    import PunchMessage from './PunchMessage.svelte';
    import Icon from './Icon.svelte'

    let displayResults;
    let reduceSearchBox;
    let size;
    let margin;

    $: if (Object.keys($searchInput).some(k => $searchInput[k].value)) {
        $firstSearch = false;
    };
    $: displayResults = (Object.keys($searchInput).some(k => $searchInput[k].value)) || ($displayMode === 'agg');
    $: reduceSearchBox = displayResults || (!$firstSearch);

    $: size = {
        md: reduceSearchBox ? 4 : 6,
        lg: reduceSearchBox ? (['table', 'geo'].includes($displayMode) ? 3 : 4) : 6,
        xl: reduceSearchBox ? (['table', 'geo'].includes($displayMode) ? 2 : 3) : 6
    };
    $: margin = reduceSearchBox ? "" : ($advancedSearch ? "" : "rf-margin-top-8N--desktop")

</script>

<style>

</style>