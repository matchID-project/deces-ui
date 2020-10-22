{#if !$linkWaiter}
    {#if $linkResults}
        <div class="rf-container-fluid rf-text--center">
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
                        <span class="rf-text--sm">* validation automatique pour les scores > {Math.round($linkAutoCheckThreshold*100)}</span>
                    </p>
                {/if}
                <p>
                    <span>
                        {#if (unCheckedLinks === 0)}
                            <span class="rf-color--rm rf-fi-arrow-right-line rf-fi">
                            </span>
                        {/if}
                        <span>téléchargez:</span>
                        {#if (unCheckedLinks === 0)}
                            <span class="rf-color--rm rf-fi-arrow-left-line rf-fi">
                            </span>
                        {/if}
                        <br/>
                        <button
                            title="télécharger le fichier complet"
                            class="rf-btn rf-margin-1N"
                            on:click|preventDefault={e => download(false)}
                        >
                            <span class="rf-text--center">le fichier complet</span>
                            {#if isDownloading === 'complete'}
                                <div style="z-index:1200;position:absolute;witdth:100%;right:45%;color:#fff;opacity:0.5;">
                                    <FontAwesomeIcon icon={faSpinner} class="is-low spin"/>
                                </div>
                            {/if}
                        </button>

                        <button
                            title="télécharger les décès identifiés"
                            class="rf-btn rf-btn--secondary rf-margin-1N"
                            on:click|preventDefault={e => download(true)}
                        >
                            les décès identifiés
                            {#if isDownloading === 'matched'}
                                <div style="z-index:1200;position:absolute;witdth:100%;right:45%;background-color:#fff;opacity:0.5;">
                                    <FontAwesomeIcon icon={faSpinner} class="is-low spin"/>
                                </div>
                            {/if}
                        </button>
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
      faSpinner
    } from '@fortawesome/free-solid-svg-icons';

    let isDownloading = false;

    let rowSelect;
    const filterUnchecked = {
        check: (r) => {return r.some(v => (!v || v.checked === false))},
    };
    const filterChecked = {
        check: (r) => {return r.every(v => v && v.checked)},
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
            return [null, undefined].includes(field) ? '' : protectField(JSON.stringify(field));
        }
    }

    const download = (filter) => {
        isDownloading = filter ? 'matched' : 'complete';
        setTimeout(() => {
            const blob = new Blob(toCsv(filter), { type: 'text/csv; charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = $linkFileName.replace(/\.(.*?)$/,'_deces_INSEE.$1');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
            isDownloading = false;
            $linkCompleted = true;
        }, 500);
    }

    const toCsv = (filter) => {
        const header = [...$linkCompleteResults.header, 'valid', 'checked'];
        let rows, index, map;
        if (filter) {
            rows = $linkResults.rows;
            index = (i) => i;
        } else {
            rows = $linkCompleteResults.rows;
            map = {};
            let j = 0;
            $linkResults.rows.forEach(r => {
                map[r[0][$linkResults.header.indexOf('sourceLineNumber')] - 1] = j++;
            });
            index = (i) => map[i];
        }
        return [
            header.map(h => protectField(h)).join($linkCsvType.sep) + '\r\n',
            ...flatten(rows.map((r,i) => {
                    const l = $linkValidations[index(i)];
                    const row = r.slice(0).map((rr,j) => {
                        rr.push(l && l[j] && [true, false].includes(l[j].valid) ? l[j].valid : '');
                        rr.push(l && l[j] && (l[j].checked ? ((l[j].checked === "auto") ? "auto": true) : undefined) || undefined);
                        return rr;
                    });
                    return row;
                }),1)
                .filter(row => !filter || row[header.indexOf('score')])
                .map(row => header.map((col, i) => protectField(row[i])).join($linkCsvType.sep) + '\r\n')];
    }

    const flatten = (array, depth) => {
      // If no depth is specified, default to 1
      if (depth === undefined) {
        depth = 1;
      }

      // Recursively reduce sub-arrays to the specified depth
      const flat = (arr, depth) => {

        // If depth is 0, return the array as-is
        if (depth < 1) {
          return arr.slice();
        }

        // Otherwise, concatenate into the parent array
        return arr.reduce(function (acc, val) {
          return acc.concat(Array.isArray(val) ? flat(val, depth - 1) : val);
        }, []);

      };
      return flat(array, depth);
    };

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
