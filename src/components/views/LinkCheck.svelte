{#if $linkResults}
    <div class="check-body content">
        <p>
            {#if (scoredLinks && (scoredLinks === checkedLinks))}
                <span class="has-text-danger">
                    <FontAwesomeIcon icon={faArrowAltCircleRight} class="is-24 is-low"/>
                    &nbsp;
                </span>
            {/if}
            <button
                class="button is-info"
                on:click={download}
            >
                téléchargez le résultat
            </button>
            {#if (scoredLinks && (scoredLinks === checkedLinks))}
                <span class="has-text-danger">
                    &nbsp;
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} class="is-24 is-low"/>
                </span>
            {/if}
        </p>

        {#if (scoredLinks !== checkedLinks)}
            <p> {scoredLinks - checkedLinks} identité(s) à valider :</p>
            <LinkCheckTable filter={filterUnchecked} bind:rowSelect={rowSelect} sort={'scoreDesc'} master=true/>
        {/if}

        {#if checkedLinks}
            {#if (scoredLinks === checkedLinks)}
                <p>
                    toutes les identé(s) ({checkedLinks}) ont été validées* !
                    <br/>
                    <span class="is-size-7">* validation automatique pour les scores > {Math.round($linkAutoCheckThreshold*100)}</span>
                </p>
            {:else}
                <p> {checkedLinks} identités validées :</p>
            {/if}
            <LinkCheckTable filter={ filterChecked } bind:rowSelect={rowSelect} sort={'scoreAsc'}/>
        {/if}

    </div>
{/if}

<script>
    import { linkResults, linkFileName, linkCompleted, linkAutoCheckThreshold} from '../tools/stores.js';
    import LinkCheckTable from './LinkCheckTable.svelte';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import {
      faArrowAltCircleLeft,
      faArrowAltCircleRight
    } from '@fortawesome/free-solid-svg-icons';

    let rowSelect;
    const filterUnchecked = {
        check: (v) => {return (v.checked === false)},
        score: (v) => {return v}
    };
    const filterChecked = {
        check: (v) => {return (v.checked)},
        score: (v) => {return v}
    };
    let scoredLinks;
    let checkedLinks;
    let sep = ';';

    $: if (scoredLinks && (scoredLinks === checkedLinks)) {
        $linkCompleted = true;
    }

    $: if ($linkResults) {
        const s = $linkResults.header.indexOf('score');
        scoredLinks = $linkResults.rows.filter(r => r[s]).length;
        const c = $linkResults.header.indexOf('check');
        checkedLinks = $linkResults.rows
            .filter(r => r[s])
            .filter(r => r[c].checked).length;
    }

    const download = () => {
        const blob = new Blob(toCsv(), { type: 'text/csv; charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = $linkFileName.replace(/\.(.*?)$/,'_deces_INSEE.$1');
        link.click();
        $linkCompleted = true;
    }

    const toCsv = () => {
        return [$linkResults.header.join(sep) + '\r\n',
            ...$linkResults.rows.map(row => $linkResults.header.map((col, i) => {
                if (col === 'check') {
                    if (row[i] === 'check') {return '';}
                }
                return row[i];
            }).join(sep) + '\r\n')];
    }

</script>

<style>
    .check-body {
        text-align: center;
    }
</style>