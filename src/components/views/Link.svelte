<div class="image">
    <div class="badge">
        beta
    </div>
</div>
<Hero height={"14rem"}>
    <span slot="title">
      fichier des décès
      {#if ($linkStep > 1)}
        <div style="position: absolute;top:.5rem;right:.5rem;">
            <button
                class="button is-danger"
                title="réinitialiser le traitement"
                on:click|preventDefault={reset}
            >
                réinitialiser &nbsp;
                <span>
                    <FontAwesomeIcon icon={faTrash} class="is-low"/>
                </span>
            </button>
        </div>
      {/if}
    </span>
    <span slot="subtitle">
        appariement
    </span>
    <span slot="content">
        <div class="columns">
            {#each steps as step, i}
                <div class="column is-3">
                    {#if ((i+1) === $linkStep) && step.hero}
                        <svelte:component this={step.hero} step={i+1} label={step.label} error={step.error}/>
                    {:else}
                        <LinkStep step={i+1} label={step.label} error={step.error}/>
                    {/if}
                </div>
            {/each}
        </div>
    </span>
</Hero>

<div class="content body">
    {#if wait}
        <div class="wait-center">
            <strong>{waitMessage}</strong>
            <br/>
            <FontAwesomeIcon icon={faSpinner} class="is-48 spin"/>
        </div>
    {/if}
    <div style={wait ? `display: none;` : ''}>
        {#if steps[$linkStep-1].body}
            <svelte:component this={steps[$linkStep-1].body}/>
        {/if}
    </div>
</div>

<script>
    import { onMount } from 'svelte';
    import { linkWaiter, linkStep, linkFile, linkFileName, linkFileSize, linkFileSizeLimit, linkMapping,
        linkSourceHeader, linkMinFields, linkJob,
        linkCompleteResults, linkResults, linkCsvType, linkCompleted, linkValidations
    } from '../tools/stores.js';
    import { clear } from 'idb-keyval'
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
   import {
      faSpinner,
      faTrash
    } from '@fortawesome/free-solid-svg-icons';
    import Hero from './Hero.svelte';
    import LinkStep from './LinkStep.svelte';
    import LinkFile from './LinkFile.svelte';
    import LinkConfigure from './LinkConfigure.svelte';
    import LinkJob from './LinkJob.svelte';
    import LinkCheck from './LinkCheck.svelte';
    import { clearAll, useLocalSync } from '../tools/useLocalStorage.js';
    let wait = false;
    let waitMessage = '';
    const minWaitActivation = 0;
    const minWaitDeactivation = 500;

    $: if ($linkWaiter) {
            setTimeout(() => {
                if ($linkWaiter) {
                    wait = Date.now();
                    waitMessage = $linkWaiter;
                }
            }, minWaitActivation);
        } else {
            setTimeout(() => {
                if (!$linkWaiter) {
                    wait = false;
                    waitMessage = false;
                }
            }, minWaitDeactivation + Date.now() - wait);
        }

    $: if ($linkFile) {
        if ($linkFile.size <= $linkFileSizeLimit ) {
            $linkFileName = $linkFile.name ;
            $linkFileSize = $linkFile.size;
            steps[0].error = false;
            $linkStep=2;
        } else {
            steps[0].label = `${$linkFile.name }: volume > ${Math.round($linkFileSizeLimit / 1000**2)}Mo`
            steps[0].error = true
        }
    };

    $: if ($linkFileName) { steps[0].label = `${$linkFileName}<br/>${10 * Math.round($linkFileSize / 1024**2) / 10}Mo`};

    $: if (Object.keys(($linkMapping && $linkMapping.direct) ? $linkMapping.direct : {}).length >= $linkMinFields) {
        steps[1].label = `colonnes: ${Object.keys($linkMapping.direct).join(', ')}`;
    }

    $: if ($linkJob && !$linkResults) {
        $linkStep = 3;
        steps[2].label = `traitement en cours <br/> ${$linkJob}`
    };

    $: if ($linkJob === 'failed') {
        steps[2].error = true;
        steps[2].label = 'le traitement a échoué';
    }

    $: if ($linkResults) {
        $linkStep = 4;
        const s = $linkResults.header.indexOf('score');
        const sLinks = $linkResults.rows.filter(r => r[s]).length;
        steps[2].label = `${sLinks} identifications potentielles`;
        const c = $linkResults.header.indexOf('check');
        const cLinks = $linkResults.rows
            .filter((r, i) => r[s] && $linkValidations[i] && $linkValidations[i].checked).length;
        steps[3].label = `${cLinks}/${sLinks} identifications validées`;
    }

    const step0Label = `glissez un fichier ici <br/> (${Math.round($linkFileSizeLimit / 1000**2)}Mo maximum)`;
    const step1Label = "choisissez les colonnes à apparier";
    const step2Label="lancez le traitement";
    const step3Label="vérifiez les identifications";

    const steps = [
        { label: step0Label, hero: LinkFile},
        { label: step1Label, body: LinkConfigure},
        { label: step2Label, body: LinkJob },
        { label: step3Label, body: LinkCheck }
    ];

    const reset = async () => {
        await clearAll();
        $linkStep = 1;
        $linkFile = undefined;
        $linkFileName = undefined;
        $linkFileSize = undefined;
        $linkSourceHeader = undefined;
        $linkJob = undefined;
        $linkCompleteResults = undefined;
        $linkResults = undefined;
        $linkValidations = undefined;
        $linkCompleted = false;
        $linkMapping = {};
        steps[0].label = step0Label;
        steps[0].error = false;
        steps[1].label = step1Label;
        steps[1].error = false;
        steps[2].label = step2Label;
        steps[2].error = false;
        steps[3].label = step3Label;
        steps[3].error = false;
    }

    onMount(async () => {
        $linkWaiter = 'Chargement des données du navigateur';
        await useLocalSync(linkFileName, 'linkFileName');
        await useLocalSync(linkFileSize, 'linkFileSize');
        await useLocalSync(linkSourceHeader, 'linkSourceHeader');
        await useLocalSync(linkCsvType, 'linkCsvType');
        await useLocalSync(linkMapping, 'linkMapping');
        await useLocalSync(linkValidations, 'linkValidations');
        await useLocalSync(linkCompleteResults, 'linkCompleteResults');
        await useLocalSync(linkResults, 'linkResults');
        await useLocalSync(linkJob, 'linkJob');
        $linkWaiter = false;
        if (!$linkMapping || !$linkFileName || !$linkCsvType || !$linkSourceHeader || !$linkJob) {
            console.log('reset');
            reset();
        }
    })

</script>

<style>

    .body {
        max-width: 1235px;
        margin-left: auto;
        margin-right: auto;
    }

    *, ::after, ::before {
        box-sizing: inherit;
    }

        .delete {
        -moz-appearance:none;
        -webkit-appearance:none;
        background-color:rgba(10,10,10,.2);
        border:none;
        border-radius:290486px;
        cursor:pointer;
        pointer-events:auto;
        display:inline-block;
        flex-grow:0;
        flex-shrink:0;
        font-size:0;
        height:20px;
        max-height:20px;
        max-width:20px;
        min-height:20px;
        min-width:20px;
        outline:none;
        position:relative;
        vertical-align:top;
        width:20px
    }
    .delete:after,
    .delete:before {
        background-color:#fff;
        content:"";
        display:block;
        left:50%;
        position:absolute;
        top:50%;
        transform:translateX(-50%) translateY(-50%) rotate(45deg);
        transform-origin:center center
    }
    .delete:before {
        height:2px;
        width:50%
    }
    .delete:after {
        height:50%;
        width:2px
    }
    .delete:focus,
    .delete:hover {
        background-color:rgba(10,10,10,.3)
    }
    .delete.is-danger {
        background-color: #e2011c;
    }

.badge {
  position: absolute;
  left: -7px;
  top: 4.80rem;
  z-index: 900;
  background-color: #e2011c;
  -webkit-transform: rotate(-45deg) scale(1) skew(0deg) translate(10px);
  -moz-transform: rotate(-45deg) scale(1) skew(0deg) translate(10px);
  -o-transform: rotate(-45deg) scale(1) skew(0deg) translate(10px);
  -ms-transform: rotate(-45deg) scale(1) skew(0deg) translate(10px);
  transform: rotate(-45deg) scale(1) skew(0deg) translate(10px);
  text-align: center;
  color: white;
  padding: 0 .5em;
  border-top: 0px;
  line-height: 20px;
  margin: 0;
}
.badge:after {
    content: ' ';
    position: absolute;
    right: -1.23rem;
    top: 0px;
    border-right: 20px solid transparent;
    border-bottom: 20px solid #e2011c;
}
.badge:before {
    content: ' ';
    position: absolute;
    left: -1.23rem;
    top: 0px;
    border-left: 20px solid transparent;
    border-bottom: 20px solid #e2011c;
}
  .wait-center {
    text-align: center;
    transform: translateY(50%);
    height: 14rem;
    additive-symbols: 14rem;
  }

</style>
