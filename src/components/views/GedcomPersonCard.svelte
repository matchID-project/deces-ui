{#if (record) }
    <div
        id={id}
        style="z-index: 100;"
        class="rf-text--left {expand ? "rf-col-12" : "rf-col-xs-12 rf-col-sm-12 rf-col-md-6 rf-col-lg-4 rf-col-xl-3"} rf-padding-1N rf-padding-left-2N rf-padding-right-2N"
        on:mouseenter={mouseenter}
        on:mouseleave={mouseleave}
    >
        <div class="rf-container-fluid">
            <div class="rf-grid-row">
                <div class="rf-col-12">
                    <div
                        class="rf-card rf-card--horizontal rf-card--{expand ? "md": "sm"}"
                        class:rf-card--left-arrow={expand}
                        on:click={toggleExpand}
                        class:rf-inactive={(!active)&&(!focus)}
                    >
                        <div class="rf-card__img" style="position:relative">
                            <img
                                class="{ focus ? "rf-background--bf" : (active? "rf-callout--scheme-soft-blue-soft" : "rf-background--g400") }"
                                class:match={match}
                                alt={ record.sex }
                                src={ record.sex === 'M' ? '/male.svg' : '/female.svg' }
                            />
                        </div>
                        <div
                            class="rf-card__body"
                            style={(expand) ? "padding-top: 14px!important;" : ""}
                        >
                            <a
                                href="#{id}"
                                aria-label="étendre la carte de {record.name} { record.name }"
                            >
                                <h4
                                    class="rf-card_lead rf-margin-0 {expand ? "" : "rf-text"}"
                                    style="overflow: hidden; text-overflow:ellipsis; {expand ? "" : "height: 1.5rem;"}"
                                >
                                    {record.surn || record.name || ''} { record.givn || '' }
                                </h4>
                                <p class="rf-card__desc rf-margin-0" style="display: inline;">
                                    <span class="{expand ? "" : "rf-text--xs"}">
                                        {#if (expand)}
                                            <span class="rf-hide--mobile">
                                                { record.birt && record.birt.city || '' }
                                            </span>
                                        {/if}
                                        { record.birt && record.birt.date || '' }
                                        {#if record.deat}
                                            -
                                            {#if expand}
                                                <span class="rf-hide--mobile">
                                                    { record.deat.city || '' }
                                                </span>
                                            {/if}
                                            { record.deat.date || ''}
                                        {/if}
                                    </span>
                                </p>
                            </a>
                        </div>
                    </div>
                </div>
                {#if expand}
                    <div class="rf-col-12" transition:slide|local>
                        <div class="rf-callout rf-background--white">
                            <div class="rf-container-fluid">
                                <div class="rf-grid-row">
                                    {#each Object.keys(conf) as column}
                                        <div class="rf-margin-bottom-1N rf-col-xs-12 rf-col-sm-12 rf-col-md-6 rf-col-lg-6 rf-col-xl-6">
                                            <span><strong>{ column }</strong></span>
                                            <table class="rf-table rf-table--narrow rf-table--striped">
                                                <tbody>
                                                    {#each conf[column] as field}
                                                        {#if field.value &&
                                                            (Array.isArray(field.value) ? field.value.some(x => x) : true)}
                                                            <tr>
                                                                <td>{ field.label }</td>
                                                                <td>{@html field.cb ? field.cb(field.value) : field.value }</td>
                                                            </tr>
                                                        {/if}
                                                    {/each}
                                                </tbody>
                                            </table>
                                            <div style="width:100%;text-align:center;">
                                                {#if ((column === 'Décès') && (match))}
                                                    {@html match}
                                                {/if}
                                            </div>
                                        </div>
                                    {/each}
                                        <div class="rf-col-6">
                                        {#if record.pare}
                                            <p>
                                                <strong>Parents</strong><br>
                                                {#each record.pare as parent}
                                                    <a class="rf-link" href="#{parent.id}" title={parent.surn+' '+(parent.givn || '')}>{parent.surn} {parent.givn || ''}</a>
                                                {/each}
                                            </p>
                                        {/if}
                                        {#if record.cons}
                                            <p>
                                                <strong>Conjoint{record.cons.lengh > 1 ? 's' : ''}</strong><br>
                                                {#each record.cons as cons}
                                                    <a class="rf-link" href="#{cons.id}" title={cons.surn+' '+(cons.givn || '')}>{cons.surn} {cons.givn || ''}</a>
                                                {/each}
                                            </p>
                                        {/if}
                                        {#if record.chil}
                                            <p>
                                                <strong>Enfants</strong><br>
                                                {#each record.chil as child}
                                                    <a class="rf-link" href="#{child.id}" title={child.surn+' '+(child.givn || '')}>{child.surn} {child.givn || ''}</a>
                                                {/each}
                                            </p>
                                        {/if}
                                        {#if note}
                                            <strong>Note</strong><br>
                                            {@html note}
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}


<script>
    import { slide } from 'svelte/transition';
    import { dataGouvCatalog, searchInput, activeElement } from '../tools/stores.js';
    import Icon from './Icon.svelte';

    export let record  = undefined;
    export let id = undefined;
    export let mouseenter = () => {};
    export let mouseleave = () => {};
    export let active = false;
    export let focus = false;
    let match = false;

    let linkCopied = false;

    let expand;

    window.addEventListener('hashchange', () => {
        expand = (window.location.hash.replace('#','') === id);
    }, false)

    $: if (expand) {
        window.location.hash = id;
    }

    $: if (record) {
        if (record.name) {
            if (!record.givn) {
                record.givn = typeof record.name === 'string' ? record.name.replace(/^\s*(Mr|Monsieur|Madame|Mme|M\.|Mrs)\s+/gi,'').replace(/^(.*)\/\s*(.*)\s*\/.*$/,'$1') : record.name.givn;
            }
            if (!record.surn) {
                record.surn = typeof record.name === 'string' ? record.name.replace(/^.*\/\s*(.*)\s*\/.*$/,'$1') : record.name.surn;
            }
        }
        if (record.birt && record.birt.plac && record.birt.plac.includes(',')) {
            record.birt.city = record.birt.plac.replace(/^(.*)\s*,.*/,'$1');
            record.birt.ctry  = record.birt.plac.replace(/^.*,\s*(.*)$/,'$1');
            record.birt.depc = record.birt.plac.replace(/.*,\s*(.*)\s*,\.*/,'$1');
        }
        if (record.deat && record.deat.plac && record.deat.plac.includes(',')) {
            record.deat.city = record.deat.plac.replace(/^(.*)\s*,.*/,'$1');
            record.deat.ctry  = record.deat.plac.replace(/^.*,\s*(.*)$/,'$1');
            record.deat.depc = record.deat.plac.replace(/.*,\s*(.*)\s*,\.*/,'$1');
        }

        if (record.note) {
            note = '';
            if (['number','string','boolean'].includes(typeof(record.note))) {
                note = record.note;
            } else {
                if (record.note.xxxx) { note = record.note.xxxx}
                if (record.note.cont) {
                    record.note.cont.filter(x => x).filter(x => {
                        if (/matchid/.test(x)) {
                            const id = x.replace(/.*\/(\S+).*/,'$1');
                            const score = x.replace(/.* à /,'')
                            match = `<a target="_blank" rel="noopener noreferrer" class="rf-link" href="/id/${id}">identification à ${score}</a>`;
                        }
                        return x && !match;
                    }).forEach(n => {
                        note += '<br>' + `${n}`.replace(/(http:\S+)/g,'<a target="_blank" rel="noopener noreferrer" class="rf-link" href="$1">$1</a>')
                    });
                }
            }
        }
    }

    let conf = {};
    let note = '';

    $: conf.Naissance = [
            { label: 'Nom', value: record.surn || record.name},
            { label: 'Prénom(s)', value: record.givn },
            { label: 'Sexe', value: record.sex, cb: (s) => s === 'M' ? 'masculin' : 'féminin' },
            { label: 'Date',  value: record.birt && record.birt.date || '' },
            { label: 'Commune',  value: record.birt && (record.birt.city || record.birt.plac) || ''},
            { label: 'Département',  value: record.birt && record.birt.depc || ''},
            { label: 'Pays',  value: record.birt && record.birt.ctry || ''}
        ];
    $: if (record.deat) {
        conf['Décès'] = [
            { label: 'Date',  value: record.deat.date || ''},
            { label: 'Age',  value: record.deat.age, cb: (a) => `${a} ans`},
            { label: 'Commune',  value: record.deat.city || record.deat.plac || ''},
            { label: 'Département/Région',  value: record.deat.depc || '' },
            { label: 'Pays',  value: record.deat.ctry || ''},
        ]
    } else {
        conf['Décès'] && delete conf['Décès'];
    };

    const toggleExpand = () => {
        expand = !expand;
        activeElement.update(v => {
            v && v.blur();
            return undefined;
        });
    }

</script>

<style>
 .match {
    border: solid 3px var(--bf500);
 }

</style>
