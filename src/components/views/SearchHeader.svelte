<Hero height={$advancedSearch ? "19rem" : "16rem" }>
    <span slot="title">
      fichier des décès
    </span>
    <div slot="subtitle">
      {#if !$advancedSearch}
        <span class="is-hidden-mobile">
          recherche gratuite parmi
        </span>
        <span> <b>25 millions</b> de décès depuis 1970
          <br/>
        </span>
        <a
          href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/"
        > source INSEE </a>
      {/if}
    </div>
    <span slot="content">
      <SearchBox/>
    </span>
</Hero>

<script>
  import { advancedSearch } from '../tools/stores.js';
  import Hero from './Hero.svelte';
  import SearchBox from "./SearchBox.svelte";
</script>

<style>

  a {
      color: #3273dc;
      cursor: pointer;
      text-decoration: none;
  }

  ::before, ::after {
    box-sizing: inherit;
  }

  @media print,screen and (max-width:768px) {
    .is-hidden-mobile {
      display: none
    }
  }

</style>