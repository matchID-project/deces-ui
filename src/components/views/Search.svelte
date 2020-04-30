<div class="app">
    <SearchHeader/>
    <Results/>
</div>

<script>
    import { onMount } from 'svelte';
    import { displayMode } from '../tools/stores.js';
	import SearchHeader from './SearchHeader.svelte';
    import Results from './Results.svelte';

</script>