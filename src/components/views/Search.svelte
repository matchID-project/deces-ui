<div class="rf-container-fluid">
    <div class="rf-grid-row">
        {#if !displayResults}
            <div class="rf-col-3"></div>
        {/if}
        <div class="rf-padding-left-2N--desktop rf-padding-left-1N--mobile rf-padding-right-1N--mobile rf-padding-top-2N rf-col-xs-12 rf-col-sm-12 rf-col-md-{size.md} rf-col-lg-{size.lg} rf-col-xl-{size.xl} {margin}">
            <SearchBox/>
        </div>
        {#if displayResults}
            <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-8 rf-col-lg-9 rf-col-xl-9">
                <Results/>
            </div>
        {:else}
            <div class="rf-col-3"></div>
            <div class="rf-col-12">
                <Footer/>
            </div>
        {/if}
    </div>
</div>

<script>
    import { advancedSearch, displayMode, searchInput } from '../tools/stores.js';
    import { searchTrigger } from '../tools/search.js';
	import SearchBox from './SearchBox.svelte';
    import Results from './Results.svelte';
    import Footer from './Footer.svelte';

    let displayResults;
    let size;
    let margin;

    $: displayResults = searchTrigger($searchInput);
    $: size = {
        md: displayResults ? 4 : 6,
        lg: displayResults ? 3 : 6,
        xl: displayResults ? 2 : 6
    };
    $: margin = displayResults ? "" : ($advancedSearch ? "" : "rf-margin-top-8N")

</script>

<style>
</style>