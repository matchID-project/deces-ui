<div class={classes} class:center={center}>
  <div
    class={classes}
    class:spin={spin}
  >
      <svg height="20" width="20" viewBox="0 0 20 20">
          <circle r="9" cx="10" cy="10" fill-opacity="0" stroke="var(--bf500)" stroke-width="2"/>
          <circle r="5" cx="10" cy="10" fill-opacity="0"
              stroke="var(--bf500)"
              stroke-width="10"
              stroke-dasharray="{percent/2 * 31.42 } {31.42 - percent * 31.42}" />
      </svg>
  </div>
</div>

<script>
  export let percent;
  export let spin = undefined;
  export let center = undefined;

  $: classes = `rf-fi--icon rf-margin-right-6px ${$$props.class ? $$props.class : ""}`;

</script>

<style>

  .center {
    margin: 0 auto;
  }

  .rf-margin-right-6px {
    margin-right: 6px;
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
