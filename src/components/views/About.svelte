<Hero>
  <span slot="title">
    À propos
  </span>
  <span slot="subtitle">
    {title[page]}
  </span>
</Hero>

<div class="about-body">
  <div class="container">
    <div class="margin">
      <svelte:component this={component[page]}/>
    </div>
  </div>
</div>

<script>
  export let page;
  import Hero from './Hero.svelte';
  import AboutService from './AboutService.svelte';
  import AboutData from './AboutData.svelte';

  let title = {
    data: 'des données INSEE',
    service: 'de ce service'
  }
  let component = {
    data: AboutData,
    service: AboutService
  }

</script>

<style>

  .about-body {
      max-width: 1235px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      padding: 0 24px;
  }

  @media print,screen and (max-width:768px) {
    .margin {
      padding: 0 16px;
    }
  }

  @media print,screen and (min-width:769px) {
    .margin {
      padding: 0 48px;
      }
  }

</style>