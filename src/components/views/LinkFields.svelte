<div class="container fields-container">
    {#each fields as field}
        <LinkField bind:field={field}/>
    {/each}
</div>

<script>
    import LinkField from './LinkField.svelte';
    export let mapping = {};
    export let fields;

    $: if (fields) {
        mapping={
            direct: {},
            reverse: {}
        };
        fields.filter(f => f.mapTo).map(f => {
            mapping.direct[f.mapTo]=f.field && (f.field.result || f.field);
            mapping.reverse[f.field && (f.field.query || f.field)]=f.mapTo;
        });
    };

</script>

<style>
    .fields-container {
        display: flex;
        justify-content: center;
    }
</style>