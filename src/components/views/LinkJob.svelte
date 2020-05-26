<div class="content">
    <div class="wrap">
        {#if !$linkJob}
            <p><strong>votre fichier est en cours de chargement {progressUpload}%</strong></p>
            <progress class="progress is-info" value={$progressBarUpload}/>
        {:else}
            <p> téléchargement terminé </p>
            <progress class="progress is-info" value={100}/>
            <p><strong> traitement en cours {Math.round(progressJob)}%
                {#if (jobPredictor && jobPredictor.end)}
                    (fin dans environ {Math.round(jobPredictor.end/1000)} secondes)
                {/if}
            </strong></p>
            <progress class="progress is-info" value={$progressBarJob}/>
        {/if}
    </div>

</div>
<script>
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
	import { sineInOut } from 'svelte/easing';
    import axios from 'axios';
    let estimator;

    import { linkMapping, linkFile, linkJob, linkStep, linkResults, updateURL, linkCsvType } from '../tools/stores.js';
    let progressUpload = 0;
    let progressJob = 0;
    let jobPredictor = null;

    const progressBarUpload = tweened(0, {
		duration: 500,
		easing: sineInOut
    });
    const progressBarJob = tweened(0, {
		duration: 500,
		easing: sineInOut
    });

    $: progressBarUpload.set(progressUpload/100);
    $: progressBarJob.set(progressJob/100);
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

    const axiosUploadConfig = {
        onUploadProgress: (progressEvent) => {
            progressUpload = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        }
    };

    const upload = async () =>  {
        progressUpload = 0;
        let formData = new FormData();
        formData.append('sep', $linkCsvType.sep);
        Object.keys($linkMapping).map(k => formData.append($linkMapping[k], k));
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
        if ($linkJob) {
            const res = await axios.get(`__BACKEND_PROXY_PATH__/search/csv/${$linkJob}`);
            if(res.status == 200){
                if (typeof(res.data) !== 'string') {
                    if (res.data.progress && res.data.progress.percentage) {
                        progressJob = res.data.progress.percentage;
                    } else {
                        progressJob = 0;
                    }
                } else {
                    progressJob = 100;
                    parseLinkResults(res.data);
                }
            }
        }
    }

    const parseLinkResults = (data) => {
        const rows = data.split(/\s*\r?\n\s*/).map(r => {
            const row = r.split($linkCsvType.sep);
            row.push('check');
            return row
        });
        const header = rows.shift();
        linkResults.update(v => {
            return {
                header: header,
                rows: rows
            };
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

    .wrap {
        max-width: 1024px;
        margin-left: auto;
        margin-right: auto;
        padding: 8px;
        text-align: center;
    }

    .progress.is-info::-moz-progress-bar {
        background-color: #003189;
    }
    .progress::-moz-progress-bar {
        background-color: #4a4a4a;
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