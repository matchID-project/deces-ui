<div class="container">
    <div
        on:drop|preventDefault={drop}
        ondragover="return false"
        on:dragenter={() => {hovering = true}}
        on:dragleave={() => hovering = false}
        class:hovering={(hovering === true) || (field && field.mapTo)}
        class="dropzone"
        class:warning={field && field.warning}
        on:click|preventDefault={reset}
    >
        <div class="vcenter is-size-6-7">
            {field.label}: <strong>{field.mapTo || 'aucun'}</strong>
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
	.dropzone {
		border: 1px dashed #003189;
        position: relative;
        padding: .5rem;
        margin: .5rem;
        border-radius: 24px;
        position: relative;
        min-height: 80px;
	}

    .vcenter {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%, -50%);
        width: 100%;
        padding: .5rem;
    }

	.hovering {
        background-color:#003189;
        color: #fff;
	}
	.hovering * {
		pointer-events: none; /* so that a child hover child is not a "dragleave" event */
	}
    .warning {
        background-color:#e2011c;
    }
</style>