<section
  class="hero is-primary is-medium is-bold has-text-centered"
  style="--hero-height: {heroHeight}"
>
  <div
    class="hero-body"
    style="--margin-height: {marginHeight}"
  >

    <h1 class="title has-text-white">
      <slot name="title">
      </slot>
    </h1>
    <h1 class="subtitle has-text-white">
      <slot name="subtitle">
      </slot>
    </h1>
    <slot name="content"></slot>
  </div>
</section>

<script>
  export let height="16rem";
  const numHeight=height.replace(/^([0-9]+)(.*)$/,"$1");
  const metric=height.replace(/^([0-9]+)(.*)$/,"$2");
  const heroHeight=`${height}`;
  const marginHeight=`${numHeight/2}${metric}`;
</script>

<style>


  @media print,screen and (max-width:768px) {
    .hero.is-medium .hero-body {
        padding-bottom: 48px;
        padding-top: 48px;
    }
  }

  @media print,screen and (min-width:769px) {
    .hero.is-medium .hero-body {
        transform: translateY(-50%);
        margin-top: var(--margin-height);
    }
    .hero {
      height: var(--hero-height);
    }
  }


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