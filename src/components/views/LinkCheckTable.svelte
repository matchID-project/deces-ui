{#if $linkResults && $linkSourceHeader && displayRows.length}
    <table class="table is-narrow is-size-6-7">
        <tr>
            {#each $linkSourceHeader as col}
                <th>
                    {col}
                    {#if $linkMapping[col]}
                    *
                    {/if}
                </th>
            {/each}
            <th>
            confiance
            </th>
            <th>
            validation
            </th>
        </tr>
        {#each displayRows.slice((page-1)*page,page*pageSize) as row, rowNumber}
            <tr
                on:click={() => {rowSelect = row.slice(-1)[0]}}
                class:is-striped={rowNumber%2}
                class:has-text-grey-light={rowSelect !== row.slice(-1)[0]}
            >
                {#each row as col, index}
                    {#if (index < $linkSourceHeader.length)}
                        <td
                            title={col}
                        >
                            {#if ($linkMapping[$linkSourceHeader[index]])}
                                {@html coloredDiff([
                                    col,
                                    $linkMapping[$linkSourceHeader[index]] === 'birthDate'
                                        ? dateFormat( row[$linkResults.header.indexOf(headerMapping[$linkMapping[$linkSourceHeader[index]]])])
                                        : row[$linkResults.header.indexOf(headerMapping[$linkMapping[$linkSourceHeader[index]]])]
                                ])}
                            {:else}
                                {col}
                            {/if}

                        </td>
                    {/if}
                {/each}
                <td class="hcenter">
                    {Math.round(row[$linkResults.header.indexOf('score')]*100)}%
                </td>
                <td
                    class="hcenter has-text-grey-light"
                >
                    <span
                        class:has-text-danger={row[$linkResults.header.indexOf('check')] === false}
                        class:is-hidden={(row.slice(-1)[0] !== rowSelect) && (row[$linkResults.header.indexOf('check')] !== false)}
                        on:click={() => {row[$linkResults.header.indexOf('check')] = check(row, false);}}
                    >
                        <FontAwesomeIcon icon={faWindowClose} class="is-lower"/>
                    </span>
                    {#if row.slice(-1)[0] === rowSelect}
                        &nbsp;
                    {/if}
                    <span
                        class:has-text-info={row[$linkResults.header.indexOf('check')] === true}
                        class:is-hidden={(row.slice(-1)[0] !== rowSelect) && (row[$linkResults.header.indexOf('check')] !== true)}
                        on:click={() => {row[$linkResults.header.indexOf('check')] = check(row, true);}}
                    >
                            <FontAwesomeIcon icon={faCheck} class="is-lower"/>
                    </span>
                </td>
            </tr>
        {/each}
        {#if displayRows.length > pageSize}
            <tr>
            {#each $linkSourceHeader as col}
                <td>...</td>
            {/each}
                <td>...</td><td>...</td>
            </tr>
        {/if}
    </table>
{/if}

<script>
    import { linkResults, resultsPerPage, linkStep, linkSourceHeader, linkMapping } from '../tools/stores.js';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import jsdiff from 'diff';
    import {
      faCheck,
      faWindowClose
    } from '@fortawesome/free-solid-svg-icons';


    export let page = 1;
    export let pageSize=5;
    export let filter;
    let displayRows;
    export let rowSelect;
    const headerMapping = {
        firstName: 'name first',
        lastName: 'name last',
        birthDate: 'birth date',
        birthCity: 'birth city',
        birthDepartment: 'birth departmentCode',
        birthCountry: 'birth country'
    };

    $: if ($linkResults) {
        displayRows = $linkResults.rows.map((r, index) => {
                const row = r.slice(0);
                row.push(index);
                return row;
            })
            .filter(row => applyFilter(row, filter))
    }

    const applyFilter = (row, filter) => {
        if (!filter) { return true }
        return Object.keys(filter).every(k => {
            return filter[k](row[$linkResults.header.indexOf(k)]);
        });
    }

    const check = (row, status) => {
        if (row[$linkResults.header.indexOf('check')] === status) {
            row[$linkResults.header.indexOf('check')] = 'check'
        } else {
            row[$linkResults.header.indexOf('check')] = status
        }
        linkResults.update(v => {
            v.rows[row.slice(-1)[0]][$linkResults.header.indexOf('check')] = row[$linkResults.header.indexOf('check')];
            return v;
        })
        return row[$linkResults.header.indexOf('check')];
    }

    const coloredDiff = (doubleArray) => {
        if (doubleArray.length !== 2) return 'Error => array\'s length must be 2'

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