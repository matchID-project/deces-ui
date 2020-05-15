<footer class="footer">
  <div class="content has-text-centered">
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
</footer>

<script>
  import { themeDnum } from '../tools/stores.js'
</script>

<style>
  .footer {
    background-color: #fafafa;
    padding: 3rem 1.5rem 6rem;
  }

  footer {
    display: block;
  }

  .content p:not(:last-child) {
    margin-bottom: 1em;
  }

  .has-text-centered {
    text-align: center !important;
  }

  @media print,screen and (max-width:768px) {
    .is-hidden-mobile {
      display: none!important;
    }
  }

</style>
