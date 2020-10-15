<div class="rf-container-fluid">
    <div class="rf-grid-row">
        <div class="rf-col-12 rf-padding-2N rf-text--center">
            {#if !$linkWaiter}
                {#if !$linkJob}
                    <p><strong>votre fichier est en cours de chargement {progressUpload}%</strong></p>
                    <progress class="progress is-info" value={$progressBarUpload}/>
                {:else}
                    <p> téléchargement terminé </p>
                    <progress class="progress is-info" value={100}/>
                    {#if (progressDownload < 5)}
                        {#if !error}
                            {#if !waiting}
                                <p><strong> traitement en cours {Math.round(progressJob)}%
                                    {#if (jobPredictor && jobPredictor.end)}
                                        (fin dans environ {Math.round(jobPredictor.end/1000)} secondes)
                                    {/if}
                                </strong></p>
                                <progress class="progress is-info" value={$progressBarJob}/>
                            {:else}
                                <p><strong> traitement en attente
                                    {#if (queuePredictor && queuePredictor.end)}
                                        (lancement dans environ {Math.round(queuePredictor.end/1000)} secondes)
                                    {/if}
                                </strong></p>
                                <progress class="progress is-info" value={$progressBarQueue}/>
                            {/if}
                        {:else}
                            <p>
                                <strong>Le traitement a échoué</strong>
                            </p>
                            <p>
                                {error}
                            </p>
                        {/if}
                    {:else}
                        <p> traitement terminé </p>
                        <progress class="progress is-info" value={100}/>
                        <p>
                            <strong>téléchargement des résultats
                                {Math.round(Math.min(progressDownload, 100))}%
                            </strong>
                        </p>
                        <progress class="progress is-info" value={$progressBarDownload}/>
                    {/if}
                {/if}
            {/if}
        </div>
    </div>
</div>
<script>
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
	import { sineInOut } from 'svelte/easing';
    import axios from 'axios';
    import { faSpinner } from '@fortawesome/free-solid-svg-icons';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    let estimator;
    export let error=false;

    import { linkWaiter, linkMapping, linkFile, linkFileSize, linkJob, linkStep,
        linkCompleteResults, linkResults, linkCsvType, linkAutoCheckThreshold,
        linkValidations
    } from '../tools/stores.js';
    let progressUpload = 0;
    let progressJob = 0;
    let progressQueue = 0;
    let progressDownload = 0;
    const upDownRatio = 1.5;
    let queueSize = 0;
    let jobPredictor = null;
    let queuePredictor = null;
    let waiting = null;

    const progressBarUpload = tweened(0, {
		duration: 500,
		easing: sineInOut
    });
    const progressBarJob = tweened(0, {
		duration: 500,
		easing: sineInOut
    });
    const progressBarQueue = tweened(0, {
		duration: 500,
		easing: sineInOut
    });
    const progressBarDownload = tweened(0, {
		duration: 200,
		easing: sineInOut
    });

    $: progressBarUpload.set(progressUpload/100);
    $: progressBarJob.set(progressJob/100);
    $: progressQueue = queuePredictor ? Math.round(100*(queuePredictor.initialSize - queuePredictor.size)/queuePredictor.initialSize) : 0;
    $: progressBarQueue.set(progressQueue/100);
    $: progressBarDownload.set(progressDownload/100);

    $: if (progressJob) {
        let d = Date.now();
        if (jobPredictor) {
            jobPredictor.speed.push(( progressJob - jobPredictor.progress ) / (d - jobPredictor.date));
            jobPredictor.progress = progressJob;
            jobPredictor.date = d;
            jobPredictor.end = (100 - progressJob) / (jobPredictor.speed.reduce((a,b) => a+b)/jobPredictor.speed.length);
        } else {
            jobPredictor = {
                progress: progressJob,
                date: d,
                speed: []
            }
        }
    }
    $: if (queueSize) {
        let d = Date.now();
        if (queuePredictor) {
            queuePredictor.speed.push(( queuePredictor.size - queueSize) / (d - queuePredictor.date));
            queuePredictor.size = queueSize;
            queuePredictor.date = d;
            queuePredictor.end = queueSize / (queuePredictor.speed.reduce((a,b) => a+b)/queuePredictor.speed.length);
        } else {
            queuePredictor = {
                size: queueSize,
                initialSize: queueSize,
                date: d,
                speed: []
            }
        }
    }

    const axiosUploadConfig = {
        onUploadProgress: (progressEvent) => {
            progressUpload = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        }
    };

    const axiosDownloadConfig = {
        onDownloadProgress: (progressEvent) => {
            progressDownload = progressEvent.currentTarget.response.length * 100 / ($linkFileSize * upDownRatio);
        }
    };

    const upload = async () =>  {
        progressUpload = 0;
        let formData = new FormData();
        formData.append('sep', $linkCsvType.sep);
        formData.append('candidateNumber', 10);
        formData.append('dateFormat', $linkCsvType.dateFormat || 'DD/MM/YYYY');
        Object.keys($linkMapping && $linkMapping.reverse).map(k => formData.append(k,$linkMapping.reverse[k]));
        formData.append('csv', $linkFile);
        const res = await axios.post('__BACKEND_PROXY_PATH__/search/csv', formData, axiosUploadConfig);
        if(res.status == 200){
            if ((res.data.msg === "started") && res.data.id) {
                $linkJob = res.data.id;
            }
        }
    }

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const watchJob = async () =>  {
        if ($linkJob && !error) {
            try {
                const res = await axios.get(`__BACKEND_PROXY_PATH__/search/csv/${$linkJob}`, axiosDownloadConfig);
                if (typeof(res.data) !== 'string') {
                    if ((res.data.status === 'failed') || (res.data.msg === "job doesn't exists")) {
                        error = `${res.data && res.data.msg || 'erreur inconnue'}`;
                    } else {
                        if (res.data.status === 'active') {
                            waiting = null;
                            if (res.data.progress && res.data.progress.percentage) {
                                progressJob = res.data.progress.percentage;
                            } else {
                                progressJob = 0;
                            }
                        } else {
                            waiting = true;
                            queueSize = res.data.remainingRowsWaiting + res.data.remainingRowsActive;
                        }
                    }
                } else {
                    progressJob = 100;
                    parseLinkResults(res.data);
                }
            } catch(err) {
                error = `Erreur ${err}`;
            }
        }
    }

    $: if (error) {$linkJob = 'failed'}

    $: if (progressDownload >= 100) { $linkWaiter = 'Préparation de la visualisation des résultats'; }

    const protect = (sep) => {
        return sep === '|' ? '\|' : sep;
    }

    const parseLinkResults = (data) => {
        const q = $linkCsvType.quote || '"';
        const sep = $linkCsvType.sep;
        const re = new RegExp(`^(${q}(([^${q}]|${q}${q})*?)${q}|([^${protect(sep)}]*))(\\${protect(sep)}(.*))?$`);
        const re2 = new RegExp(`${q}${q}`,'g');
        const rows = [];
        let header = undefined;
        let sourceLineNumberIdx = -1;
        let currentLineNumber = 1;
        let currentLine = [];
        data.split(/\s*\r?\n\s*/).map(r => {
            const row = [];
            let i = 0;
            while(r !== undefined) {
                i += 1;
                const m = r.match(re);
                if (m) {
                    row.push(m[2] ? m[2].replace(re2, `${q}`) : m[4]);
                    r = m[6];
                } else {
                    if (r === '') {
                        row.push('');
                    }
                    r = undefined;
                }
            }
            return row;
        }).forEach(row => {
            if (!header) {
                header = row;
                sourceLineNumberIdx = header.indexOf('sourceLineNumber');
            } else {
                if (parseInt(row[sourceLineNumberIdx]) > currentLineNumber) {
                    rows.push(currentLine);
                    currentLine = [row];
                    currentLineNumber = parseInt(row[sourceLineNumberIdx]);
                } else {
                    currentLine.push(row);
                }
            }
        });
        rows.push(currentLine);
        const headerMapping = {};
        header.map((h,i) => headerMapping[h] = i);
        linkCompleteResults.update(v => {
            return {
                header: header,
                rows: rows
            };
        });
        linkResults.update(v => {
            let i = 0;
            return {
                header: [...header],
                rows: rows.filter(r => r[0][headerMapping['score']])
            }
        })
        linkValidations.update(v => {
            return $linkResults.rows.map(r => {
                return r.map(rr => (rr[headerMapping['score']] >= $linkAutoCheckThreshold) ?
                    { valid: true, checked: "auto" } : { checked: false })
            });
        });
        $linkStep = 4;
    };

    onMount(async () => {
        if (!$linkJob) {
            await upload();
        }
        progressJob = 0;
        if ($linkResults) {
            $linkStep = 4;
        } else {
            while (progressJob<100) {
                await watchJob();
                await sleep(3000);
            }
        }
    });

</script>

<style>

    .progress.is-info::-moz-progress-bar {
        background-color: var(--bf500);
    }

    .progress::-moz-progress-bar {
        background-color: var(--g500);
    }

    .progress.is-info::-webkit-progress-value {
        background-color: var(--bf500);
    }

    .progress {
        -moz-appearance: none;
        -webkit-appearance: none;
        border: none;
        border-radius: 290486px;
        display: block;
        height: 1rem;
        overflow: hidden;
        padding: 0;
        width: 100%;
    }

</style>