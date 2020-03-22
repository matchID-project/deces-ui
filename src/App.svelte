<svelte:window on:keydown={handleKeydown}/>
<Layout/>

<script>
  import Layout from './components/views/Layout.svelte';
  import { searchInput, searchCanvas, current, resultsPerPage, updateURL, advancedSearch, apiVersion } from './components/tools/stores.js';
  import { searchSubmit, toggleFuzzySearch } from './components/tools/search.js';
  $: URLSearchSubmit(new URLSearchParams(location.search));

  $: element = document.getElementById('infoNotWorking')
  $: element.parentNode  && element.parentNode.removeChild(element);

	const URLSearchSubmit = (urlParams) => {
        if (!$updateURL) {
			const myCurrent = urlParams.get('current') ? parseInt(urlParams.get('current').replace(/n_(.*)_n/,"$1")) : undefined;
			const myResultsPerPage = urlParams.get('size') ? parseInt(urlParams.get('size').replace(/n_(.*)_n/,"$1")) : undefined;
			const myQuery = Object.keys($searchInput).map(key => {
				const q = urlParams.get($searchInput[key].url)
				if (q) { return [key, q] }
			}).filter(x => x);
			if ( urlParams.get('fuzzy') === 'false' ) {
				toggleFuzzySearch();
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
				if (myResultsPerPage) { resultsPerPage.update(v => myResultsPerPage) }
				if (myCurrent) { current.update(v => myCurrent) }
				searchInput.update( v => {
					myQuery.map(q => {
						v[q[0]].value = q[1]
					});
					return v;
				});
			}
        }
    }

	const handleKeydown = async (event) => {
		if (event.ctrlKey && event.altKey && event.key === 'b') {
			await apiVersion.update(v => v === 'elasticsearch' ? 'backend' : 'elasticsearch');
			console.log(`switch Api to ${$apiVersion}`);
		}
	}

</script>


