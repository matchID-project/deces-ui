<div class="container">
    <div
        class="step"
        class:inactive={step > $linkStep}
        class:done={ (step < $linkStep) || $linkCompleted }
        class:error={error}
    >
        <div class="vcenter overflow-hidden">
            <span>étape {step}</span>
            {#if ($linkStep > step) || ($linkCompleted)}
                &nbsp;
                <span>
                    <FontAwesomeIcon
                        icon={error ? faExclamationTriangle : faCheck}
                        class="is-low"
                    />
                </span>
            {/if}
            <br/>
            <span class="is-size-6-7">{@html label}</span>

        </div>
    </div>
</div>
<script>
    import { linkStep, linkCompleted } from '../tools/stores.js';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import { faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

    export let step;
    export let label;
    export let error;
</script>

<style>
	.step {
		box-sizing: border-box;
		margin: -10px 0 0px;
		border: 1px dashed #eee;
        min-height: 80px;
        position: relative;
    }

    .inactive {
        color: #8099c7;
    }

    .done {
        background-color:#209cee;
    }

    .error {
        background-color:#e2011c;
    }

    .vcenter {
        margin: 0;
        padding: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%, -50%);
        width: 100%;
    }

    .overflow-hidden {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    *, ::after, ::before {
        box-sizing: inherit;
    }

</style>