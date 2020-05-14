<div class="app">
    <SearchHeader/>
    <Results/>
    <Footer/>
</div>

<script>
    import { onMount } from 'svelte';
    import { displayMode } from '../tools/stores.js';
	import SearchHeader from './SearchHeader.svelte';
    import Results from './Results.svelte';
    import Footer from './Footer.svelte';

</script>
