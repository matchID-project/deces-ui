<span
    on:click={download}
>
    télécharger les résulats
     <FontAwesomeIcon icon={faFileDownload} class="is-lower"/>
</span>
<script>
    import { onMount } from 'svelte';
    import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
    import FontAwesomeIcon from './FontAwesomeIcon.svelte';
    import { ReadableStream, WritableStream, TransformStream } from 'web-streams-polyfill/ponyfill';
    import streamSaver from 'streamsaver';
    import { searchInput, searchResults, maxResultsPerPage } from '../tools/stores.js';
    import buildRequest from '../tools/buildRequest.js';
    import runRequest from '../tools/runRequest.js';

    streamSaver.ReadableStream = ReadableStream;
    streamSaver.WritableStream = WritableStream;
    streamSaver.TransformStream = TransformStream;
    streamSaver.mitm = 'https://matchid.io/mitm/mitm.html';

    const fileName = () => {
        return `deces-${Object.keys($searchInput).map(k => {
            return ($searchInput[k].value && $searchInput[k].value.replace(/\s+/,"_")) || undefined;
        }).filter(x => x).join('-')}.csv`;
    };


    const cityString = (city) => {
        return city
            ? ( Array.isArray(city)
                ? (city.some(x => x.match(/arrondissement/i))
                    ? city.filter(x => x.match(/arrondissement/i))[0]
                    : city[0])
                : city)
            : ''
    };

    const dateFormat = (dateString) => {
        return dateString.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1");
    };

    const csvRow = (row) => {
        return `${row.name.last || ''};${(row.name.first && row.name.first.join(' ')) || ''};${row.sex};`+
            `${dateFormat(row.birth.date)};${cityString(row.birth.location.city || '')};${row.birth.location.cityCode || ''};${row.birth.location.departmentCode || ''};${row.birth.location.country || ''};${row.birth.location.countryCode || ''};`+
            `${dateFormat(row.death.date)};${row.death.age};${cityString(row.death.location.city || '')};${row.death.location.cityCode || ''};${row.death.location.departmentCode || ''};${row.death.location.country || ''};${row.death.location.countryCode || ''};${row.death.certificateId || ''};${row.source};`;
     }

    const toCsv = (searchResults) => {
        if (searchResults && Array.isArray(searchResults)) {
            return searchResults.map(row => csvRow(row)).join('\n') + '\n';
        }
    }

    const csvHeader = 'nom;prénoms;sexe;' +
        'date_naissance;commune_naissance;code_INSEE_naissance;département_naissance;pays_naissance;pays_ISO_naissance;'+
        'date_décès;age_décès;commune_décès;code_INSEE_décès;département_décès;pays_décès;pays_ISO_décès;num_décès;source_INSEE\n';

    const searchNext = async (state) => {
        console.log(state);
        const page = state.page;
        const size = state.size;
        let request = buildRequest($searchInput, {page: page, size: size, scrollId: state.scrollId});
        state = await runRequest(request);
        return {
            total: state.response.total,
            searchResults: state.response.persons,
            scrollId: state.response.scrollId,
            size: size,
            page: page + 1
        };
    }

    const download = async () => {
        const fileStream=streamSaver.createWriteStream(fileName());
        const writer = fileStream.getWriter();
        const encoder = new TextEncoder();
        await writer.write(encoder.encode(csvHeader));
        let state ={
            total: $maxResultsPerPage + 1,
            page: 1,
            size: $maxResultsPerPage
        };
        while ((state.page - 1) * $maxResultsPerPage < state.total) {
            state = await searchNext(state);
            await writer.write(encoder.encode(toCsv(state.searchResults)));
        }
        writer.close();
    };

</script>
