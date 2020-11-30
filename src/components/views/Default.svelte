<div class="rf-container">
  <div class="rf-grid-row">
    <div class="rf-col-12 rf-padding-top-3N">
      <h2 class="rf-text--center">
        {title || "Non trouvé"}
      </h2>
    </div>
    {#if subtitle}
      <div class="rf-col-12 rf-padding-bottom-2N">
        <p class="rf-text--center rf-text--lg">
          {subtitle}
        </p>
      </div>
    {/if}
    {#if Info}
      <svelte:component this={Info}/>
    {/if}
  </div>
</div>

<script>
  let Info;
  import('./Info.svelte').then(module => {
    Info = module.default;
  });
  export let title = undefined;
  export let subtitle = undefined;
</script>

<style>

</style>