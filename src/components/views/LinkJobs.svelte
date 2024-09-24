{#if ready}
    <div class="rf-container rf-padding-top-2N">
        <div class="rf-grid-row">
            <div class="rf-col-xl-2 rf-col-lg-2 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
            </div>
            <div class="rf-col-xl-8 rf-col-lg-8 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
                <div class="rf-container-fluid">
                    <div class="rf-grid-row rf-grid-row--gutters">
                        <div class="rf-col-xl-3 rf-col-lg-3 rf-col-md-3 rf-col-sm-3 rf-col-xs-6">
                            <StatsTile
                                number={jobs.filter(j => j.status === 'completed').length}
                                label="Traitements"/>
                        </div>
                        <div class="rf-col-xl-3 rf-col-lg-3 rf-col-md-3 rf-col-sm-3 rf-col-xs-6">
                            <StatsTile
                                number={
                                    jobs.filter(j => j.status === 'completed').length &&
                                    jobs.filter(j => j.status === 'completed').map(j =>j.rows).reduce((a,b) => a+b)
                                }
                                label="Appariements"/>
                        </div>
                        <div class="rf-col-xl-3 rf-col-lg-3 rf-col-md-3 rf-col-sm-3 rf-col-xs-6">
                            <StatsTile
                                number={jobs.filter(j => j.status === 'failed').length}
                                label="Échecs"/>
                        </div>
                        <div class="rf-col-xl-3 rf-col-lg-3 rf-col-md-3 rf-col-sm-3 rf-col-xs-6">
                            <StatsTile
                                number={
                                    jobs.filter(j => j.status === 'completed').length &&
                                    Math.floor(
                                        jobs.filter(j => j.status === 'completed').map(j =>j.rows).reduce((a,b) => a+b)
                                        /
                                        jobs.filter(j => j.status === 'completed').map(j =>j.processing_time).reduce((a,b) => a+b)
                                    )
                                }
                                label="Lignes / Seconde"/>
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
                                    <th>creation date</th>
                                    <th>deletion date</th>
                                    <th>id</th>
                                    <th>statut</th>
                                    <th>lignes</th>
                                    <th>colonnes</th>
                                    <th>velocité (l/s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each jobs as job, idx}
                                    <tr>
                                        <td>{job.date}</td>
                                        <td>{job.deletionTime}</td>
                                        <td>{job.user || job.id.substring(0,10) + '...'}</td>
                                        <td>
                                            <div style="display: flex;align-items:center">
                                                {#if job.status == 'active'}
                                                    {job.progress}%
                                                    <span
                                                        title="arrêter"
                                                        on:click|preventDefault={() => deleteJob(job, idx)}
                                                        on:keypress|preventDefault={() => deleteJob(job, idx)}
                                                    >
                                                        <Icon icon="ri:delete-bin-line" class="rf-color--rm"/>
                                                    </span>
                                                {:else}
                                                    {statusLabel[job.status] || job.status}
                                                {/if}
                                            </div>
                                        </td>
                                        <td>{job.rows}</td>
                                        <td>
                                            {#if job.columns && job.columns.length}
                                                {job.columns.length}
                                            {/if}
                                            </td>
                                        <td>
                                            {#if job.processing_rate}
                                                {job.processing_rate}
                                            {:else}
                                                N/A
                                            {/if}
                                        </td>
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
{/if}
<script>
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { sineInOut } from 'svelte/easing';
    import StatsTile from './StatsTile.svelte';
    import axios from 'axios';
    import Icon from './Icon.svelte';

    import { accessToken } from '../tools/stores.js';
    let jobs = [];
    let ready = false;
    let headers;

    $: {
      headers = {
        headers: {
            Authorization: `Bearer ${$accessToken}`
        }
      }
      getJobsData()
    }

    const statusLabel = {
        completed: 'succès',
        failed: 'échec',
        cancelled: 'interrompu',
        created: 'en cours'
    }

    const validColumns = [
        'lastName',
        'legalName',
        'sex',
        'birthDate',
        'birthCity',
        'birthDepartment',
        'birthCountry',
        'deathDate',
        'deathCity',
        'deathDepartment',
        'deathCountry',
        'lastSeenAliveDate'
    ];

    const dateTostr = (_date) => {
       return `${_date.getFullYear()}-${_date.getMonth() + 1}-${_date.getDate()} ${(_date.getHours() < 10 ? '0' : '') + _date.getHours()}:${ (_date.getMinutes() < 10 ? '0' : '') + _date.getMinutes()}`;
    }

    const getJobsData = async () => {
        let response = await fetch('__BACKEND_PROXY_PATH__/queue/jobs', headers);
        const tmpJobs = [];
        const list = (await response.json()).jobs || [];
        list.forEach(j => {
            const delay = (
                (j.finishedOn ? j.finishedOn : Math.floor(Date.now()))
                - j.processedOn
            ) / 1000;
            const progress = j.status && j.status === "completed" ?
                "100" : j.progress && j.progress.percentage ?
                    Math.round(j.progress.percentage) : 0
            tmpJobs.push({
                rows: j.data.totalRows,
                id: j.id,
                user: j.data && j.data.user,
                date: j.timestamp,
                status: j.status,
                waiting_time: j.processedOn && (j.processedOn - j.timestamp) / 1000,
                processing_time: delay,
                columns: validColumns.filter(c => j.data && j.data[c]),
                processing_rate: j.processedOn && Math.floor((progress / 100) * (j.data.totalRows / delay)),
                deletionTime: dateTostr(new Date(j.processedOn + (j.data.tmpfilePersistence))),
                progress: progress
            })});
        jobs = tmpJobs.sort((a,b) => (b.date - a.date)).map(j => {
            j.date= dateTostr(new Date(j.date));
            return j;
        });
        ready = true;
    }



    const deleteJob = async (job, idx) => {
      const res = await axios.delete(`__BACKEND_PROXY_PATH__/search/csv/${job.id}`, headers)
      if (res.data && res.data.msg.includes('cancelled')) {
        jobs[idx].status = 'arrêté'
      }
    }


</script>

<style>

</style>
