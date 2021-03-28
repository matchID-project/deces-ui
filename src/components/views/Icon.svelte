{#if icon}
  <div
    class={classes}
    class:center={center}
    class:zoom={zoom}
    class:zoomed={zoomed}
    on:mouseenter={() => zoomed = zoom}
    on:mouseleave={() => zoomed = false}
  >
    <div
      class={classes}
      class:spin={spin}
      class:rf-color--rm={!icons[icon]}
      style="position:relative"
    >
      {#if href}
        <a class="rf-fi__link" href={href} aria-label={label}>
          {@html icons[icon] || icons['ri:alert-line']}
        </a>
      {:else}
        {@html icons[icon] || icons['ri:alert-line']}
      {/if}
      {#if circleText}
        <div style="width:3rem;height:3rem;position:absolute;z-index:9999;top:-0.75rem;left:-0.75rem;">
          <IconDecorator text={circleText}/>
        </div>
      {/if}
    </div>
  </div>
{/if}

<script>
  import { icons } from "../tools/icons.js";
  import IconDecorator from './IconDecorator.svelte';
  export let icon = undefined;
  export let spin = undefined;
  export let center = undefined;
  export let href = undefined;
  export let label = undefined;
  export let circleText = undefined;
  export let zoom = undefined;
  let zoomed = false;

  $: classes = `rf-fi--icon center ${$$props.class ? $$props.class : ""}`;

</script>

<style>

  .center, .zoom {
    margin: 0 auto;
    transition: transform .2s;
  }

  .zoomed {
    transform: scale(1.5);
  }

  a, .link {
    text-decoration: none!important;
  }

  @-webkit-keyframes spinner-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @-moz-keyframes spinner-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @-o-keyframes spinner-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @-ms-keyframes spinner-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes spinner-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .spin {
    animation: all 300ms ease;
    -webkit-animation: spinner-spin  3s linear infinite;
    -moz-animation: spinner-spin  3s linear infinite;
    -o-animation: spinner-spin  3s linear infinite;
    animation: spinner-spin  3s linear infinite;
  }
</style>
