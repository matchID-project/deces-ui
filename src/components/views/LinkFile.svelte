<div class="container">
    <div
        on:drop|preventDefault={drop}
        ondragover="return false"
        on:dragenter={() => {hovering = true}}
        on:dragleave={() => hovering = false}
        class:hovering={(hovering === true) || $linkFile}
        class="dropzone"
    >
        <div class="vcenter">
            {#if $linkFile}
                <span>étape {step}</span> &nbsp;
                <span>
                    <FontAwesomeIcon icon={faCheck} class="is-low"/>
                </span>
                <br/>
                {$linkFile.name}
            {:else}
                <span>étape {step}</span><br/>
                <span>{label}</span>
            {/if}
        </div>
    </div>
</div>
<script>
    import { linkFile, linkStep } from '../tools/stores.js';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import { faCheck } from '@fortawesome/free-solid-svg-icons';
    export let label;
    export let step;

    $: if ($linkFile) { $linkStep+=1; };

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

</style>