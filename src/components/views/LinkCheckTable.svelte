{#if (header && filteredRows && size)}
    <div class="rf-container-fluid">
        <p>
        <strong>{filteredRows.length} identités {actionTitle || ''} :</strong>
        </p>
        <div class="rf-grid-row">
            {#if subFilteredRows.length}
                <div class="rf-col-2">
                    <table
                        class="rf-table rf-table--narrow rf-text--sm"
                        style="border-right: .25em solid;"
                    >
                        <tr style="height: {theadHeight}px">
                            <th class="is-active">
                                score
                            </th>
                            <th class="is-active">
                                check
                            </th>
                        </tr>
                        {#each subFilteredRows.slice((page-1)*page,page*pageSize) as rowGroup, rowNumber}
                            {#each rowGroup as row, candidateNumber}
                                <tr
                                    on:click={() => selectRow(row)}
                                    class:rf-inactive={selectedRow !== row[$linkResults.header.indexOf('sourceLineNumber')]}
                                    class:rf-background--beige={rowNumber%2}
                                    style="height:3.25rem;"
                                >
                                    <td
                                        class="hcenter"
                                        title={get(row,'scores')}
                                    >
                                        {Math.round(get(row,'score')*100)}%
                                    </td>
                                    <td class="parent-tooltip hcenter has-text-grey-light">
                                        <div>
                                            <span
                                                class="rf-fi-close-circle-line rf-fi--lg {(row[row.length - 2].valid === false) ? "rf-color--rm" : "rf-color-hover--rm rf-inactive"}"
                                                class:is-hidden={
                                                    (row[$linkResults.header.indexOf('sourceLineNumber')] !== selectedRow)
                                                    && (row[row.length - 2].valid !== false)
                                                    && ((autoCheckSimilarPreview !== false)
                                                    || (!similarScores(selectedScores, JSON.parse(get(row,'scores')))))
                                                }
                                                on:click={async () => {row[row.length - 2].valid = await autoCheckSimilarRows(row, candidateNumber, false);}}
                                                on:mouseenter={() => {
                                                    selectedScores = JSON.parse(get(row,'scores'));
                                                    autoCheckSimilarPreview = $linkOptions.check.autoCheckSimilar ? false : undefined;
                                                    showToolTip=true;}}
                                                on:mouseleave={() => {autoCheckSimilarPreview = undefined;showToolTip=false;}}
                                                class:tooltip={showToolTip}
                                                data-tooltip={$linkOptions.check.autoCheckSimilar ? `invalider l'appariement et ${similarRowCount - 1} paire(s) similaire(s)` : "invalider l'appariement"}
                                            >
                                            </span>
                                            {#if row[$linkResults.header.indexOf('sourceLineNumber')] === selectedRow}
                                                &nbsp;
                                            {/if}
                                            <span
                                                class="rf-fi-checkbox-line rf-fi--lg {(row[row.length - 2].valid === true) ? "rf-color--bf" : "rf-color-hover--bf rf-inactive"}"
                                                class:is-hidden={
                                                    (row[$linkResults.header.indexOf('sourceLineNumber')] !== selectedRow)
                                                    && (row[row.length - 2].valid !== true)
                                                    && ((autoCheckSimilarPreview !== true)
                                                    || (!similarScores(selectedScores, JSON.parse(get(row,'scores')))))
                                                }
                                                on:click={async () => {row[row.length -2].valid = await autoCheckSimilarRows(row, candidateNumber, true);}}
                                                on:mouseenter={() => {
                                                    selectedScores = JSON.parse(get(row,'scores'));
                                                    autoCheckSimilarPreview = $linkOptions.check.autoCheckSimilar ? true : undefined
                                                    showToolTip=true;}}
                                                on:mouseleave={() => {autoCheckSimilarPreview = undefined;showToolTip=false;}}
                                                class:tooltip={showToolTip}
                                                data-tooltip={$linkOptions.check.autoCheckSimilar ? `valider l'appariement et ${similarRowCount - 1} paire(s) similaire(s)` : "valider l'appariement"}
                                            >
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        {/each}
                        {#if filteredRows.length > pageSize}
                            <tr>
                                <td>
                                    ...
                                </td>
                                <td>
                                    ...
                                </td>
                            </tr>
                        {/if}
                    </table>
                </div>
                <div class="rf-col-10 rf-padding-left-1N">
                    <div style="overflow-x: auto">
                        <table class="rf-table rf-table--narrow rf-text--sm">
                            <tr id="table-content">
                                {#each header.filter(x => (x!=='score') && (x!=='check')) as col, index}
                                    {#if $linkOptions.check.displayUnmappedColumns || (index < mappedColumns)}
                                        <th class:is-active={!($linkMapping.direct[col])}>
                                            {col}
                                        </th>
                                    {/if}
                                {/each}
                            </tr>
                            {#each subFilteredRows.slice((page-1)*page,page*pageSize) as rowGroup, rowNumber}
                                {#each rowGroup as row, candidateNumber}
                                    <tr
                                        on:click={() => selectRow(row)}
                                        class:rf-inactive={selectedRow !== row[$linkResults.header.indexOf('sourceLineNumber')]}
                                        class:rf-background--beige={rowNumber%2}
                                        style="height:3.25rem;"
                                    >
                                        {#each header.filter(x => (x!=='score') && (x!=='check')).filter((h,index) => index < mappedColumns).map(h => row[$linkResults.header.indexOf(h)]) as col, index}
                                            <td title={col}>
                                                {@html formatField(col, header[index], row)}
                                            </td>
                                        {/each}
                                        {#if $linkOptions.check.displayUnmappedColumns}
                                            {#each header.filter(x => (x!=='score') && (x!=='check')).filter((h,index) => index >= mappedColumns).map(h => row[$linkResults.header.indexOf(h)]) as col, index}
                                                <td title={col}>
                                                    {col}
                                                </td>
                                            {/each}
                                        {/if}
                                    </tr>
                                {/each}
                            {/each}
                            {#if filteredRows.length > pageSize}
                                <tr>
                                    {#each header.filter(x => (x!=='score') && (x!=='check')) as col, index}
                                        {#if $linkOptions.check.displayUnmappedColumns || (index < mappedColumns)}
                                            <td>
                                                ...
                                            </td>
                                        {/if}
                                    {/each}
                                </tr>
                            {/if}
                        </table>
                    </div>
                </div>
            {:else if $linkOptions.check.filter}
                <div class="rf-col-12">
                    <p>attention, le filtre <strong>{$linkOptions.check.filter}</strong> est trop restrictif </p>
                </div>
            {/if}
        </div>
    </div>
{/if}
<script>
    import { onMount } from 'svelte';
    import { linkResults, resultsPerPage, linkStep,
        linkSourceHeader, linkMapping, linkValidations,
        linkOptions
    } from '../tools/stores.js';
    import jsdiff from 'diff';
    import { runCompareRequest } from '../tools/runRequest.js';

    export let actionTitle;
    export let page = 1;
    export let pageSize=5;
    export let filter;
    export let sort = 'scoreDesc';
    export let master;
    export let size;
    let header;
    let mappedColumns;
    let autoCheckSimilarPreview = undefined;
    let wait = false;
    let showToolTip;

    onMount(() => {
        setTimeout(() => {
          if (subFilteredRows.length) {
            theadHeight = document.getElementById('table-content').offsetHeight;
          }
        }, 500);
    })

    const sorts = {
        scoreDesc: (a, b) => get(a[0],'score') > get(b[0],'score') ? -1 : ( get(a[0],'score') < get(b[0],'score') ? 1 : 0 ),
        scoreAsc: (a, b) => get(a[0],'score') > get(b[0],'score') ? 1 : ( get(a[0],'score') < get(b[0],'score') ? -1 : 0 )
    }
    let filteredRows;
    let subFilteredRows;
    let theadHeight=28;
    export let selectedRow;
    const headerMapping = {
        firstName: 'name.first',
        lastName: 'name.last',
        birthDate: 'birth.date',
        birthCity: 'birth.city',
        birthPostalCode: 'birth.codePostal',
        birthDepartment: 'birth.departmentCode',
        birthCountry: 'birth.country',
        deathDate: 'death.date',
        sex: 'sex'
    };

    $: if ($linkResults || ($linkResults && $linkOptions.check.filter)) {
        header = [
            ...$linkSourceHeader.map(h => ($linkMapping.direct && $linkMapping.direct[h]) && h)
                .filter(x => x),
            'score',
            'check',
            ...$linkSourceHeader.map(h => !($linkMapping.direct && $linkMapping.direct[h]) && h)
                .filter(x => x)
        ];
        mappedColumns = $linkSourceHeader.filter(h => ($linkMapping.direct && $linkMapping.direct[h])).length;
        computeFilteredRows();
    }

    $: if (header && mappedColumns && $linkValidations) {
        computeFilteredRows();
        size = filteredRows && filteredRows.length || 0;
    }

    const computeFilteredRows = () => {
        filteredRows = $linkResults.rows.map((r, i) => {
                return r.map((rr, j) => {
                    const rrr = rr.slice(0);
                    rrr.push($linkValidations[i][j] || { checked: false });
                    rrr.push(i);
                    return rrr;
                });
            })
            .filter(row => applyFilter(row, filter))
            .sort(sorts[sort]);
    }


    $: if (filteredRows) {
        if (master) {
            if (!selectedRow ||
                ( filteredRows && filteredRows.length && !filteredRows.some(r => selectedRow === r[0][$linkResults.header.indexOf('sourceLineNumber')]))
            ) {
                if (filteredRows && filteredRows.length) {
                    selectRow(filteredRows[0][0]);
                } else {
                    selectRow();
                }
            }
        } else {
            if (filteredRows && filteredRows.length && (selectedRow === -1)) {
                selectRow(filteredRows[0][0]);
            }
        }
    }

    let selectedScores = undefined;
    const selectRow = async (row) => {
        if (row) {
            const persA = {}
            header.filter(x => (x!=='score') && (x!=='check')).filter((h,index) => index < mappedColumns).forEach(h => {
              persA[$linkMapping.direct[h]] = row[$linkResults.header.indexOf(h)]
            })
            const persB = {}
            header.filter(x => (x!=='score') && (x!=='check')).filter((h,index) => index < mappedColumns).forEach(h => {
              if ($linkMapping.direct[h] === 'birthDate' || $linkMapping.direct[h] === 'deathDate') {
                persB[$linkMapping.direct[h]] = dateFormat(row[$linkResults.header.indexOf(headerMapping[$linkMapping.direct[h]])])
              } else {
                persB[$linkMapping.direct[h]] = row[$linkResults.header.indexOf(headerMapping[$linkMapping.direct[h]])]
              }
            })
            let response
            response = await runCompareRequest({personA: persA, personB: persB}, false)
            console.log(response)
            selectedRow = row[$linkResults.header.indexOf('sourceLineNumber')];
            selectedScores = JSON.parse(get(row,'scores'));
        } else {
            selectedRow = -1;
            selectedScores = undefined;
        }
    }

    $: subFilteredRows = filteredRows.filter(row => (new RegExp($linkOptions.check.filter,'i')).test(JSON.stringify(row)));

    const get = (row, col) => {
        if (col === 'check') {
            return row[row.length - 2]
        } else {
            return row[$linkResults.header.indexOf(col)];
        }
    };

    const applyFilter = (row, filter) => {
        if (!filter) { return true }
        return Object.keys(filter).every(k => {
            if (k === 'check') {
                return filter[k](row.map(r => r && r[r.length - 2]));
            } else {
                return filter[k](row.map(r => r && r[$linkResults.header.indexOf(k)]));
            }
        });
    }

    const check = async (row, candidateNumber, status, checkType = 'manual') => {
        if (row[row.length - 2].valid === status) {
            row[row.length - 2].checked = false
            row[row.length - 2].valid = undefined
        } else {
            row[row.length - 2].checked = `${Date.now()} - ${checkType}`
            row[row.length - 2].valid = await status
        }
        const sourceLineNumber = row[$linkResults.header.indexOf('sourceLineNumber')];
        await linkValidations.update(v => {
            v.forEach(r => {
                if (r[candidateNumber] && r[candidateNumber][$linkResults.header.indexOf('sourceLineNumber')] === sourceLineNumber) {
                    r[candidateNumber] = row[row.length - 2];
                }
            });
            return v;
        });
        return await row[row.length - 2].valid;
    }

    const formatField = (colA, colB, row) => {
        if ($linkMapping.direct[colB] === 'birthDate') {
            return coloredDiff([
                colA,
                dateFormat(row[$linkResults.header.indexOf(headerMapping['birthDate'])])
            ]);
        } else if ($linkMapping.direct[colB] === 'deathDate') {
            return `${colA ? colA + ' <br/> ' : ''}${dateFormat( row[$linkResults.header.indexOf(headerMapping['deathDate'])])} †`;
        } else {
            return coloredDiff([
                colA,
                row[$linkResults.header.indexOf(headerMapping[$linkMapping.direct[colB]])]
            ]);
        }
    }

    const coloredDiff = (doubleArray) => {
        doubleArray = doubleArray.filter(x => x);
        if (doubleArray.length !== 2) {
            return `<strong style="color: var(--rm500);">${doubleArray.join(' ') || '<vide>'}</strong>`
        }
        if (doubleArray[0] === doubleArray[1]) return doubleArray[0]

        let diff = jsdiff.diffChars(doubleArray[0], doubleArray[1], {'ignoreCase': true})

        if (diff.length === 1) return doubleArray[0]

        let right = ''
        let left = ''

        diff.forEach(function (part) {
            if (part.added) {
            right += '<strong style="color: var(--bf500);">' + part.value + '</strong>'
            } else if (part.removed) {
            left += '<strong style="color: var(--rm500);">' + part.value + '</strong>'
            } else {
            left += part.value
            right += part.value
            }
        })

        return brDiff([left, right])
        }

    const brDiff = (doubleArray) => {
        if (doubleArray.length !== 2) return 'Error => array\'s length must be 2'

        return doubleArray[0] + '<br/>' + doubleArray[1]
    };

    const dateFormat = (dateString) => {
        const format = ($linkOptions.csv.dateFormat || 'dd/MM/yyyy')
            .replace('dd','$3')
            .replace('MM','$2')
            .replace('yyyy','$1');
        return dateString.replace(/(\d{4})(\d{2})(\d{2})/, format);
    };

    let similarRowCount = undefined;

    $: if (selectedScores) {
        let count = 0
        filteredRows.forEach(rg => rg.forEach(r => {
            if (similarScores(selectedScores, JSON.parse(get(r, 'scores')))) {
                count++
            }
        }));
        similarRowCount = count;
    };

    const autoCheckSimilarRows = async (row, candidateNumber, status) => {
        if ($linkOptions.check.autoCheckSimilar) {
            const scores = JSON.parse(get(row,'scores'));
            const c = await check(row, candidateNumber, status, 'manual');
            await Promise.all(filteredRows.map(async (rg) => rg.map(async (r) => {
                if (JSON.stringify(r) !== JSON.stringify(row)) {
                    const s = JSON.parse(get(r, 'scores'));
                    if (similarScores(scores, s)) {
                        await check(r, candidateNumber, status, 'similar group');
                    }
                }
            })));
            return c;
        } else {
            return await check(row, candidateNumber, status, 'manual');
        }
    };

    const scoresDistance = (s1, s2) => {
        if (!s1 || !s2) { return 1 }
        return Math.max(
            (s1.score - s2.score) ** 2,
            ((s1.birthDate ? s1.birthDate : 0) - (s2.birthDate ? s2.birthDate : 0)) ** 2,
            ((s1.birthLocation ? s1.birthLocation.score : 0) - (s2.birthLocation ? s2.birthLocation.score : 0)) ** 2,
            ((s1.deathDate ? s1.deathDate : 0) - (s2.deathDate ? s2.deathDate : 0)) ** 2,
            ((s1.deathLocation ? s1.deathLocation.score : 0) - (s2.deathLocation ? s2.deathLocation.score : 0)) ** 2,
            (( s1.sex ? s1.sex : 0 )- (s2.sex ? s2.sex : 0)) ** 2,
            (( s1.name ? s1.name.score : 0 )- (s2.name ? s2.name.score : 0)) ** 2
        );
    };

    const similarScores = (s1, s2) => {
        return scoresDistance(s1, s2) < ((1 - $linkOptions.check.similarThreshold) ** 2);
    };

</script>

<style>
  .is-hidden {
      display: None;
  }

  td {
    max-width: 120px;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align:middle!important;
  }

  td.hcenter {
    text-align: center;
  }

  td.parent-tooltip {
    overflow:visible!important;
    position: relative;
  }

  .tooltip:hover::after {
    position: absolute;
    content: attr(data-tooltip);
    bottom: -32px;
    left: 0px;
    padding: 8px;
    background-color: var(--w);
    opacity: 1;
    border: 3px solid;
    padding: .25em .5em;
  }

</style>
