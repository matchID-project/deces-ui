{#if icon}
  <div class={classes} class:center={center}>
    <div
      class={classes}
      class:spin={spin}
      class:rf-color--rm={!icons[icon]}
    >
      {@html icons[icon] || icons['ri:alert-line']}
    </div>
  </div>
{/if}

<script>
  import { icons } from "../../../public/build/icons.js";
  export let text = undefined;
  export let icon = undefined;
  export let spin = undefined;
  export let center = undefined;

  $: classes = `rf-fi--icon center ${$$props.class ? $$props.class : ""}`;

</script>

<style>

  .center {
    margin: 0 auto;
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
