<div class="container">
    <div
        on:drop|preventDefault={drop}
        ondragover="return false"
        on:dragenter={() => {hovering = true}}
        on:dragleave={() => hovering = false}
        class:hovering={(hovering === true) || $linkFile}
        class="dropzone"
        class:error={error}
        on:click|preventDefault={chooseFile}
    >
        <div class="vcenter">
            {#if $linkFile}
                <span>étape {step}</span> &nbsp;
                <span>
                    <FontAwesomeIcon
                        icon={error ? faExclamationTriangle : faCheck}
                        class="is-low"
                    />
                </span>
                <br/>
                <span class="is-size-6-7">{@html label}</span>
            {:else}
                <span>étape {step}</span><br/>
                <span class="is-size-6-7">{@html label}</span>
            {/if}
        </div>
    </div>
</div>
<script>
    import { linkFile, linkStep } from '../tools/stores.js';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import { faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
    export let label;
    export let step;
    export let error;

    let hovering = false;
	export function dropTop (events) {
		if (hovering === false) {
			drop(ev)
		}
	};

    const drop = (ev) => {

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    $linkFile = ev.dataTransfer.items[i].getAsFile();
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.files.length; i++) {
            }
        }
		hovering = null;
    };

    const chooseFile = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = ev => {
            $linkFile = ev.target.files[0];
        }
        input.click();
    }

</script>

<style>
	.dropzone {
		box-sizing: border-box;
		margin: -10px 0 0px;
		border: 1px dashed #eee;
        min-height: 80px;
        position: relative;
	}

	.hovering {
		background-color:#209cee;
	}
	.hovering * {
		pointer-events: none; /* so that a child hover child is not a "dragleave" event */
	}

    .vcenter {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%, -50%);
        width: 100%;
    }

    .has-text-left {
        text-align: left!important;
    }

    .error {
        background-color:#e2011c;
    }

</style>