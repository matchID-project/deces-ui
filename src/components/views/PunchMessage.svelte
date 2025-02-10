<div class="rf-container rf-text--center rf-margin-top-3N rf-padding-right-1N rf-padding-left-1N">
  <div class="rf-grid-row">
    {#if $themeDnum}
      <div class="rf-col-12">
        <span class="rf-hide--mobile">
          <img src={"/dnum-logo.svg"} alt="DNUM Logo" width="64" height="64" />
        </span>
      </div>
    {/if}
    <div class="rf-col-xs-0 rf-col-md-3"></div>
    <div class="rf-col-xs-12 rf-col-md-6">
      <p class="rf-text--lead">
        <a
          href="/search"
          class="rf-href"
          title="Recherche"
          on:click|preventDefault={() => goTo({path: '/search'})}
        >
        </a>
      </p>
    </div>

    <div class="rf-col-12">
      {#if $version && $version.data && $version.data.todayDeces && $version.data.todayDeces.length > 0}
        <p class="rf-text--lead">
          Quelques décès marquants du {dateStringify($version.data.todayDeces[0].death.date)}
        </p>


        <div class="rf-container-fluid rf-margin-top-1N rf-padding-left-2N--desktop rf-padding-left-1N--mobile rf-padding-right-1N--mobile">
          <div class="rf-grid-row is-vcentered">
            {#if $version.data.todayDeces.length !== 2}
              <div class="rf-col-xs-0 rf-col-md-3"></div>
            {/if}
            {#each $version.data.todayDeces as result, index}
              <ResultCard result={result} index={index}/>
            {/each}
          </div>
        </div>
      {/if}

      <p class="rf-text--lead">
        <a
          href="/search"
          class="rf-href"
          title="Recherche"
          on:click|preventDefault={() => goTo({path: '/search'})}
          >
          {#if $themeDnum}
            <strong>DNUM</strong> - Sous direction de l'innovation et de la transformation numérique
          {:else}
            Recherchez parmi <strong>27 millions de décès</strong> depuis 1970 dans les enregistrements officiels de l'INSEE
          {/if}
        </a>
      </p>
      {#if $version}
        <p class="rf-text--xs rf-padding-top-2N">
          {#if $version.data}
            {$version.data.uniqRecordsCount} enregistrements, mise à jour le {$version.data.updateDate}
            <br>
            dernier décès enregistré le {$version.data.lastRecordDate} ({$version.data.lastDataset})
          {/if}
          <br>
          {$version.ui}
          {#if $version.api}
            -api/{$version.api}
          {:else}
            <br>
            <strong class="rf-color--rm">API indisponible (êtes vous hors ligne ?) </strong>
          {/if}
        </p>
      {/if}
    </div>
  </div>
</div>

<script>
  import { version, themeDnum } from '../tools/stores.js'
  import { goTo } from '../tools/routes.js'
  import ResultCard from "./ResultCard.svelte";
  import { dateStringify   } from '../tools/masks.js';

</script>

<style>
  a {
    text-decoration: none!important;
    box-shadow: none!important;
  }
</style>
