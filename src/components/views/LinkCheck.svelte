{#if $linkResults}
    <div class="check-body content">
        {#if (unCheckedLinks === 0) && (checkedLinks === 0)}
            <p>
                <strong>
                    Aucune correspondance de personne décédée n'a été trouvée dans votre fichier
                </strong>
            </p>
        {:else}
            {#if checkedLinks && (unCheckedLinks === 0)}
                <p>
                    toutes les identé(s) ({checkedLinks}) ont été validées* !
                    <br/>
                    <span class="is-size-7">* validation automatique pour les scores > {Math.round($linkAutoCheckThreshold*100)}</span>
                </p>
            {/if}
            <p>
                <span>
                    téléchargez:<br/>
                    {#if (unCheckedLinks === 0)}
                        <span class="has-text-danger">
                            <FontAwesomeIcon icon={faArrowAltCircleRight} class="is-24 is-low"/>
                            &nbsp;
                        </span>
                    {/if}
                    <button
                        class="button is-info"
                        on:click={e => download(false)}
                    >
                        le fichier complet
                    </button>
                    <button
                        class="button is-danger"
                        on:click={e => download(true)}
                    >
                        les décès identifiés
                    </button>
                    {#if (unCheckedLinks === 0)}
                        <span class="has-text-danger">
                            &nbsp;
                            <FontAwesomeIcon icon={faArrowAltCircleLeft} class="is-24 is-low"/>
                        </span>
                    {/if}
                </span>
            </p>

            <LinkCheckTable filter={filterUnchecked} bind:rowSelect={rowSelect} sort={'scoreDesc'} master=true actionTitle={"à valider"} bind:size={unCheckedLinks}/>
            <LinkCheckTable filter={ filterChecked } bind:rowSelect={rowSelect} sort={'scoreAsc'} actionTitle={"validées"} bind:size={checkedLinks}/>

        {/if}
    </div>
{/if}

<script>
    import { linkResults, linkFileName, linkCsvType,
        linkCompleted, linkAutoCheckThreshold, linkValidations
    } from '../tools/stores.js';
    import LinkCheckTable from './LinkCheckTable.svelte';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import {
      faArrowAltCircleLeft,
      faArrowAltCircleRight
    } from '@fortawesome/free-solid-svg-icons';

    let rowSelect;
    const filterUnchecked = {
        check: (v) => {return v.checked === false},
        score: (v) => {return v && parseFloat(v)}
    };
    const filterChecked = {
        check: (v) => {return v.checked},
        score: (v) => {return v && parseFloat(v)}
    };
    let unCheckedLinks;
    let checkedLinks;

    $: if (checkedLinks && (unCheckedLinks === 0)) {
        $linkCompleted = true;
    } else {
        $linkCompleted = false;
    }

    const protect = (sep) => {
        return sep === '|' ? '\|' : sep;
    }

    const protectField = (field) => {
        if (typeof(field) === 'string') {
            if (/^0\d+$/.test(field) || field.includes($linkCsvType.sep)) {
                const q = $linkCsvType.quote || '"'
                const re = new RegExp(`${q}`,'g');
                return `${q}${field.replace(re, `${q}${q}`)}${q}`
            } else {
                return field
            }
        } else {
            return protectField(JSON.stringify(field));
        }
    }

    const download = (filter) => {
        const blob = new Blob(toCsv(filter), { type: 'text/csv; charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = $linkFileName.replace(/\.(.*?)$/,'_deces_INSEE.$1');
        link.click();
        $linkCompleted = true;
    }

    const toCsv = (filter) => {
        const header = $linkResults.header;
        header.push('valid');
        header.push('checked');
        return [
            header.map(h => protectField(h)).join($linkCsvType.sep) + '\r\n',
            ...$linkResults.rows.map((r,i) => {
                r.push($linkValidations[i] && $linkValidations[i].valid || '');
                r.push($linkValidations[i] && ($linkValidations[i].checked ? (($linkValidations[i].checked === "auto") ? "auto": true) : false) || false);
                return r
                })
                .filter(row => !filter || row[header.indexOf('score')])
                .map(row => header.map((col, i) => protectField(row[i])).join($linkCsvType.sep) + '\r\n')];
    }

</script>

<style>
    .check-body {
        text-align: center;
    }
</style>