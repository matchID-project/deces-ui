<Hero height={$advancedSearch ? "19rem" : "17rem" }>
    <span slot="title">
      fichier des décès
    </span>
    <div slot="subtitle">
      {#if !$advancedSearch}
        <span class="is-hidden-mobile">
          recherche {#if !$themeDnum}gratuite{/if} parmi
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
  import { advancedSearch, themeDnum } from '../tools/stores.js';
  import Hero from './Hero.svelte';
  import SearchBox from "./SearchBox.svelte";
</script>

<style>

  a {
      color: #ff7a8a;
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
