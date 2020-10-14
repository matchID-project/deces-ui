<svelte:window on:keydown={handleKeydown}/>
<MatchIDHeader/>
{#if $route && $route.path && routes[$route.path].component}
	<svelte:component this={routes[$route.path].component} {...routes[$route.path].props}/>
{/if}

<script>
	import { onMount } from 'svelte';
	import MatchIDHeader from './components/views/MatchIDHeader.svelte';
	import { route, searchInput, searchCanvas, current, resultsPerPage,
		updateURL, advancedSearch, fuzzySearch, displayMode, themeDnum
	} from './components/tools/stores.js';
	import { URLSearchSubmit } from './components/tools/search.js';
	import { redirect, routes } from './components/tools/routes.js';

	onMount(async () => {
		redirect();
	})

	$: if (location.path === '/search') (URLSearchSubmit(new URLSearchParams(location.search)));
	$: element = document.getElementById('infoNotWorking');
	$: element.parentNode  && element.parentNode.removeChild(element);

	const handleKeydown = async (event) => {
		if (event.ctrlKey && event.altKey && event.key === 'd') {
			await themeDnum.update(v => v === 0 ? 1 : 0);
			console.log(`switch theme to ${$themeDnum ? 'DNUM' : 'public site'}`);
		}
	}

</script>


