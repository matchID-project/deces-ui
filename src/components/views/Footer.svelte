<footer class="footer">
  <div class="content has-text-centered">
    <a class="logo is-hidden-mobile" href="/search">
      {#if themeDnum}
        <img src={"/dnum-logo.svg"} alt="DNUM Logo" width="50" height="50" />
      {:else}
        <img src={"/favicon.svg"} alt="matchID Logo" width="50" height="50"  />
      {/if}
    </a>
    <p>
      <strong>DNUM</strong> - Sous direction de l'innovation et de la transformation numérique
    </p>
  </div>
</footer>

<script>
  const themeDnum = parseInt('__THEME_DNUM__')
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
