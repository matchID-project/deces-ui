<div class="rf-container">
    <div class="rf-grid-row">
        <div class="rf-col-12 rf-padding-2N rf-text--center">
            <p>
                <strong> Liste des traitements
                </strong>
            </p>
            {#if jobs.length}
                <table class="rf-table rf-table--narrow rf-table--striped">
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>date</th>
                            <th>lignes</th>
                            <th>statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each jobs as job}
                            <tr>
                                <td>{job.id.substring(0,20) + '...'}</td>
                                <td>{job.date.toISOString()}</td>
                                <td>{job.rows}</td>
                                <td>{job.status}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {:else}
                Aucun job
            {/if}
        </div>
    </div>
</div>
<script>
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
	import { sineInOut } from 'svelte/easing';
    import axios from 'axios';

    import { accessToken } from '../tools/stores.js';
    let jobs = [];

    const getJobsData = async () => {
        let response = await fetch('__BACKEND_PROXY_PATH__/queue/jobs', {headers: {Authorization: `Bearer ${$accessToken}`}});
        const types = Object.keys(await response.json());
        const tmpJobs = [];
        await Promise.all(types.map(async (type) => {
            response = await fetch(`__BACKEND_PROXY_PATH__/queue/jobs/${type}`, {headers: {Authorization: `Bearer ${$accessToken}`}});
            const list = (await response.json()).jobs || [];
            list.forEach(j => {tmpJobs.push({rows: j.data.totalRows, id: j.data.randomKey, date: new Date(j.options.timestamp), status: j.status})});
        }));
        jobs = tmpJobs.sort((a,b) => (a.date >= b.date));
    }

    $: if ($accessToken) {
        getJobsData();
    }

</script>

<style>

</style>