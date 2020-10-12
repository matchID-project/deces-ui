<div
    class="rf-tile"
    class:rf-background--hovering={(hovering === true)}
    on:dragover={() => {hovering = true}}
    on:dragleave={() => {hovering = false}}
    on:drop|preventDefault={drop}
    ondragover="return false"
    class:rf-inactive={(!field || !field.mapTo)}
    class:rf-color--bf={(field && field.mapTo)}
    class:rf-text--error={field && field.warning}
    class:hovering={hovering === true}
    on:click|preventDefault={reset}
>
    <div class="rf-tile__body">
        <div class="rf-tile_desc">
            {field.label}<br/>
            {#if field && field.mapTo}
                <span class="rf-fi-arrow-down-s-line rf-fi--lg"></span>
                <br/>
                <strong>
                    {field.mapTo}
                </strong>
            {:else}
                <span class="rf-text--sm">
                    <br> non associé
                </span>
            {/if}
        </div>
    </div>
</div>

<script>
    export let field;
    import { linkSourceHeaderTypes } from '../tools/stores.js';

    let hovering = false;

    const reset = () => {
        if (field.mapTo) {
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

    .hovering * {
    pointer-events: none;
    }
</style>
