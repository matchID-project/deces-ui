<div
    class="rf-input-group hover-parent rf-text--left rf-margin-top-1N rf-padding-left-4px rf-padding-right-4px rf-padding-bottom-4px"
    class:rf-background--hovering={(hovering === true)}
    class:rf-input-group--valid={field && field.mapTo && !field.warning}
    class:rf-input-group--error={field && field.warning}
    class:hovering={hovering === true}
    on:dragover={() => {hovering = true}}
    on:dragleave={() => {hovering = false}}
    on:drop|preventDefault={drop}
    ondragover="return false"
    on:click|preventDefault={reset}
>
    <label
        class="rf-label"
        for={field.group+field.label}
        style="overflow: hidden;text-overflow:ellipsis;position: relative"
    >
        <span
            class:rf-fi-check-line={field && field.mapTo && !field.warning}
            class:rf-fi-alert-line={field && field.warning}
        >
            &nbsp;
        </span>
        <span style="position:absolute;top:-2px">{@html field.label}</span>
    </label>
    <input
        class="rf-input rf-margin-top-0"
        list="LinkSampleTable"
        id={field.group+field.label}
        name={field.label}
        class:rf-input--valid={(field && field.mapTo && !field.warning)}
        placeholder="non associé"
        bind:value={field.mapTo}
        title={field.label}
    />
</div>

<script>
    export let field;
    import { linkSourceHeaderTypes } from '../tools/stores.js';

    let hovering = false;

    const reset = () => {
        if (field.mapTo && $linkSourceHeaderTypes[field.mapTo]) {
            $linkSourceHeaderTypes[field.mapTo].mapped = undefined;
        }
        field.mapTo = null;
        field.guessedType = undefined;
        field.guessedFormat = undefined;
        field.warning = undefined;
    }

    const drop = (ev) => {
        ev.dataTransfer.dropEffect = 'move';
        const data = JSON.parse(ev.dataTransfer.getData("text/plain"));
        field.mapTo = data.col;
        field.guessedType = data.type;
        field.guessedFormat = data.format;
        if (field.guessedType !== field.type) {
            field.warning = true;
        } else {
            field.warning = undefined;
        }
		hovering = null;
    };
</script>

<style>
    .hovering {
    background-color: var(--yd500);
    }

    .hover-parent * {
        pointer-events: none;
    }
</style>
