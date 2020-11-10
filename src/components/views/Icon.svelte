{#if icon}
  <div class={classes} class:center={center}>
    <div
      class={classes}
      class:spin={spin}
      class:rf-color--rm={!icons[icon]}
    >
      {#if href}
        <a class="rf-fi__link" href={href} aria-label={label}>
          {@html icons[icon] || icons['ri:alert-line']}
        </a>
      {:else}
        {@html icons[icon] || icons['ri:alert-line']}
      {/if}
    </div>
  </div>
{/if}

<script>
  import { icons } from "../tools/icons.js";
  export let icon = undefined;
  export let spin = undefined;
  export let center = undefined;
  export let href = undefined;
  export let label = undefined;

  $: classes = `rf-fi--icon center ${$$props.class ? $$props.class : ""}`;

</script>

<style>

  .center {
    margin: 0 auto;
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
