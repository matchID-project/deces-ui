{#if wait}
    <div class="rf-wait-container" style="width:100%" in:fade out:fade>
        <div class="rf-wait-content">
            <strong>{waitMessage || ''}</strong>
            <br/>
            <FontAwesomeIcon icon={faSpinner} class="is-48 spin"/>
        </div>
    </div>
{/if}
<div class="rf-container-fluid rf-padding-right-1N" style="position: relative">
    <div class="rf-badge">
        beta
    </div>
    <div class="rf-grid-row">
        {#if ($linkStep <= 1)}
            <div class="rf-col-3"></div>
        {/if}
        <div
            class="rf-padding-left-2N--desktop rf-padding-left-1N--mobile rf-padding-right-1N--mobile rf-padding-top-2N rf-col-xs-12 rf-col-sm-12 rf-col-md-{size.md} rf-col-lg-{size.lg} rf-col-xl-{size.xl} {margin}"
            style="position: relative"
        >
            <strong>
                appariement
            </strong>
            {#if ($linkStep > 1)}
                <div style="position: absolute;top: 12px;right: 0px;">
                    <span
                        title="réinitialiser le traitement"
                        on:click|preventDefault={reset}
                        class="rf-color--rm rf-fi-delete-line rf-fi--lg"
                    >
                    </span>
                </div>
            {/if}
            <div class="rf-container-fluid">
                <div class="rf-grid-row">
                    {#each steps as step, i}
                        <div class="rf-col-12 rf-padding-1N">
                            {#if ((i+1) === $linkStep) && step.hero}
                                <svelte:component this={step.hero} step={i+1} title={step.title} label={step.label} error={step.error}/>
                            {:else}
                                <LinkStep step={i+1} title={step.title} label={step.label} error={step.error}/>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        <div class="rf-padding-left-2N rf-col-xs-12 rf-col-sm-12 rf-col-md-8 rf-col-lg-9 rf-col-xl-9">
            {#if steps[$linkStep-1].body}
                <svelte:component this={steps[$linkStep-1].body}/>
            {/if}
        </div>
    </div>
</div>

<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
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

    $: size = {
        md: ($linkStep>1) ? 4 : 6,
        lg: ($linkStep>1) ? 3 : 6,
        xl: ($linkStep>1) ? 2 : 6
    };

    $: margin = ($linkStep>1) ? "" : "rf-margin-top-6N";


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
            steps[0].label = `${$linkFile.name }: volume > ${Math.round($linkFileSizeLimit / 1000**2)}Mo<br>
                                réessayez avec un fichier plus petit`
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
        const sLinks = $linkResults.rows.filter(r => r.some(rr => rr[s])).length;
        steps[2].label = `${sLinks} identifications potentielles`;
        const c = $linkResults.header.indexOf('check');
        const cLinks = $linkValidations.filter(r => r.every(rr => rr && rr.checked)).length;
        steps[3].label = `${cLinks}/${sLinks} identifications validées`;
    }

    const step0Label = `glissez un fichier ici <br/> (${Math.round($linkFileSizeLimit / 1000**2)}Mo maximum)`;
    const step1Label = 'choisissez les colonnes à apparier';
    const step2Label= 'attendez le traitement de l\'appariement';
    const step3Label= 'vérifiez les identités appariées';

    const steps = [
        { title: 'fichier', label: step0Label, hero: LinkFile},
        { title: 'configuration', label: step1Label, body: LinkConfigure},
        { title: 'traitement', label: step2Label, body: LinkJob },
        { title: 'validez', label: step3Label, body: LinkCheck }
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
</style>
