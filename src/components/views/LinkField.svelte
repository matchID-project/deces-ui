<div
    class="hover-parent rf-text--left rf-margin-top-1N rf-padding-left-4px rf-padding-right-4px rf-padding-bottom-4px"
    class:rf-background--hovering={(hovering === true)}
    on:dragover={() => {hovering = true}}
    on:dragleave={() => {hovering = false}}
    on:drop|preventDefault={drop}
    ondragover="return false"
    class:rf-inactive={(!field || !field.mapTo)}
    class:rf-color--bf={(field && field.mapTo && !field.warning)}
    class:rf-color--rm={field && field.warning}
    class:hovering={hovering === true}
    on:click|preventDefault={reset}
>
    <label
        class="rf-label"
        for={field.group+field.label}
        style="overflow:hidden;text-overflow:ellipsis;"
    >
        {@html field.label}
    </label>
    <div class="rf-field">
        <input
            class="rf-input"
            id={field.group+field.label}
            name={field.label}
            autoComplete="off"
            placeholder="non associé"
            bind:value={field.mapTo}
            title={field.label}
        />
    </div>
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
