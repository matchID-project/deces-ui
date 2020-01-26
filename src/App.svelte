<MatchIDHeader />
<SearchHeader />
<h1>Hello {$searchInput.fullText.value}!</h1>
<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
<p>curent querystring is {JSON.stringify(query)}</p>

<script>
	import { querystring } from 'svelte-spa-router'
	import { searchInput } from './components/tools/stores.js'
	import MatchIDHeader from './components/views/MatchIDHeader.svelte';
	import SearchHeader from './components/views/SearchHeader.svelte';

	export let query;
	$: query = $querystring.split('&')
						  .map(s => decodeURI(s).split("="))
						  .reduce( (a,b) => {
												  a = Array.isArray(a) ? {[a[0]]: a[1]} : a
												  b = {[b[0]]: b[1]};
												  return {...a, ...b}
											})
</script>


