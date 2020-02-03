<section class="hero is-primary is-medium is-bold has-text-centered">
  <div class="hero-body">
    <h1 class="title has-text-white">
      fichier des décès
    </h1>
    {#if !$advancedSearch}
      <h1 class="subtitle has-text-white">
        <span class="is-hidden-mobile">
          recherche gratuite parmi
        </span>
        <span> <b>25 millions</b> de décès depuis 1970
          <br/>
        </span>
        <a
          href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/"
        > source INSEE </a>
      </h1>
    {/if}
    <SearchBox/>
  </div>
</section>

<script>
  import { advancedSearch } from '../tools/stores.js';
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

  .hero {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 24px;
    padding-left: 24px;
  }

  .hero.is-medium .hero-body {
      padding-bottom: 32px;
      padding-top: 32px;
  }

  .hero.is-primary {
    background-color: #00d1b2;
    color: #fff;
  }

  .hero.is-primary.is-bold {
      background-image: linear-gradient(141deg, #009e6c 0%, #00d1b2 71%, #00e7eb 100%);
  }

  .has-text-centered {
    text-align: center!important;
  }

  .has-text-white {
    color: #fff!important;
  }

  .title {
      color: #363636;
      font-size: 2rem;
      font-weight: 600;
      line-height: 1.125;
  }

  .content:not(:last-child), .subtitle:not(:last-child), .title:not(:last-child) {
      margin-bottom: 1.5rem;
  }

  .subtitle:not(.is-spaced) + .title, .title:not(.is-spaced) + .subtitle {
      margin-top: -1.25rem;
  }

  .subtitle, .title {
    word-break: break-word;
  }

  .subtitle {
    color: #4a4a4a;
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.25;
  }

  figure, h1, html, li, ul {
    margin: 0;
    margin-bottom: 0px;
    padding: 0;
  }

  @media print,screen and (max-width:768px) {
    .logo {
    margin-top: -8px;
    margin-bottom: -15px;
    margin-left: -12px;
    }
    .is-hidden-mobile {
      display: none
    }
  }



</style>