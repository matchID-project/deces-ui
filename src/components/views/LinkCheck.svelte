{#if !$linkWaiter}
    {#if $linkResults}
        <div class="rf-container-fluid rf-text--center">
            {#if (unCheckedLinks === 0) && (checkedLinks === 0)}
                <p>
                    <strong>
                        Aucune correspondance de personne décédée n'a été trouvée dans votre fichier.
                    </strong>
                </p>
            {:else}
                {#if checkedLinks && (unCheckedLinks === 0)}
                    <p>
                        Toutes les identé(s) ({checkedLinks}) ont été validées* !
                        <br/>
                        <span class="rf-text--sm">* validation automatique pour les scores > {Math.round($linkOptions.check.autoCheckThreshold*100)}</span>
                    </p>
                {/if}
                <p>
                    <span>
                        {#if (unCheckedLinks === 0)}
                            <span class="rf-color--rm rf-fi-arrow-right-line rf-fi">
                            </span>
                        {/if}
                        <span>Téléchargez:</span>

                        {#if (unCheckedLinks === 0)}
                            <span class="rf-color--rm rf-fi-arrow-left-line rf-fi">
                            </span>
                        {/if}
                        <br/>
                        <button
                            title="télécharger le fichier ${$linkOptions.csv.type === 'gedcom' ? 'CSV' : 'complet'}"
                            class="rf-btn rf-margin-1N"
                            on:click|preventDefault={e => download(false)}
                        >
                            <span class="rf-text--center">{$linkOptions.csv.type === 'gedcom' ? 'le fichier CSV' : 'le fichier complet'}</span>
                            {#if isDownloading === 'complete'}
                                <div style="z-index: 1200;position: absolute;right: 45%;top: 2px;color: #fff;opacity: 0.8;">
                                    <Icon icon="ri:loader-line" class="rf-fi--lg rf-margin-top-1N" spin center/>
                                </div>
                            {/if}
                        </button>

                        <button
                            title="télécharger {$linkOptions.csv.type === 'gedcom' ? 'le fichier Gedcom' : 'les décès identifiés'}"
                            class="rf-btn rf-btn--secondary rf-margin-1N"
                            on:click|preventDefault={e => download(true)}
                        >
                            {$linkOptions.csv.type === 'gedcom' ? 'le fichier Gedcom' : 'les décès identifiés'}
                            {#if isDownloading === 'matched'}
                                <div style="z-index: 1200;position: absolute;right: 45%;top: 2px;background-color: #fff;opacity: 0.5;">
                                  <Icon icon="ri:loader-line" class="rf-fi--lg rf-margin-top-1N" spin center/>
                                </div>
                            {/if}
                        </button>
                    </span>
                </p>
                <LinkConfigureOptions check/>
                <LinkCheckTable filter={filterUnchecked} bind:selectedRow={selectedRow} sort={'scoreDesc'} master=true actionTitle={"à valider"} bind:size={unCheckedLinks}/>
                <LinkCheckTable filter={ filterChecked } bind:selectedRow={selectedRow} sort={'scoreAsc'} actionTitle={"validées"} bind:size={checkedLinks}/>
            {/if}
        </div>

    {/if}
{/if}

<script>
    import { onMount } from 'svelte';
    import { linkWaiter, linkCompleteResults, linkResults, linkFileName, linkOptions,
        linkCompleted, linkValidations
    } from '../tools/stores.js';
    import LinkCheckTable from './LinkCheckTable.svelte';
    import LinkConfigureOptions from './LinkConfigureOptions.svelte';
    import Icon from './Icon.svelte';
    import yaml from 'yamljs';

    let isDownloading = false;

    let selectedRow;
    let autoCheckSimilar;
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
            if (/^0\d+$/.test(field) || field.includes($linkOptions.csv.sep)) {
                const q = $linkOptions.csv.quote || '"'
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
            let blob;
            if ($linkOptions.csv.type === 'gedcom') {
                blob = new Blob(toGedcom(), { type: 'text/plain; charset=utf-8;' });
            } else {
                blob = new Blob(toCsv(filter), { type: 'text/csv; charset=utf-8;' });
            }
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = $linkFileName.replace(/\.(.*?)$/,`_deces_INSEE.${($linkOptions.csv.type === 'gedcom' && !filter) ? 'csv' : '$1'}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
            isDownloading = false;
            $linkCompleted = true;
        }, 500);
    }

    const jsonToGedcomRegexp = [
        [/^\s*[\{\}]/mg, ''],
        [/[\{\]},]\s*$/mg, ''],
        [/"([^"]*?)":?/mg, "$1"],
        [/^  (\S)/mg,'0 $1'],
        [/\\\\/mg,'\\'],
        [/^              /mg,'6 '],
        [/^            /mg,'5 '],
        [/^          /mg,'4 '],
        [/^        /mg,'3 '],
        [/^      /mg,'2 '],
        [/^    /mg,'1 '],
        [/^([0-6]\s)(\S+)/mg, (a,b,c) => {return b+c.toUpperCase()}],
        [/\s*\n[0-6]\s+TYPE (.*)\n/mg, ' $1\n'],
        [/\s+null\s*$/mg,""],
        [/^\s*\n/mg, '']
    ];

    const jsonToGedcom = (json, level=0) => {
        if (!json) {return ''}
        return Object.keys(json).map(key => {
            if (!json[key]) {return `${level} ${key.toUpperCase()}\n`}
            if (['boolean','string','number'].includes(typeof(json[key]))) {
                return `${level} ${key.toUpperCase()} ${json[key]}\n`;
            } else if (Array.isArray(json[key])) {
                return json[key].map(v => {
                    if (['boolean','string','number'].includes(typeof(v))) {
                        return `${level} ${key.toUpperCase()} ${v}`;
                    } else {
                        return `${level} ${key.toUpperCase()}\n${jsonToGedcom(v, level+1)}`;
                    }
                }).join('\n');
            } else {
                if (Object.keys(json[key]).length && Object.keys(json[key]).includes('xxxx')) {
                    const result = `${level} ${key.toUpperCase()} ${json[key].xxxx}\n${jsonToGedcom(json[key], level+1)}`;
                    return result
                } else {
                    return `${level} ${key.toUpperCase()}\n${jsonToGedcom(json[key], level+1)}`;
                }
            }
        }).join('\n')
        .replace(/\n\n/mg,'\n')
        .replace(/^\S+ XXXX[^\n]*\n/mg, '')
        .replace(/\n/mg,'\r\n');
    }

    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

    const toGedcomDate = (dateString) =>  {
        const year = parseInt(dateString.substring(0,4));
        const day = parseInt(dateString.substring(6,8));
        const month = parseInt(dateString.substring(4,6));
        return year ?
                (month ?
                    (day ? `${day} ${months[month-1]} ${year}` : `${months[month+1]} ${year}`)
                    : `${year}`)
                : undefined;
    }

    const toGedcom = () => {
        let gedcom = $linkOptions.csv.gedcom;
        const idCol = $linkResults.header.indexOf('id');

        $linkResults.rows.forEach((r,i) => {
            const l = $linkValidations[i];
            const gedcomId = r[0][0];
            const results = r.filter((rr,j) => l && l[j] && l[j].valid && l[j].checked)
                .map((rr) => {
                    const dic = {};
                    $linkResults.header.forEach((col, c) => dic[col] = rr[c]);
                    return dic;
                })
                .map(r => { return {
                    matchid: `${window.location.href.replace(/\/link.*/,'/id/')}${r.id} à ${r.score*100}%`,
                    name: `${r['name.first']} /${r['name.last']}/`,
                    surn: r['name.last'],
                    givn: r['name.first'],
                    birt: {
                        date: toGedcomDate(r['birth.date']),
                        plac: `${r['birth.city']},${r['birth.deathDepartmentCode']||''}, ${r['birth.country']}`.replace(/,\s*,/,',')
                    },
                    death: {
                        date: toGedcomDate(r['death.date']),
                        plac: `${r['death.city']},${r['death.deathDepartmentCode']||''}, ${r['death.country']}`.replace(/,\s*,/,',')
                    }
                }})
                .map(r => yaml.stringify(r).replace(/\'/g,'').split('\n'))
            if (results.length > 0) {
                if (gedcom[gedcomId].note) {
                    if (gedcom[gedcomId].note.cont) {
                        gedcom[gedcomId].note.cont.push('',...results[0])
                    } else {
                        gedcom[gedcomId].note = { cont: [gedcom[gedcomId].note, ...results[0]] };
                    }
                } else {
                    gedcom[gedcomId].note = { cont: results[0] };
                }
                if (!gedcom[gedcomId].deat && results[0].deat) { gedcom[gedcomId].deat = results[0].deat}
                if (!gedcom[gedcomId].deat.plac && results[0].deat.plac) { gedcom[gedcomId].deat.plac = results[0].deat.plac }
                if (!gedcom[gedcomId].deat.date && results[0].deat.date) { gedcom[gedcomId].deat.plac = results[0].deat.date }
                if (!gedcom[gedcomId].birt && results[0].birt) { gedcom[gedcomId].birt = results[0].birt}
                if (!gedcom[gedcomId].birt.plac && results[0].birt.plac) { gedcom[gedcomId].birt.plac = results[0].birt.plac }
                if (!gedcom[gedcomId].birt.date && results[0].birt.date) { gedcom[gedcomId].birt.plac = results[0].birt.date }
                if (!gedcom[gedcomId].surn && results[0].surn) { gedcom[gedcomId].surn = results[0].surn}
                if (!gedcom[gedcomId].givn && results[0].givn) { gedcom[gedcomId].surn = results[0].givn}
            }
        });
        gedcom = jsonToGedcom(gedcom);
        return [gedcom];
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
            header.map(h => protectField(h)).join($linkOptions.csv.sep) + '\r\n',
            ...flatten(rows.map((r,i) => {
                    const l = $linkValidations[index(i)];
                    return r.map((rr,j) => {
                        const rrr = rr.slice(0);
                        rr.push(l && l[j] && [true, false].includes(l[j].valid) ? l[j].valid : '');
                        rr.push(l && l[j] && (l[j].checked ? ((l[j].checked === "auto") ? "auto": true) : undefined) || undefined);
                        return rr;
                    });
                }),1)
                .filter(row => !filter || row[header.indexOf('score')])
                .map(row => header.map((col, i) => protectField(row[i])).join($linkOptions.csv.sep) + '\r\n')];
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

    $: updateValidationThreshold($linkOptions.check.autoCheckThreshold);

    const updateValidationThreshold = () => {
        const headerMapping = {};
        $linkCompleteResults.header.forEach((h,i) => headerMapping[h] = i);
        linkValidations.update(v => {
            return $linkResults.rows.map((r,i) => {
                return r.map((rr,j) => {
                    return $linkValidations && $linkValidations[i] && $linkValidations[i][j] && $linkValidations[i][j].checked && ($linkValidations[i][j].checked !== "auto") ?
                        $linkValidations[i][j]
                        :
                        (
                            (rr[headerMapping['score']] >= $linkOptions.check.autoCheckThreshold) ?
                            { valid: true, checked: "auto" }
                            :
                            { checked: false }
                        )
                });
            });
        });
    }

    onMount(() => {
        updateValidationThreshold();
    })

</script>

