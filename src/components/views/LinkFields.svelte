<div class="rf-container--fluid">
    <div class="rf-grid-row rf-text--left">
        {#each groups as group}
            {#if group}
                <div class="rf-col-12 rf-margin-top-2N rf-padding-left-4px">
                    <strong>
                        {group}
                    </strong>
                </div>
            {/if}
            {#each fields.filter(f => f.group === group) as field}
                <div class="rf-col{field.size ? "-" + field.size : ""} rf-text-left">
                    <LinkField bind:field={field}/>
                </div>
            {/each}
        {/each}
    </div>
</div>

<script>
    import LinkField from './LinkField.svelte';
    export let mapping = {};
    export let fields;

    let groups = [];

    $: fields.forEach(field => {
        if (!groups.includes(field.group)) {
            groups.push(field.group);
        }
    })

    $: if (fields) {
        const tmp = {
            direct: {},
            reverse: {}
        };
        fields.filter(f => f.mapTo).map(f => {
            tmp.direct[f.mapTo]=f.field && (f.field.result || f.field);
            tmp.reverse[f.field && (f.field.query || f.field)]=f.mapTo;
        });
        mapping = tmp;
    };

</script>
