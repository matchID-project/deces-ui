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
    {#if steps[$linkStep-1].body}
        <svelte:component this={steps[$linkStep-1].body}/>
    {/if}
</div>

<script>
    import { onMount } from 'svelte';
    import { linkStep, linkFile, linkFileName, linkFileSizeLimit, linkMapping,
        linkSourceHeader, linkMinFields, linkJob,
        linkResults, linkCsvType
    } from '../tools/stores.js';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
   import {
      faTrash
    } from '@fortawesome/free-solid-svg-icons';
    import Hero from './Hero.svelte';
    import LinkStep from './LinkStep.svelte';
    import LinkFile from './LinkFile.svelte';
    import LinkConfigure from './LinkConfigure.svelte';
    import LinkJob from './LinkJob.svelte';
    import LinkCheck from './LinkCheck.svelte';
    import { useLocalStorage } from '../tools/useLocalStorage.js';

    $: if ($linkFile) {
        if ($linkFile.size <= $linkFileSizeLimit ) {
            $linkFileName = $linkFile.name ;
            steps[0].error = false;
            $linkStep+=1;
        } else {
            steps[0].label = `${$linkFile.name }: volume > ${Math.round($linkFileSizeLimit / 1000**2)}Mo`
            steps[0].error = true
        }
    };

    $: if ($linkFileName) { steps[0].label = $linkFileName };

    $: if (Object.keys($linkMapping).length >= $linkMinFields) {
        steps[1].label = `colonnes: ${Object.keys($linkMapping).map(k => $linkMapping[k]).join(', ')}`;
    }

    $: if ($linkJob) {
        $linkStep = 3;
        steps[2].label = `job: ${$linkJob.substring(0,8)}... en cours`
    };

    $: if ($linkResults) {
        const s = $linkResults.header.indexOf('score');
        const sLinks = $linkResults.rows.filter(r => r[s]).length;
        steps[2].label = `${sLinks} identifications potentielles`;
        const c = $linkResults.header.indexOf('check');
        const cLinks = $linkResults.rows
            .filter(r => r[s])
            .filter(r => r[c].checked).length;
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

    const reset = () => {
        $linkStep = 1;
        $linkFile = null;
        $linkFileName = null;
        $linkSourceHeader = null;
        $linkResults = null;
        $linkJob = null;
        $linkSourceHeader = null;
        $linkFileName = null;
        $linkMapping = {};
        steps[0].label = step0Label;
        steps[1].label = step1Label;
        steps[2].label = step2Label;
        steps[3].label = step3Label;
    }

    onMount(() => {
        useLocalStorage(linkFileName, 'linkFileName');
        useLocalStorage(linkSourceHeader, 'linkSourceHeader');
        useLocalStorage(linkCsvType, 'linkCsvType');
        useLocalStorage(linkMapping, 'linkMapping');
        useLocalStorage(linkJob, 'linkJob');
        useLocalStorage(linkResults, 'linkResults');
        if (!$linkMapping || !$linkFileName || !$linkCsvType || !$linkSourceHeader || !$linkJob) {
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

</style>
