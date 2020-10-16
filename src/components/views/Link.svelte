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
            style="position: relative;"
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
                            <div class="rf-container-fluid">
                                <div class="rf-grid-row">
                                    <div
                                        class="rf-col-12 rf-padding-1N"
                                        class:rf-hide--desktop={$linkStep > 1}
                                        class:rf-hide--mobile={$linkStep != (i+1)}
                                    >
                                        {@html step.text}
                                    </div>
                                    <div
                                        class="rf-col-12 rf-padding-1N"
                                        class:rf-hide--mobile={$linkStep != (i+1)}
                                    >
                                        {#if ((i+1) === $linkStep) && step.card}
                                            <svelte:component this={step.card} step={i+1} title={step.title} label={step.label} error={step.error}/>
                                        {:else}
                                            <LinkStep step={i+1} title={step.title} label={step.label} error={step.error}/>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        <div class="rf-padding-left-2N rf-col-xs-12 rf-col-sm-12 rf-col-md-8 rf-col-lg-8 rf-col-xl-8">
            <div class="rf-container-fluid">
                <div class="rf-grid-row">
                    {#if ($linkStep > 1)}
                        <div class="rf-col-12 rf-padding-3N rf-hide--mobile">
                            <strong>
                                étape {$linkStep}
                            </strong>
                            <br>
                            {@html steps[$linkStep-1].text}
                        </div>
                    {/if}
                    {#if steps[$linkStep-1].body}
                        <div class="rf-col-12 rf-padding-1N">
                            <svelte:component this={steps[$linkStep-1].body}/>
                        </div>
                    {/if}
                </div>
            </div>
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
    } from '@fortawesome/free-solid-svg-icons';
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
        lg: ($linkStep>1) ? 4 : 6,
        xl: ($linkStep>1) ? 3 : 6
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

    const step0Label = `glissez un fichier au format CSV ici <br/> (${Math.round($linkFileSizeLimit / 1000**2)}Mo maximum)`;
    const step1Label = 'choisissez les colonnes à apparier';
    const step2Label= 'attendez le traitement de l\'appariement';
    const step3Label= 'vérifiez les identités appariées';

    const steps = [
        { title: 'fichier',
          label: step0Label,
          card: LinkFile,
          text: `
            <p>
                L'appariement est une fonction de rapprochement vous permettant de soumettre une <strong>liste de personnes
                pour y retrouver les personnes potentiellement décédées</strong>.
            </p>
            <p>Le service est offert gratuitement pour
                assurer notamment la <strong>mise en conformité RGPD ("droit à l'oubli")</strong>. La limite du service est liée à la taille
                du fichier (100Mo, soit 1 à 2 millions d'enregistrements). Il doit permettre en quelques minutes le traitement
                de fichiers clients de quelques dizaines de milliers de lignes. Les données transmises sont chiffrées (AES-256) et effacées 1h après
                la fin du traitement.
            </p>
            <p>
                Le fichier doit être au <strong>format CSV</strong> ('enregistrer sous...'' dans votre tableur préféré) et déposé ci-dessous.
            </p>
          `
        },
        { title: 'configuration',
          label: step1Label,
          body: LinkConfigure,
          text: `
            <p>
                Ensuite, vous pouvez configurer les colonnes de rapprochement. Il est considéré
                qu'une identité est <strong>fiable</strong> à partir du moment où les quatre champs (nom, prénom, lieu et date de naissance)
                sont disponibles. Une colonne de date "décès ultérieur à" est également disponible (e.g date de dernier rendez-vous).
                Si un champ n'est pas de qualité, il est susceptible de générer du silence.
            </p>
            <p>
                N'hésitez pas à tester plusieurs configurations.
            </p>
          `
        },
        { title: 'traitement',
          label: step2Label,
          body: LinkJob,
          text: `
            <p>
                Le traitement peut nécessiter un peu de patience (quelques minutes pour plusieurs
                dizaines de milliers d'enregistrements). Nous traitons envion 50 enregistrements par seconde, il faudra donc attendre
                quelques heures pour un fichier d'un million de personnes. Vous pouvez quitter la page et revenir ultérieurement,
                les données de références sont stockées dans le navigateur, et vous permettront de retrouver vos résultats.
            </p>
          `
        },
        { title: 'validez',
          label: step3Label,
          body: LinkCheck,
          text: `
            <p>
                Dernière étape!
            </p>
            <p>
                Une application vous aide à confirmer les identités appariées,
                et vous pourrez les télécharger (étape 4). Cette étape est essentielle pour s'assurer de la
                bonne qualité des appariements.
            </p>
            <p>
                Vous pouvez néanmoins d'ores et déjà télécharger les données et les traiter dans votre tableur.
            </p>
          `
        }
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
