{#if searchTrigger($searchInput) || !$autocompleteBypass }
  <div class="results-body">
    <div class="container">
      <div class="margin">
        <ResultsHeader/>
        <div class="columns is-vcentered is-multiline is-mobile">
          {#each $searchResults as result, index}
            {#if (index === 1) && adsbygoogle }
              <ins
                class="adsbygoogle column is-12"
                style="display:block"
                data-ad-client="ca-pub-6277851622494904"
                data-ad-slot="9615515197"
                data-ad-format="auto"
                data-full-width-responsive="true">
              </ins>
            {/if}
            <Result result={result}/>
          {/each}
        </div>
        <Pagination/>
      </div>
    </div>
  </div>
{/if}

<script>
  import { searchResults, searchInput, autocompleteBypass } from '../tools/stores.js';
  import { searchTrigger } from '../tools/search.js';
  import ResultsHeader from './ResultsHeader.svelte';
  import Result from "./Result.svelte";
  import Pagination from './Pagination.svelte';
  let adsbygoogle;
  $: (adsbygoogle = window.adsbygoogle || []).push({});
</script>

<style>

  .results-body {
      max-width: 1235px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      padding: 0 24px;
  }

  @media (max-width: 800px) {
    .results-body {
        width: 100%;
        display: block;
        padding: 0 15px;
     }
  }

  .margin {
      padding: 24px 0px 32px 0px;
  }

  @media (max-width: 800px) {
    .margin {
        width: 100%;
        padding-left: 0;
    }
  }

  .container {
    flex-grow: 1;
    margin: 0 auto;
    position: relative;
    width: auto;
  }

  @media screen and (min-width:1024px) {
    .container {
      max-width: 960px;
    }
  }

  @media screen and (min-width:1216px) {
    .container {
      max-width: 1152px;
    }
  }

  @media screen and (min-width:1408px) {
    .container {
      max-width: 1344px;
    }
  }

  .columns {
    margin-left: -.75rem;
    margin-right: -.75rem;
    margin-top: -.75rem;
  }

  .columns.is-mobile {
    display: flex;
  }

  .columns:last-child {
      margin-bottom: -.75rem;
  }

  .columns:not(:last-child) {
      margin-bottom: .75rem;
  }

  .columns.is-multiline {
      flex-wrap: wrap;
  }

  .columns.is-vcentered {
      align-items: center;
  }

  *, ::after, ::before {
    box-sizing: inherit;
  }
</style>