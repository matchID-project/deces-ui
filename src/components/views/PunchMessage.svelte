<div class="rf-container-fluid rf-text--center rf-margin-top-8N">
  <a class="logo is-hidden-mobile" href="/search">
    {#if $themeDnum}
      <img src={"/dnum-logo.svg"} alt="DNUM Logo" width="50" height="50" />
    {/if}
  </a>
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
