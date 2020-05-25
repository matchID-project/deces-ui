<div class="container">
    <div
        on:drop|preventDefault={drop}
        ondragover="return false"
        on:dragenter={() => {hovering = true}}
        on:dragleave={() => hovering = false}
        class:hovering={(hovering === true) || (field && field.mapTo)}
        class="dropzone"
        on:click|preventDefault={() => field.mapTo = null }
    >
        <div class="vcenter is-size-6-7">
            {field.label}: <strong>{field.mapTo || 'aucun'}</strong>
        </div>
    </div>
</div>

<script>
    export let field;

    let hovering = false;

    const drop = (ev) => {
        ev.dataTransfer.dropEffect = 'move';
		field.mapTo = ev.dataTransfer.getData("text/plain");
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

</style>