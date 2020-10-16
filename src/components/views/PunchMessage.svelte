<div class="rf-container-fluid rf-text--center rf-margin-top-8N rf-padding-right-1N rf-padding-left-1N">
  <span class="rf-hide--mobile">
    {#if $themeDnum}
      <img src={"/dnum-logo.svg"} alt="DNUM Logo" width="64" height="64" />
    {/if}
  </span>
  <p>
    {#if $themeDnum}
      <strong>DNUM</strong> - Sous direction de l'innovation et de la transformation numérique
    {:else}
      recherchez parmi plus de 25 millions de décès depuis 1970 dans les enregistrements officiels de l'INSEE
    {/if}
  </p>
</div>

<script>
  import { themeDnum } from '../tools/stores.js'
</script>

<style>
</style>
