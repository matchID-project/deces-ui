<div style="width:100%">
    {#if ($waitSearch && !($displayMode === 'geo'))}
        <div class="rf-wait-container" in:fade out:fade>
            <div class="rf-wait-content">
                <strong>recherche en cours</strong>
                <br/>
                <FontAwesomeIcon icon={faSpinner} class="is-48 spin"/>
            </div>
        </div>
    {/if}
</div>
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
    import { advancedSearch, displayMode, searchInput, waitSearch} from '../tools/stores.js';
    import { searchTrigger } from '../tools/search.js';
	import SearchBox from './SearchBox.svelte';
    import Results from './Results.svelte';
    import PunchMessage from './PunchMessage.svelte';
    import { faSpinner } from '@fortawesome/free-solid-svg-icons'
    import FontAwesomeIcon from './FontAwesomeIcon.svelte'

    let displayResults;
    let size;
    let margin;
    let firstTime=true;

    $: if (Object.keys($searchInput).some(k => $searchInput[k].value)) {
        firstTime = false;
    };
    $: displayResults = (Object.keys($searchInput).some(k => $searchInput[k].value) || !firstTime);
    $: size = {
        md: displayResults ? 4 : 6,
        lg: displayResults ? 3 : 6,
        xl: displayResults ? 2 : 6
    };
    $: margin = displayResults ? "" : ($advancedSearch ? "" : "rf-margin-top-8N")

</script>

<style>

</style>