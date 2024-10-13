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
                                {@html error}
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
    let estimator;
    export let error=false;

    import { accessToken, linkWaiter, linkMapping, linkFile, linkFileSize, linkJob, linkStep,
        linkCompleteResults, linkResults, linkOptions, linkFileName, linkSourceHeader,
        linkValidations, themeDnum
    } from '../tools/stores.js';
    import { validColumns, getJobData } from '../tools/jobs.js';
    let progressUpload = 0;
    let progressJob = 0;
    let progressQueue = 0;
    let progressDownload = 0;
    const upDownRatio = 1.5;
    let queueSize = 0;
    let jobPredictor = null;
    let queuePredictor = null;
    let waiting = null;

    let mailTo

    $: mailTo = $themeDnum ?
    `<a href="mailto:datalab@interieur.gouv.fr">datalab@interieur.gouv.fr</a>`
    : `<a href="mailto:__API_EMAIL__">__API_EMAIL__</a>`;


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

    $: axiosUploadConfig.headers = { Authorization: `Bearer ${$accessToken}` }

    const headers = {};

    const axiosDownloadConfig = {
        onDownloadProgress: (progressEvent) => {
            progressDownload = progressEvent && progressEvent.currentTarget && progressEvent.currentTarget.response && progressEvent.currentTarget.response.length ? progressEvent.currentTarget.response.length * 100 / (($linkFileSize || 1000) * upDownRatio) : 0;
        },
        headers: headers
    };

    $: headers.Authorization = `Bearer ${$accessToken}`;

    const upload = async () =>  {
        progressUpload = 0;
        let formData = new FormData();
        formData.append('sep', $linkOptions.csv.sep);
        formData.append('encoding', $linkOptions.csv.encoding);
        formData.append('skipLines', $linkOptions.csv.skipLines);
        formData.append('candidateNumber', $linkOptions.api.candidateNumber);
        formData.append('pruneScore', $linkOptions.api.pruneScore);
        formData.append('dateFormat', $linkOptions.csv.dateFormat || 'dd/MM/yyyy');
        formData.append('tmpfilePersistence', $linkOptions.csv.tmpfilePersistence);
        Object.keys($linkMapping && $linkMapping.reverse).map(k => formData.append(k,$linkMapping.reverse[k]));
        if ($linkOptions.csv.type === 'gedcom') {
            formData.append('csv', new Blob([$linkOptions.csv.csv], {type: 'text/csv;charset=utf-8;'}));
        } else {
            formData.append('csv', $linkFile);
        }
        try {
            const res = await axios.post('__BACKEND_PROXY_PATH__/search/csv', formData, axiosUploadConfig);
            if(res.status == 200){
                if ((res.data.msg === "started") && res.data.id) {
                    $linkJob = res.data.id;
                }
            }
        } catch(err) {
            error = formatError(err);
        }
    }

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const watchJob = async () =>  {
        let res;
        if ($linkJob && $linkJob !== 'failed' && !error) {
            let res;
            try {
                res = await axios.get(`__BACKEND_PROXY_PATH__/search/csv/${$linkJob}`, axiosDownloadConfig);
            } catch(err) {;
                error = formatError(err);
            }
            if (res &&typeof(res.data) !== 'string') {
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
                    } else if (res.data.msg === 'Job succeeded but results expired') {
                        error = 'Les résultats ont expiré, merci de relancer le traitement';
                    } else {
                        waiting = true;
                        queueSize = res.data.remainingRowsWaiting + res.data.remainingRowsActive;
                    }
                }
            } else if (res) {
                progressJob = 100;
                if (!$linkMapping || !$linkFileName || !$linkOptions.csv || !$linkSourceHeader) {
                    const job = await getJobData($accessToken,$linkJob); //.filter(j => j.id === $linkJob)[0];
                    console.log('Restore job metadata from server');
                    $linkFileName = `${job.id}.csv`;
                    $linkOptions.csv = {};
                    $linkOptions.csv.sep = job.data && job.data.sep ;
                    $linkOptions.csv.encoding = job.data.encoding;
                    $linkOptions.csv.skipLines = Number(job.data.skipLines || "0");
                    $linkOptions.csv.candidateNumber = Number(job.data.candidateNumber || "10");
                    $linkOptions.csv.pruneScore = job.data.pruneScore;
                    $linkOptions.csv.dateFormat = job.data.dateFormat;
                    $linkOptions.csv.tmpfilePersistence = job.data && job.data.tmpfilePersistence;
                    $linkOptions.type = "csv";
                    $linkSourceHeader = validColumns.map(k => job.data && job.data[k]).filter(k => k);
                    $linkMapping = { direct: {}, reverse: {} };
                    validColumns.forEach(col => {
                        if (job.data && job.data[col]) {
                            $linkMapping.reverse[col] = job.data[col];
                            $linkMapping.direct[job.data[col]] = col;
                        }
                    });
                }
                parseLinkResults(res.data);
            }
        }
    };

    $: if (error) {
        console.log('Error in job', error);
        $linkJob = 'failed'
    }

    $: if (progressDownload >= 100) { $linkWaiter = 'Préparation de la visualisation des résultats'; }

    const protect = (sep) => {
        return sep === '|' ? '\|' : sep;
    }

    const formatError = (err) => {
        let error;
        if (err.response) {
            error = `Erreur ${err.response.status}`;
            if (err.response.data && err.response.data.msg) {
                if (/column header mismatch/.test(err.response.data.msg)) {
                    error += `<br>le nombre de colonnes n'est pas conforme à l'entête CSV`;
                } else {
                    error = error + '<br>' + JSON.stringify(err.response.data.msg);
                }
            } else {
                if (err.response.status === 400) {
                    error += `<br>problème dans le format des données, merci de nous contacter à ${mailTo}`
                } else if (err.response.status === 502) {
                    error += `<br>le serveur est indisponible, veuiller réessayer ultérieurement ou nous contacter à ${mailTo}`
                } else if (err.response.status === 500) {
                    error += `<br>le fichier a provoqué une erreur serveur, merci de nous contacter à ${mailTo}`
                } else {
                    error += `<br>erreur inconnue, merci de nous contacter à ${mailTo}`
                }
            }
        } else {
            error = `${err}`;
        }
        return error;
    }

    const parseLinkResults = (data) => {
        const q = $linkOptions.csv.quote || '"';
        const sep = $linkOptions.csv.sep;
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
