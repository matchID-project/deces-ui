{#if (header && filteredRows && size)}
    <div style="width: 100%">
        <p>
        <strong>{filteredRows.length} identités {actionTitle || ''} :</strong>
        </p>
        <p>
            <span class="is-size-6-7"><strong>filtre:</strong> <input bind:value={subFilter}/></span>
        </p>
        {#if subFilteredRows.length}
            <table class="table is-narrow is-size-6-7">
                <tr>
                    {#each header as col, index}
                        {#if displayUnmappedColumns || (index < mappedColumns+2)}
                            <th class:is-active={displayUnmappedColumns && ($linkMapping.direct[col] || ['score', 'check'].includes(col))}>
                                {col}
                            </th>
                        {/if}
                    {/each}
                </tr>
                {#each filteredRows.slice((page-1)*page,page*pageSize) as row, rowNumber}
                    <tr
                        on:click={() => {rowSelect = row.slice(-1)[0]}}
                        class:is-striped={rowNumber%2}
                        class:has-text-grey-light={rowSelect !== row.slice(-1)[0]}
                    >
                        {#each header.filter((h,index) => index < mappedColumns).map(h => row[$linkResults.header.indexOf(h)]) as col, index}
                            <td title={col}>
                                {@html coloredDiff([
                                    col,
                                    $linkMapping.direct[header[index]] === 'birthDate'
                                        ? dateFormat( row[$linkResults.header.indexOf(headerMapping[$linkMapping.direct[header[index]]])])
                                        : row[$linkResults.header.indexOf(headerMapping[$linkMapping.direct[header[index]]])]
                                ])}
                            </td>
                        {/each}
                        <td class="hcenter">
                            {Math.round(get(row,'score')*100)}%
                        </td>
                        <td class="hcenter has-text-grey-light">
                            <span
                                class:has-text-danger={row[$linkResults.header.indexOf('check')].valid === false}
                                class:is-hidden={(row.slice(-1)[0] !== rowSelect) && (row[$linkResults.header.indexOf('check')].valid !== false)}
                                on:click={() => {row[$linkResults.header.indexOf('check')].valid = check(row, false);}}
                            >
                                <FontAwesomeIcon icon={faWindowClose} class="is-lower"/>
                            </span>
                            {#if row.slice(-1)[0] === rowSelect}
                                &nbsp;
                            {/if}
                            <span
                                class:has-text-info={row[$linkResults.header.indexOf('check')].valid === true}
                                class:is-hidden={(row.slice(-1)[0] !== rowSelect) && (row[$linkResults.header.indexOf('check')].valid !== true)}
                                on:click={() => {row[$linkResults.header.indexOf('check')].valid = check(row, true);}}
                            >
                                    <FontAwesomeIcon icon={faCheck} class="is-lower"/>
                            </span>
                        </td>
                        {#if displayUnmappedColumns}
                            {#each header.filter((h,index) => index >= (mappedColumns+2)).map(h => row[$linkResults.header.indexOf(h)]) as col, index}
                                <td title={col}>
                                    {col}
                                </td>
                            {/each}
                        {/if}
                    </tr>
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
        {:else if subFilter}
            <p>attention, le filtre <strong>{subFilter}</strong> est trop restrictif </p>
        {/if}
    </div>
{/if}
<script>
    import { linkResults, resultsPerPage, linkStep, linkSourceHeader, linkMapping } from '../tools/stores.js';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import {
      faCheck,
      faWindowClose
    } from '@fortawesome/free-solid-svg-icons';
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

    const sorts = {
        scoreDesc: (a, b) => get(a,'score') > get(b,'score') ? -1 : ( get(a,'score') < get(b,'score') ? 1 : 0 ),
        scoreAsc: (a, b) => get(a,'score') > get(b,'score') ? 1 : ( get(a,'score') < get(b,'score') ? -1 : 0 )
    }
    let filteredRows;
    let subFilteredRows;
    export let rowSelect;
    const headerMapping = {
        firstName: 'name first',
        lastName: 'name last',
        birthDate: 'birth date',
        birthCity: 'birth city',
        birthDepartment: 'birth departmentCode',
        birthCountry: 'birth country'
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
        filteredRows = $linkResults.rows.map((r, index) => {
                const row = r.slice(0);
                row.push(index);
                return row;
            })
            .filter(row => applyFilter(row, filter))
            .sort(sorts[sort])
        if (master) {
            if (!rowSelect) {
                if (filteredRows && filteredRows.length) {
                    rowSelect = filteredRows[0].slice(-1)[0];
                } else {
                    rowSelect = -1;
                }
            }
        } else {
            if (filteredRows && filteredRows.length && (rowSelect === -1)) {
                rowSelect = filteredRows[0].slice(-1)[0];
            }
        }
    }

    $: subFilteredRows = filteredRows.filter(row => (new RegExp(subFilter,'i')).test(JSON.stringify(row)));

    $: size = filteredRows && filteredRows.length || 0;

    const get = (row, col) => {
        return row[$linkResults.header.indexOf(col)];
    };

    const applyFilter = (row, filter) => {
        if (!filter) { return true }
        return Object.keys(filter).every(k => {
            return filter[k](row[$linkResults.header.indexOf(k)]);
        });
    }

    const check = (row, status) => {
        if (row[$linkResults.header.indexOf('check')].valid === status) {
            row[$linkResults.header.indexOf('check')].valid = undefined
            row[$linkResults.header.indexOf('check')].checked = false
        } else {
            row[$linkResults.header.indexOf('check')].valid = status
            row[$linkResults.header.indexOf('check')].checked = Date.now()
        }
        linkResults.update(v => {
            v.rows[row.slice(-1)[0]][$linkResults.header.indexOf('check')] = row[$linkResults.header.indexOf('check')];
            return v;
        })
        return row[$linkResults.header.indexOf('check')].valid;
    }

    const coloredDiff = (doubleArray) => {
        doubleArray = doubleArray.filter(x => x);
        if (doubleArray.length !== 2) {
            return `<strong style="color: #e2011c;">${doubleArray.join(' ') || '<vide>'}</strong>`
        }
        if (doubleArray[0] === doubleArray[1]) return doubleArray[0]

        let diff = jsdiff.diffChars(doubleArray[0], doubleArray[1], {'ignoreCase': true})

        if (diff.length === 1) return doubleArray[0]

        let right = ''
        let left = ''

        diff.forEach(function (part) {
            if (part.added) {
            right += '<strong style="color: #e2011c;">' + part.value + '</strong>'
            } else if (part.removed) {
            left += '<strong style="color: #e2011c;">' + part.value + '</strong>'
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
        return dateString.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1");
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

  .is-striped {
    background-color: #fafafa;
  }

</style>