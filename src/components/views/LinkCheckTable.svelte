{#if (header && filteredRows && size)}
    <div class="rf-container-fluid">
        <p>
        <strong>{filteredRows.length} identités {actionTitle || ''} :</strong>
        </p>
        <div class="rf-grid-row">
            <div class="rf-col-4 rf-content--center">
                <div style="overflow:hidden;text-overflow:ellipsis">
                    <input id="displayColumns" type="checkbox" bind:checked={displayUnmappedColumns}/>
                    <label class="rf-label" for="displayColumns">
                        Afficher toutes les colonnes
                    </label>
                </div>
            </div>
            <div class="rf-col-4 rf-padding-left-2N rf-padding-right-2N">
                <input
                    class="rf-input"
                    style="height:1.75rem;margin-top:12px;"
                    placeholder="filtre"
                    bind:value={subFilter}
                />
            </div>
            <div class="rf-col-4 rf-content--center">
                <div style="overflow:hidden;text-overflow:ellipsis">
                    <input id="autocheck" type="checkbox" bind:checked={autoCheckSimilar}/>
                    <label
                        class="rf-label"
                        for="autocheck"
                        title="Cette option validera automatiquement toute les paires ayant le même profil de rapprochement"
                    >
                        Valider les paires similaires
                    </label>
                </div>
            </div>
            {#if subFilteredRows.length}
                <div class="rf-col-2">
                    <table
                        class="rf-table rf-table--narrow rf-text--sm"
                        style="border-right: .25em solid;"
                    >
                        <tr>
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
                                        title={JSON.stringify(selectedScores) + '<br>' + get(row,'scores')}
                                    >
                                        {Math.round(get(row,'score')*100)}%
                                    </td>
                                    <td class="hcenter has-text-grey-light">
                                        <span
                                            class="rf-fi-close-circle-line rf-fi--lg {(row[row.length - 2].valid === false) ? "rf-color--rm" : "rf-color-hover--rm rf-inactive"}"
                                            class:is-hidden={
                                                (row[$linkResults.header.indexOf('sourceLineNumber')] !== selectedRow)
                                                && (row[row.length - 2].valid !== false)
                                                && ((autoCheckSimilarPreview !== false)
                                                || (!similarScores(selectedScores, JSON.parse(get(row,'scores')))))
                                            }
                                            on:click={() => {row[row.length - 2].valid = autoCheckSimilarRows(row, candidateNumber, false);}}
                                            on:mouseenter={() => {autoCheckSimilarPreview = autoCheckSimilar ? false : undefined}}
                                            on:mouseleave={() => {autoCheckSimilarPreview = undefined}}
                                            title="invalider l'appariement"
                                        >
                                        </span>
                                        {#if row[$linkResults.header.indexOf('sourceLineNumber')] === selectedRow}
                                            &nbsp;
                                        {/if}
                                        <span
                                            class="rf-fi-checkbox-line rf-fi--lg {(row[row.length - 2].valid === true) ? "rf-color--bf" : "rf-color-hover--bf rf-inactive"}"
                                            class:is-hidden={
                                                (row[$linkResults.header.indexOf('sourceLineNumber')] !== selectedRow)
                                                && (row[row.length - 2].valid !== false)
                                                && ((autoCheckSimilarPreview !== true)
                                                || (!similarScores(selectedScores, JSON.parse(get(row,'scores')))))
                                            }
                                            on:click={() => {row[row.length -2].valid = autoCheckSimilarRows(row, candidateNumber, true);}}
                                            on:mouseenter={() => {autoCheckSimilarPreview = autoCheckSimilar ? true : undefined}}
                                            on:mouseleave={() => {autoCheckSimilarPreview = undefined}}
                                            title="valider l'appariement"
                                        >
                                        </span>
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
                <div class="rf-col-10">
                    <div style="overflow-x: auto">
                        <table class="rf-table rf-table--narrow rf-text--sm">
                            <tr>
                                {#each header.filter(x => x!=='score' && x!=='check') as col, index}
                                    {#if displayUnmappedColumns || (index < mappedColumns)}
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
                                        {#each header.filter(x => x!=='score' && x!=='check').filter((h,index) => index < mappedColumns).map(h => row[$linkResults.header.indexOf(h)]) as col, index}
                                            <td title={col}>
                                                {@html formatField(col, header[index], row)}
                                            </td>
                                        {/each}
                                        {#if displayUnmappedColumns}
                                            {#each header.filter((h,index) => index >= (mappedColumns+2)).map(h => row[$linkResults.header.indexOf(h)]) as col, index}
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
                                    {#each header as col, index}
                                        {#if displayUnmappedColumns || (index < mappedColumns+2)}
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
            {:else if subFilter}
                <div class="rf-col-12">
                    <p>attention, le filtre <strong>{subFilter}</strong> est trop restrictif </p>
                </div>
            {/if}
        </div>
    </div>
{/if}
<script>
    import { linkResults, resultsPerPage, linkStep,
        linkSourceHeader, linkMapping, linkValidations,
        linkCsvType
    } from '../tools/stores.js';
    import jsdiff from 'diff';

    export let actionTitle;
    export let page = 1;
    export let pageSize=5;
    export let filter;
    export let subFilter='';
    export let sort = 'scoreDesc';
    export let master;
    export let size;
    let header;
    let mappedColumns;
    let displayUnmappedColumns = false;
    export let autoCheckSimilar = true;
    let autoCheckSimilarPreview = undefined;
    const similarThreshold = 0.001;
    let wait = false;

    const sorts = {
        scoreDesc: (a, b) => get(a[0],'score') > get(b[0],'score') ? -1 : ( get(a[0],'score') < get(b[0],'score') ? 1 : 0 ),
        scoreAsc: (a, b) => get(a[0],'score') > get(b[0],'score') ? 1 : ( get(a[0],'score') < get(b[0],'score') ? -1 : 0 )
    }
    let filteredRows;
    let subFilteredRows;
    export let selectedRow;
    const headerMapping = {
        firstName: 'name.first',
        lastName: 'name.last',
        birthDate: 'birth.date',
        birthCity: 'birth.city',
        birthDepartment: 'birth.departmentCode',
        birthCountry: 'birth.country',
        deathDate: 'death.date',
        sex: 'sex'
    };

    $: if ($linkResults || ($linkResults && subFilter)) {
        header = [
            ...$linkSourceHeader.map(h => ($linkMapping.direct && $linkMapping.direct[h]) && h)
                .filter(x => x),
            'score',
            'check',
            ...$linkSourceHeader.map(h => !($linkMapping.direct && $linkMapping.direct[h]) && h)
                .filter(x => x)
        ];
        mappedColumns = $linkSourceHeader.filter(h => ($linkMapping.direct && $linkMapping.direct[h])).length;
        filteredRows = $linkResults.rows.map((r, i) => {
                return r.map((rr, j) => {
                    const rrr = rr.slice(0);
                    rrr.push($linkValidations[i][j] || { checked: false });
                    rrr.push(i);
                    return rrr;
                });
            })
            .filter(row => applyFilter(row, filter))
            .sort(sorts[sort])
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
    const selectRow = (row) => {
        if (row) {
            selectedRow = row[$linkResults.header.indexOf('sourceLineNumber')];
            selectedScores = JSON.parse(get(row,'scores'));
        } else {
            selectedRow = -1;
            selectedScores = undefined;
        }
    }

    $: subFilteredRows = filteredRows.filter(row => (new RegExp(subFilter,'i')).test(JSON.stringify(row)));

    $: size = filteredRows && filteredRows.length || 0;

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

    const check = (row, candidateNumber, status, checkType = 'manual') => {
        if (row[row.length - 2].valid === status) {
            row[row.length - 2].valid = undefined
            row[row.length - 2].checked = false
        } else {
            row[row.length - 2].valid = status
            row[row.length - 2].checked = `${Date.now()} - ${checkType}`
        }
        const sourceLineNumber = row[$linkResults.header.indexOf('sourceLineNumber')];
        linkValidations.update(v => {
            v.forEach(r => {
                if (r[candidateNumber] && r[candidateNumber][$linkResults.header.indexOf('sourceLineNumber')] === sourceLineNumber) {
                    r[candidateNumber] = row[row.length - 2];
                }
            });
            return v;
        });
        return row[row.length - 2].valid;
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
        const format = ($linkCsvType.dateFormat || 'DD/MM/YYYY')
            .replace('DD','$3')
            .replace('MM','$2')
            .replace('YYYY','$1');
        return dateString.replace(/(\d{4})(\d{2})(\d{2})/, format);
    };

    const autoCheckSimilarRows = async (row, candidateNumber, status) => {
        if (autoCheckSimilar) {
            const scores = JSON.parse(get(row,'scores'));
            const c = check(row, candidateNumber, status, 'manual');
            filteredRows.forEach(rg => rg.forEach(r => {
                if (r !== row) {
                    const s = JSON.parse(get(r, 'scores'));
                    if (similarScores(scores, s)) {
                        check(r, candidateNumber, status, 'similar group');
                    }
                }
            }));
            return c;
        } else {
            return check(row, candidateNumber, status, 'manual');
        }
    };

    const scoresDistance = (s1, s2) => {
        if (!s1 || !s2) { return 1 }
        return Math.max(
            (s1.score - s2.score) ** 2,
            ((s1.date ? s1.date : 0) - (s2.date ? s2.date : 0)) ** 2,
            ((s1.location ? s1.location.score : 0) - (s2.location ? s2.location.score : 0)) ** 2,
            (( s1.name ? s1.name.score : 0 )- (s2.name ? s2.name.score : 0)) ** 2
        );
    };

    const similarScores = (s1, s2) => {
        return scoresDistance(s1, s2) < similarThreshold;
    };

</script>

<style>
  .is-hidden {
      display: None;
  }

  td {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align:middle!important;
  }

  td.hcenter {
    text-align: center;
  }

</style>