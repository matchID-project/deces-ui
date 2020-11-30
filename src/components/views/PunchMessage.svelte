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
        {#if $themeDnum}
          <strong>DNUM</strong> - Sous direction de l'innovation et de la transformation numérique
        {:else}
          Recherchez parmi <strong>25 millions de décès</strong> depuis 1970 dans les enregistrements officiels de l'INSEE
        {/if}
      </p>
      {#if $version}
        <p class="rf-text--xs rf-padding-top-2N">
          Dernier enregistrement de décès le {$version.data.lastRecordDate}
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
</script>

<style>
</style>
