<div class="rf-container--fluid">
    <div class="rf-grid-row">
        {#each fields as field}
            <div class="rf-col rf-margin-1N">
                <LinkField bind:field={field}/>
            </div>
        {/each}
    </div>
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
