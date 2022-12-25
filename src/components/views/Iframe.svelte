<div style="overflow: hidden">
    <iframe bind:this={iframe} title="documentation de l'api" {src} style="margin-top:-330px;width: 100%;height: 2200px;border-width: 0px;"></iframe>
</div>

<script>
    import { onMount } from 'svelte';
    export let src = undefined;
    let iframe;

</script>