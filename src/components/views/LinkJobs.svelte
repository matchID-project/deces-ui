<div class="rf-container rf-padding-top-2N">
    <div class="rf-grid-row">
        <div class="rf-col-xl-2 rf-col-lg-2 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
        </div>
        <div class="rf-col-xl-8 rf-col-lg-8 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
            <div class="rf-container-fluid">
                <div class="rf-grid-row rf-grid-row--gutters">
                    <div class="rf-col-4">
                        <StatsTile number={jobs.filter(j => j.status === 'succeeded').length} label="Nombre de traitements"/>
                    </div>
                    <div class="rf-col-4">
                        <StatsTile number={jobs.filter(j => j.status === 'succeeded').length
                            && jobs.filter(j => j.status === 'succeeded').map(j =>j.rows).reduce((a,b) => a+b)} label="Appariements"/>
                    </div>
                    <div class="rf-col-4">
                        <StatsTile number={jobs.filter(j => j.status === 'failed').length} label="Traitements en échec"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="rf-col-xl-2 rf-col-lg-2 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
        </div>
        <div class="rf-col-xl-2 rf-col-lg-2 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
        </div>
        <div class="rf-col-xl-8 rf-col-lg-8 rf-col-md-12 rf-col-sm-12 rf-col-xs-12 rf-padding-top-2N rf-text--center">
            <p>
                <strong> Liste des traitements
                </strong>
            </p>
            {#if jobs.length}
                <div style="overflow-x: auto;">
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
                                    <td>{job.date}</td>
                                    <td>{job.rows}</td>
                                    <td>{job.status}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                Aucun job
            {/if}
        </div>
        <div class="rf-col-xl-2 rf-col-lg-2 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
        </div>
    </div>
</div>
<script>
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { sineInOut } from 'svelte/easing';
    import StatsTile from './StatsTile.svelte';
    import axios from 'axios';

    import { accessToken } from '../tools/stores.js';
    let jobs = [];

    const getJobsData = async () => {
        let response = await fetch('__BACKEND_PROXY_PATH__/queue/jobs', {headers: {Authorization: `Bearer ${$accessToken}`}});
        const tmpJobs = [];
        const list = (await response.json()).jobs || [];
        list.forEach(j => {tmpJobs.push({rows: j.data.totalRows, id: j.data.randomKey, date: j.options.timestamp, status: j.status})});
        jobs = tmpJobs.sort((a,b) => (b.date - a.date)).map(j => {
            j.date=new Date(j.date).toISOString();
            return j;
        });
    }

    $: if ($accessToken) {
        getJobsData();
    }

</script>

<style>

</style>