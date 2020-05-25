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
                        <svelte:component this={step.hero} step={i+1} label={step.label}/>
                    {:else}
                        <LinkStep step={i+1} label={step.label}/>
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
    import { linkStep, linkFile, linkFileName, linkMapping,
        linkSourceHeader, linkMinFields, linkJob,
        linkResults
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

    $: if ($linkFile) { $linkFileName = $linkFile.name ; };

    $: if ($linkFileName) { steps[0].label = $linkFileName };

    $: if (Object.keys($linkMapping).length >= $linkMinFields) {
        steps[1].label = `colonnes: ${Object.keys($linkMapping).map(k => $linkMapping[k]).join(', ')}`;
    }

    $: if ($linkJob) {
        $linkStep = 3;
        steps[2].label = `job: ${$linkJob} en cours`
    };

    $: if ($linkResults) {
        const s = $linkResults.header.indexOf('score');
        const sLinks = $linkResults.rows.filter(r => r[s]).length;
        steps[2].label = `${sLinks} identifications potentielles`;
        const c = $linkResults.header.indexOf('check');
        const cLinks = $linkResults.rows
            .filter(r => r[s])
            .filter(r => r[c] !== 'check').length;
        steps[3].label = `${cLinks}/${sLinks} identifications validées`;
    }

    const steps = [
        { label: "glissez un fichier ici", hero: LinkFile},
        { label: "choisissez les colonnes à apparier", body: LinkConfigure},
        { label: "lancez le traitement", body: LinkJob },
        { label: "vérifiez les identifications", body: LinkCheck }
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
        steps[0].label="glissez un fichier ici";
        steps[1].label="choisissez les colonnes à apparier";
        steps[2].label="lancez le traitement";
        steps[3].label="vérifiez les identifications";
    }

    onMount(() => {
        useLocalStorage(linkFileName, 'linkFileName');
        useLocalStorage(linkSourceHeader, 'linkSourceHeader');
        useLocalStorage(linkMapping, 'linkMapping');
        useLocalStorage(linkJob, 'linkJob');
        useLocalStorage(linkResults, 'linkResults');
        if (!$linkMapping || !$linkFileName || !$linkSourceHeader || !$linkJob) {
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
</style>
