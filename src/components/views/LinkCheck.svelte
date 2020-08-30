{#if !$linkWaiter}
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
                            class='button is-info'
                            on:click|preventDefault={e => download(false)}
                        >
                            le fichier complet
                            {#if isDownloading === 'complete'}
                                <div style="z-index:1200;position:absolute;witdth:100%;background-color:#fff;opacity:0.5;">
                                    <FontAwesomeIcon icon={faSpinner} class="is-low spin"/>
                                </div>
                            {/if}
                        </button>

                        <button
                            class="button is-danger"
                            on:click|preventDefault={e => download(true)}
                        >
                            les décès identifiés
                            {#if isDownloading === 'matched'}
                                <div style="z-index:1200;position:absolute;witdth:100%;background-color:#fff;opacity:0.5;">
                                    <FontAwesomeIcon icon={faSpinner} class="is-low spin"/>
                                </div>
                            {/if}
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
{/if}

<script>
    import { linkWaiter, linkCompleteResults, linkResults, linkFileName, linkCsvType,
        linkCompleted, linkAutoCheckThreshold, linkValidations
    } from '../tools/stores.js';
    import LinkCheckTable from './LinkCheckTable.svelte';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import {
      faArrowAltCircleLeft,
      faArrowAltCircleRight,
      faSpinner
    } from '@fortawesome/free-solid-svg-icons';

    let isDownloading = false;

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

    $: if ($linkResults) {
        $linkWaiter = false;
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
            return field ? protectField(JSON.stringify(field)) : '';
        }
    }

    const download = (filter) => {
        isDownloading = filter ? 'matched' : 'complete';
        setTimeout(() => {
            const blob = new Blob(toCsv(filter), { type: 'text/csv; charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = $linkFileName.replace(/\.(.*?)$/,'_deces_INSEE.$1');
            link.click();
            isDownloading = false;
            $linkCompleted = true;
        }, 500);
    }

    const toCsv = (filter) => {
        const header = $linkCompleteResults.header;
        header.push('valid');
        header.push('checked');
        let rows, index, map;
        if (filter) {
            rows = $linkResults.rows.map(r => r.slice(0, -1))
            index = (i) => i;
        } else {
            rows = $linkCompleteResults.rows;
            map = {};
            let j = 0;
            $linkResults.rows.forEach(r => {
                map[r.slice(-1)[0]] = j++;
            });
            index = (i) => map[i];
        }
        return [
            header.map(h => protectField(h)).join($linkCsvType.sep) + '\r\n',
            ...rows.map((r,i) => {
                const l = $linkValidations[index(i)];
                r.push(l && l.valid || '');
                r.push(l && (l.checked ? ((l.checked === "auto") ? "auto": true) : false) || false);
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
  .wait-center {
    text-align: center;
    transform: translateY(50%);
    height: 14rem;
    additive-symbols: 14rem;
  }
</style>