<div style="overflow: hidden">
    <iframe bind:this={iframe} title="documentation de l'api" {src} {style}></iframe>
</div>

<script>
    import { onMount } from 'svelte';
    export let src = undefined;
    export let style = "margin-top:-330px;width: 100%;height: 2200px;border-width: 0px;";
    let iframe;

</script>