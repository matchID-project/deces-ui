{#if $user && ready}
    <div class="rf-container rf-padding-top-2N">
        <div class="rf-grid-row">
            <div class="rf-col-xl-2 rf-col-lg-2 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
            </div>
            <div class="rf-col-xl-8 rf-col-lg-8 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
                <div class="rf-container-fluid">
                    <div class="rf-grid-row rf-grid-row--gutters">
                        <div class="rf-col-4">
                            <StatsTile number={Object.keys(edits).length} label="Contributions{$admin ? ' usagers' : ''}"/>
                        </div>
                        <div class="rf-col-4">
                            <StatsTile number={Object.keys(edits).filter(id => edits[id].some(m => m.auth === 0)).length} label="Contributions en attente"/>
                        </div>
                        <div class="rf-col-4">
                            <StatsTile number={Object.keys(edits).filter(id => edits[id].some(m => m.auth > 0)).length} label="Contributions validées"/>
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
                    <strong> Liste des éditions
                    </strong>
                </p>
                {#if Object.keys(edits).length}
                    <div style="overflow-x: auto;">
                        <table class="rf-table rf-table--narrow rf-table--striped">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    {#if $admin}
                                        <th>auteur</th>
                                    {/if}
                                    <th>date</th>
                                    <th>statut</th>
                                    <th>nb éditions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each Object.keys(edits).sort((b,a) =>
                                    edits[a][edits[a].length - 1].date.localeCompare(edits[b][edits[b].length - 1].date)
                                ) as id}
                                    <tr>
                                        <td>
                                            <a
                                                href="/id/{id.replace(/_/g,'%5F')}"
                                                target="_self"
                                                class="rf-link"
                                            >
                                                {id}
                                            </a>
                                        </td>
                                        {#if $admin}
                                            <td>{edits[id][edits[id].length - 1].author}</td>
                                        {/if}
                                        <td>{edits[id][edits[id].length - 1].date.substring(0,10)}</td>
                                        <td>
                                            {#if (edits[id].filter(m => m.auth === 0).length)}
                                                <Icon icon="ri:time-line" class="rf-color--rm"/>
                                            {/if}
                                            {#if (edits[id].filter(m => m.auth > 0).length)}
                                                <Icon icon="ri:check-line" class="rf-color--bf"/>
                                            {/if}
                                            {#if (edits[id].filter(m => m.auth < 0).length)}
                                                <Icon icon="ri:close-line" class="rf-color--rm"/>
                                            {/if}
                                        </td>
                                        <td>{edits[id].length}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {:else}
                    Aucune donnée
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
    import Icon from './Icon.svelte';
    import StatsTile from './StatsTile.svelte';
    import axios from 'axios';
    let ready = false;

    import { admin, user, accessToken } from '../tools/stores.js';

    let edits = {};

    const getEditsData = async () => {
        let response = await fetch('__BACKEND_PROXY_PATH__/updated', {headers: {Authorization: `Bearer ${$accessToken}`}});
        edits = await response.json();
        ready = true;
    }

    $: if ($user) {
        getEditsData();
    };

</script>

<style>
    td {
        vertical-align: middle;
    }
</style>