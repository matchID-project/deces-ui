<svelte:window on:keydown={handleKeydown}/>
<MatchIDHeader/>
{#each Object.keys(routes) as route, index}
	{#if route === location.pathname}
		<svelte:component this={routes[route].component} {...routes[route].props}/>
	{/if}
{/each}

<script>
	import { onMount } from 'svelte';
	import About from './components/views/About.svelte';
	import MatchIDHeader from './components/views/MatchIDHeader.svelte';
	import Search from './components/views/Search.svelte';
	import Geo from './components/views/Geo.svelte';
	import Link from './components/views/Link.svelte';
	import { searchInput, searchCanvas, current, resultsPerPage,
		updateURL, advancedSearch, fuzzySearch, displayMode, themeDnum
	} from './components/tools/stores.js';

	let routes = {
		'/': { component: Search },
		'/search': { component: Search },
		'/about/service': { component: About, props: { page: 'service'} },
		'/about/data': { component: About, props: { page: 'data'} },
		'/geo': { component: Geo },
		'/link': { component: Link }
	}

	onMount(async () => {
		if (location.pathname === '/') {
			if (`${location.search}`) {
				window.history.replaceState({}, '', `/search${location.search}`);
			} else {
				window.history.replaceState({}, '', `/search`);
			}
		}
	})

	$: URLSearchSubmit(new URLSearchParams(location.search));
	$: element = document.getElementById('infoNotWorking');
	$: element.parentNode  && element.parentNode.removeChild(element);

	const URLSearchSubmit = async (urlParams) => {
		if (!$updateURL) {
			$displayMode = urlParams.get('view') ? urlParams.get('view') : 'card';
			const myCurrent = urlParams.get('current') ? parseInt(urlParams.get('current').replace(/n_(.*)_n/,"$1")) : undefined;
			const myResultsPerPage = urlParams.get('size') ? parseInt(urlParams.get('size').replace(/n_(.*)_n/,"$1")) : undefined;
			const myQuery = Object.keys($searchInput).map(key => {
				const q = urlParams.get($searchInput[key].url)
				if (q) { return [key, q] }
			}).filter(x => x);
			if ( urlParams.get('fuzzy') === 'false' ) {
				$fuzzySearch=false;
			}
			if ( urlParams.get('advanced') === 'true' ) {
				$advancedSearch = true;
				searchCanvas.update(v => {
					Object.keys(v).map(key => {
						v[key].active = !v[key].active;
					});
					return v
				});
			};

			if (myQuery) {
				if (myCurrent) { current.update(v => 1) }
				if (myResultsPerPage) { resultsPerPage.update(v => myResultsPerPage) }
				searchInput.update( v => {
					myQuery.map(q => {
						v[q[0]].value = q[1]
					});
					Object.keys(v).map(key => {
						v[key].fuzzy = $fuzzySearch ? "auto" : false;
					});
					return v;
				});
			}
		}
	}

	const handleKeydown = async (event) => {
		if (event.ctrlKey && event.altKey && event.key === 'd') {
			await themeDnum.update(v => v === 0 ? 1 : 0);
			console.log(`switch theme to ${$themeDnum ? 'DNUM' : 'public site'}`);
		}
	}

</script>


