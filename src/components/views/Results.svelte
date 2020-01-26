<div class="results-body">
  <div class="container">
    <div class="margin">
      <div class="columns">
        {#each $searchResults as result}
          <Result result={result}/>
        {/each}
      </div>
    </div>
  </div>
</div>

<script>
  import { searchResults } from '../tools/stores.js';
  import Result from "./Result.svelte";
</script>

<style>

  .results-body {
      max-width: 1300px;
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
      padding: 32px 0px 32px 32px;
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

  *, ::after, ::before {
    box-sizing: inherit;
  }
</style>