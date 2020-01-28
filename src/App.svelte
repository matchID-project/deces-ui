<Layout/>

<script>
  import Layout from './components/views/Layout.svelte';
  import { searchInput, current, resultsPerPage, updateURL } from './components/tools/stores.js';
  import { searchSubmit } from './components/tools/search.js';
  $: URLSearchSubmit(new URLSearchParams(location.search));

  const URLSearchSubmit = (urlParams) => {
        if (!$updateURL) {
			const myCurrent = urlParams.get('current') ? parseInt(urlParams.get('current').replace(/n_(.*)_n/,"$1")) : undefined;
			const myResultsPerPage = urlParams.get('size') ? parseInt(urlParams.get('size').replace(/n_(.*)_n/,"$1")) : undefined;
			const myQuery = urlParams.get('q')

			if (myQuery) {
				if (myResultsPerPage) { resultsPerPage.update(v => myResultsPerPage) }
				searchInput.update( v => {
					v.fullText.value = myQuery;
					return v;
				});
			}
        }
    }

</script>


