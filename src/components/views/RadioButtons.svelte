<div class="rf-text--left">
    <fieldset class="rf-fieldset">
        <legend class="rf-fieldset__legend" id='radio-legend'>
            {title}&nbsp;
        </legend>
        <div class="rf-fieldset__content">
            {#each values as v,i}
                <div class="rf-radio-group">
                    <input type="radio" bind:group={value} value={v} id={formId(i)} name={formId(i)}>
                    <label class="rf-label" for={formId(i)}>
                        {labels[i]}
                    </label>
                </div>
            {/each}
        </div>
    </fieldset>
</div>

<script>
    export let title;
    export let values = [];
    export let labels = [];
    export let value = undefined;
    export let id = undefined;

    const slugify = (str) => {
        try {
        return str.normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]*/g, '').replace(/[^a-z0-9]+/gi, ' ').replace(/(^\s*|\s*)$/,'').replace(/\s+/gi,'-');
        } catch (e) {
        return str.toLowerCase().replace(/[\u0300-\u036f]*/g, '').replace(/[^a-z0-9]+/gi, ' ').replace(/(^\s*|\s*)$/,'').replace(/\s+/gi,'-');
        }
    }

    const formId = (i) => {
        return id ? `${slugify(id)}-${i}` : `${slugify(title)}-${i}`;
    }

</script>
