{#if wait}
    <div class="rf-wait-container" style="width:100%" in:fade out:fade>
        <div class="rf-wait-content">
            <strong>{waitMessage || ''}</strong>
            <br/>
            <Icon icon="ri:loader-line" class="rf-fi--xxl rf-margin-top-1N" spin center/>
        </div>
    </div>
{/if}
<div class="rf-container-fluid rf-padding-right-1N" style="position: relative">
    <div class="rf-badge">
        Bêta
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
                Appariement
            </strong>
            {#if ($linkStep > 1)}
                <div
                    style="position: absolute;top: 12px;right: 0px;"
                    on:click|preventDefault={reset}
                >
                    <Icon
                        href="#reset"
                        title="réinitialiser le traitement"
                        label="réinitialiser le traitement"
                        icon="ri:delete-bin-line"
                        class="rf-color--rm rf-fi--lg"
                    />
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
                                Étape {$linkStep}
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
        linkSourceHeader, linkMinFields, linkJob, linkSourceHeaderTypes,
        linkCompleteResults, linkResults, linkCsvType, linkCompleted, linkValidations
    } from '../tools/stores.js';
    import { clear } from 'idb-keyval'
    import Icon from './Icon.svelte';
    import LinkStep from './LinkStep.svelte';
    import LinkFile from './LinkFile.svelte';
    import LinkConfigure from './LinkConfigure.svelte';
    import LinkJob from './LinkJob.svelte';

    let LinkCheck;
    import('./LinkCheck.svelte').then(module => {
        LinkCheck = module.default;
    });

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
            $linkStep = 2;
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

    const step0Label = `Glissez un fichier au format CSV ici <br/> (${Math.round($linkFileSizeLimit / 1000**2)}Mo maximum)`;
    const step1Label = 'Choisissez les colonnes à apparier';
    const step2Label= 'Attendez le traitement de l\'appariement';
    const step3Label= 'Vérifiez les identités appariées';

    const steps = [
        { title: 'Fichier',
          label: step0Label,
          card: LinkFile,
          text: `
            <p>
                L'appariement est une fonction de rapprochement vous permettant de soumettre une <strong>liste de personnes
                pour y retrouver d' éventuels décès</strong>.
            </p>
            <p>Le service est offert gratuitement pour
                assurer notamment la <strong>mise en conformité RGPD </strong>("droit à l'oubli"). La limite du service est liée à la taille
                du fichier (100Mo, soit 1 à 2 millions d'enregistrements). Il doit permettre en quelques minutes le traitement
                de fichiers clients de quelques dizaines de milliers de lignes. Les données transmises sont chiffrées (AES-256) et effacées 1h après
                la fin du traitement.
            </p>
            <p>
                Le fichier doit être au <strong>format CSV</strong> ('enregistrer sous...' dans votre tableur préféré) et déposé ci-dessous.
            </p>
          `
        },
        { title: 'Configuration',
          label: step1Label,
          body: LinkConfigure,
          text: `
            <p>
                Ensuite, vous pouvez configurer les colonnes à rapprocher pour assurer l'appariement. Il est considéré
                qu'une identité est <strong>fiable</strong> à partir du moment où les quatre champs sont disponibles: <strong>nom, prénom, lieu et date de naissance.</strong>
                Une colonne de date "décès ultérieur à" est également à votre disposition (par exemple, à rapprocher avec une date de dernier rendez-vous).
            </p>
            <p>
                Attention: si un champ n'est pas de qualité, il est susceptible de générer du silence. N'hésitez pas à tester plusieurs configurations.
            </p>
          `
        },
        { title: 'Traitement',
          label: step2Label,
          body: LinkJob,
          text: `
            <p>
                C'est peut-être le temps d'une pause ?
            </p>
            <p>
                Le traitement peut nécessiter un peu de <strong>patience</strong> (quelques minutes pour plusieurs
                dizaines de milliers d'enregistrements). Nous traitons envion 50 enregistrements par seconde, il faudra donc attendre
                quelques heures pour un fichier d'un million de personnes. Le temps d'attente est estimé automatiquement.
            </p>
            <p>
                Vous pouvez quitter la page et <strong>revenir ultérieurement</strong>,
                les données de références sont enregistrées dans le navigateur, et vous permettront de retrouver vos résultats. Attention
                néanmoins, ceux-ci sont effacés au bout d'une heure si vous n'avez pas consulté la page.
            </p>
          `
        },
        { title: 'Validez',
          label: step3Label,
          body: LinkCheck,
          text: `
            <p>
                <strong>Dernière étape!</strong>
            </p>
            <p>
                Une application vous aide à <strong>valider</strong> les identités appariées.
                Cette étape est essentielle pour s'assurer de la
                bonne qualité du traitement.
            </p>
            <p>
                Vous pouvez néanmoins d'ores et déjà télécharger les données et les traiter dans votre tableur.
            </p>
            <p>
                Si les résultats sont effacés du serveur au bout d'une heure, ils restent enregistrés sur
                votre navigateur, tant que vous n'avez pas cliqué sur l'icône <span class="rf-fi-delete-line"></span>
            </p>
          `
        }
    ];

    $: steps[3].body = LinkCheck;

    const reset = async () => {
        await clearAll();
        steps[0].label = step0Label;
        steps[0].error = false;
        steps[1].label = step1Label;
        steps[1].error = false;
        steps[2].label = step2Label;
        steps[2].error = false;
        steps[3].label = step3Label;
        steps[3].error = false;
        $linkStep = 1;
        $linkFile = undefined;
        $linkFileName = undefined;
        $linkFileSize = undefined;
        $linkCsvType = undefined;
        $linkSourceHeader = undefined;
        $linkSourceHeaderTypes = undefined;
        $linkJob = undefined;
        $linkCompleteResults = undefined;
        $linkResults = undefined;
        $linkValidations = undefined;
        $linkCompleted = false;
        $linkMapping = {};
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
