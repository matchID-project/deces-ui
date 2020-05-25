<div class="container">
    <div
        class="step"
        class:inactive={step > $linkStep}
        class:done={ (step < $linkStep) || $linkCompleted }
    >
        <div class="vcenter">
            <span>étape {step}</span>
            {#if ($linkStep > step) || ($linkCompleted)}
                &nbsp;
                <span>
                    <FontAwesomeIcon icon={faCheck}/>
                </span>
            {/if}
            <br/>
            <span>{label}</span>

        </div>
    </div>
</div>
<script>
    import { linkStep, linkCompleted } from '../tools/stores.js';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import { faCheck } from '@fortawesome/free-solid-svg-icons';

    export let step;
    export let label;
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

    .vcenter {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%, -50%);
        width: 100%;
    }

    *, ::after, ::before {
        box-sizing: inherit;
    }

</style>