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
                        <table class="rf-table" style="text-align:left;">
                            <col style="width:30px"/>
                            <col style="width:120px"/>
                            {#if $admin}
                                <col style="width:80px"/>
                                <col style="width:80px"/>
                            {/if}

                            <thead>
                                <tr>
                                    <th>statut</th>
                                    <th>date</th>
                                    {#if $admin}
                                        <th>auteur</th>""
                                        <th>nb éditions</th>
                                    {/if}
                                    <th>enregistrement</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each edits.sort((b,a) =>
                                    a.modifications[a.modifications.length - 1].date.localeCompare(
                                        b.modifications[b.modifications.length - 1].date)
                                ) as edit, i}
                                    <tr>
                                        {#if (currentEdit !== edit.id)}
                                            <td in:fly="{{ x: -200, delay: 400 }}">
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
                                            <td in:fly="{{ x: -200, delay: 400 }}">
                                                {edit.modifications[edit.modifications.length - 1].date.substring(0,10)}
                                            </td>
                                            {#if $admin}
                                                <td in:fly="{{ x: -200, delay: 400 }}">
                                                    {edit.modifications[edit.modifications.length - 1].author}
                                                </td>
                                                <td in:fly="{{ x: -200, delay: 400 }}">
                                                    {edit.modifications.length}
                                                </td>
                                            {/if}
                                        {/if}
                                        <td colspan={(currentEdit === edit.id) ? ($admin ? "5" : "4") : "1"}>
                                            <div class="rf-container-fluid">
                                                <div
                                                    class="rf-grid-row"
                                                    id={edit.id}
                                                >
                                                    <ResultCard
                                                        result={edit}
                                                        index={edit.id}
                                                        onclick={() => { toggleEdit(edit.id) }}
                                                        forceExpand={currentEdit === edit.id}
                                                        nomargin
                                                        fullwidth
                                                    />
                                                </div>
                                            </div>
                                        </td>
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
    import { fly } from 'svelte/transition';
    import * as animateScroll from 'svelte-scrollto';
    import ResultCard from './ResultCard.svelte';
    import Icon from './Icon.svelte';
    import StatsTile from './StatsTile.svelte';
    import axios from 'axios';
    let ready = false;
    let currentEdit;

    import { admin, user, accessToken, route } from '../tools/stores.js';

    let edits = {};

    $: console.log(currentEdit);

    const getEditsData = async () => {
        let response = await fetch('__BACKEND_PROXY_PATH__/updated', {headers: {Authorization: `Bearer ${$accessToken}`}});
        edits = await response.json();
        ready = true;
        edits.forEach(e => {
            if (`#${e.id}` === $route.hash) {
                toggleEdit(e.id);
            }
        });
    }

    const toggleEdit = (id) => {
        if (currentEdit === id) {
            currentEdit = undefined;
            if (history) {
                history.pushState(null, null, window.location.href.split('#')[0]);
            } else {
                location.hash='';
            }
            $route.hash = undefined;
        }
        else {
            currentEdit = id;
            location.hash = id;
            $route.hash = location.hash;
            setTimeout(() => {
                animateScroll.scrollTo({element: `#${id}`, delay: 400});
            }, 400);
        };
    };


    $: if ($user) {
        getEditsData();
    };

</script>

<style>
    td {
        vertical-align: middle;
    }
</style>