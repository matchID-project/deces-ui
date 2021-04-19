{#if $user && ready}
    <div class="rf-container rf-padding-top-2N">
        <div class="rf-grid-row">
            <div class="rf-col-xl-2 rf-col-lg-2 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
            </div>
            <div class="rf-col-xl-8 rf-col-lg-8 rf-col-md-12 rf-col-sm-12 rf-col-xs-12">
                <div class="rf-container-fluid">
                    <div class="rf-grid-row rf-grid-row--gutters">
                        <div class="rf-col-4">
                            <StatsTile number={edits.length} label="Contributions{$admin ? ' usagers' : ''}"/>
                        </div>
                        <div class="rf-col-4">
                            <StatsTile number={edits.filter(e => e.modifications.some(m => m.auth === 0)).length} label="Contributions en attente"/>
                        </div>
                        <div class="rf-col-4">
                            <StatsTile number={edits.filter(e => e.modifications.some(m => m.auth > 0)).length} label="Contributions validées"/>
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
                {#if edits.length}
                    <div style="overflow-x: auto;">
                        <table class="rf-table rf-table--narrow rf-table--striped">
                            <thead>
                                <tr>
                                    <th>enregistrement</th>
                                    {#if $admin}
                                        <th>auteur</th>
                                    {/if}
                                    <th>date</th>
                                    <th>statut</th>
                                    <th>nb éditions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each edits.sort((b,a) =>
                                    a.modifications[a.modifications.length - 1].date.localeCompare(
                                        b.modifications[b.modifications.length - 1].date)
                                ) as edit}
                                    <tr>
                                        <td>
                                            <a
                                                href="/id/{edit.id}"
                                                target="_self"
                                                class="rf-link"
                                            >
                                                {edit.name.last.toUpperCase()} { edit.name.first ? edit.name.first[0] : '' }
                                            </a>
                                        </td>
                                        {#if $admin}
                                            <td>{edit.modifications[edit.modifications.length - 1].author}</td>
                                        {/if}
                                        <td>{edit.modifications[edit.modifications.length - 1].date.substring(0,10)}</td>
                                        <td>
                                            {#if (edit.modifications.filter(m => m.auth === 0).length)}
                                                <Icon icon="ri:time-line" class="rf-color--rm"/>
                                            {/if}
                                            {#if (edit.modifications.filter(m => m.auth > 0).length)}
                                                <Icon icon="ri:check-line" class="rf-color--bf"/>
                                            {/if}
                                            {#if (edit.modifications.filter(m => m.auth < 0).length)}
                                                <Icon icon="ri:close-line" class="rf-color--rm"/>
                                            {/if}
                                        </td>
                                        <td>{edit.modifications.length}</td>
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