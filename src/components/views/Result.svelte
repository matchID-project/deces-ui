{#if (result) && (result.error) }
    <div class="column is-12">
        <div class="card">
            <div class="card-header has-background-danger">
                <div class="container is-fluid">
                    <div class="columns is-vcentered is-multiline">
                        <div class="column is-3">
                            <FontAwesomeIcon icon={faExclamationTriangle} class="is-pulled-left is-huge"/>
                        </div>
                        <div class="column is-6">
                            <h1 className="has-text-white has-text-centered">Erreur {result.status}</h1>
                            <h1 subtitle className="has-text-white has-text-centered">
                                {result.statusText}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <div class="content">
                    {result.status === 429
                        ? "Le service est momentanément saturé, veuillez réessayer."
                        : "Erreur de service. Le service est en version alpha, à ce stade tous les cas d'erreur ne sont pas gérés. Si l'erreur perdure, veuillez nous contacter matchid.result@gmail.com"
                    }
                </div>
            </div>
        </div>
    </div>
{:else if (result)}
    <div class="column is-12">
        <div class="card has-text-centered">
            <div class="card-header has-background-primary">
                <div class="columns is-vcentered is-mobile is-multiline">
                    <div class="column is-3">
                        <figure class="image is-64x64">
                            <img
                                alt="64x64"
                                src={ result.SEXE.raw === 'M' ? '/male.svg' : '/female.svg' }
                            />
                        </figure>
                    </div>
                    <div class="column is-9">
                        <h1 class="title is-4 has-text-white">{result.PRENOM.raw} {result.NOM.raw}</h1>
                        <h1 class="subtitle is-6 has-text-white">
                            {result.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")}
                            &nbsp; - &nbsp;
                            {result.DATE_DECES.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")}
                        </h1>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <div class="content">
                    <div class="columns">
                        <div class="column is-6">
                            <span class="is-grey is-uppercase is-small">Naissance</span>
                            <table class="table is-narrow is-striped">
                                <tbody>
                                    <tr>
                                        <td>Nom</td>
                                        <td>{result.NOM.raw}</td>
                                    </tr>
                                    <tr>
                                        <td>Prénom(s)</td>
                                        <td>{result.PRENOMS.raw}</td>
                                    </tr>
                                    <tr>
                                        <td>Date</td>
                                        <td>{result.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")}</td>
                                    </tr>
                                    <tr>
                                        <td>Lieu</td>
                                        <td>
                                            {
                                                result.COMMUNE_NAISSANCE
                                                ? ( Array.isArray(result.COMMUNE_NAISSANCE.raw)
                                                    ? result.COMMUNE_NAISSANCE.raw[0]
                                                    : result.COMMUNE_NAISSANCE.raw)
                                                + ( result.DEPARTEMENT_NAISSANCE
                                                    ? " (" + result.DEPARTEMENT_NAISSANCE.raw + ")"
                                                    : "" )
                                                + ( result.PAYS_NAISSANCE
                                                    ? ", " + result.PAYS_NAISSANCE.raw
                                                    : "" )
                                                : (result.PAYS_NAISSANCE
                                                    ? result.PAYS_NAISSANCE.raw
                                                    : "ND")
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="column is-6">
                            <span class="is-grey is-uppercase is-small">Décès</span>
                            <table class="table is-narrow is-striped">
                                <tbody>
                                    <tr>
                                        <td>Date</td>
                                        <td>{result.DATE_DECES.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")}</td>
                                    </tr>
                                    <tr>
                                        <td>Lieu</td>
                                        <td>
                                            {
                                                result.COMMUNE_DECES
                                                ? ( Array.isArray(result.COMMUNE_DECES.raw)
                                                    ? result.COMMUNE_DECES.raw[0]
                                                    : result.COMMUNE_DECES.raw)
                                                + ( result.DEPARTEMENT_DECES
                                                    ? " (" + result.DEPARTEMENT_DECES.raw + ")"
                                                    : "" )
                                                + ( result.PAYS_DECES
                                                    ? ", " + result.PAYS_DECES.raw
                                                    : "" )
                                                : (result.PAYS_DECES
                                                    ? result.PAYS_DECES.raw
                                                    : "ND")
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Acte n°</td>
                                        <td>
                                            {
                                                result.NUM_DECES && result.NUM_DECES.raw
                                                ? result.NUM_DECES.raw
                                                : "ND"
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}


<script>

    import FontAwesomeIcon from './FontAwesomeIcon.svelte'

    import {
        faExclamationTriangle
    } from '@fortawesome/free-solid-svg-icons';

    export let result;

</script>

<style>

    .has-text-centered {
        text-align: center!important;
    }

    .has-text-white {
        color: #fff!important;
    }

    .has-background-primary {
        background-color: #00d1b2!important;
    }

    figure, h1, html, li, ul {
        margin: 0;
        padding: 0;
    }

    .image.is-64x64 {
    height: 64px;
    width: 64px;
    }

    .image img {
        display: block;
        height: auto;
        width: 100%;
    }

    img {
        height: auto;
        max-width: 100%;
    }

    h1 {
        font-size: 100%;
        font-weight: 400;
    }

    .content:not(:last-child),.subtitle:not(:last-child),.title:not(:last-child) {
        margin-bottom: 1.5rem;
    }

    .content table:not(:last-child) {
        margin-bottom: 1em;
    }

    .content table {
        width: 100%;
    }

    .content table td,.table td {
        border: solid #dbdbdb;
        border-width: 0 0 1px;
        padding: .5em .75em;
        vertical-align: top;
    }

    .content table tbody tr:last-child td,.content table tbody tr:last-child th,.table tbody tr:last-child td,.table tbody tr:last-child th {
        border-bottom-width: 0;
    }

    .subtitle,.title {
        word-break: break-word;
    }

    .title {
        color: #363636;
        font-size: 2rem;
        font-weight: 600;
        line-height: 1.125;
    }

    .subtitle:not(.is-spaced)+.title,.title:not(.is-spaced)+.subtitle {
        margin-top: -1.25rem;
    }

    .title.is-4 {
        font-size: 1.5rem;
    }

    .subtitle {
        color: #4a4a4a;
        font-size: 1.25rem;
        font-weight: 400;
        line-height: 1.25;
    }

    .subtitle.is-6 {
        font-size: 1rem;
    }

    .table:not(:last-child) {
        margin-bottom: 1.5rem;
    }

    .table {
        background-color: #fff;
        color: #363636;
    }

    .table tbody {
        background-color: transparent;
    }

    .table.is-fullwidth {
        width: 100%;
    }

    .table.is-narrow td {
        padding: .25em .5em;
        text-align: left;
    }

    .table.is-striped tbody tr:not(.is-selected):nth-child(2n) {
        background-color: #fafafa;
    }

    .card {
        background-color: #fff;
        box-shadow: 0 2px 3px rgba(10,10,10,.1),0 0 0 1px rgba(10,10,10,.1);
        color: #4a4a4a;
        max-width: 100%;
        position: relative;
    }

    .card-content,.card-header {
        background-color: transparent;
    }

    .card-header {
        align-items: stretch;
        box-shadow: 0 1px 2px rgba(10,10,10,.1);
        display: flex;
    }

    .card-content {
        padding: 1.5rem;
    }

    .column {
        display: block;
        flex-basis: 0;
        flex-grow: 1;
        flex-shrink: 1;
        padding: .75rem;
    }

    .columns.is-mobile>.column.is-3 {
        flex: none;
        width: 25%;
    }

    .columns.is-mobile>.column.is-9 {
        flex: none;
        width: 75%;
    }

    @media print,screen and (min-width:769px) {
        .column.is-3 {
            flex: none;
            width: 25%;
        }

        .column.is-6 {
            flex: none;
            width: 50%;
        }

        .column.is-9 {
            flex: none;
            width: 75%;
        }

        .column.is-12 {
                flex: none;
                width: 100%;
        }
    }

    .columns {
        margin-left: -.75rem;
        margin-right: -.75rem;
        margin-top: -.75rem;
    }

    .columns:last-child {
        margin-bottom: -.75rem;
    }

    .columns:not(:last-child) {
        margin-bottom: .75rem;
    }

    .columns.is-mobile {
        display: flex;
    }

    .columns.is-multiline {
        flex-wrap: wrap;
    }

    .columns.is-vcentered {
        align-items: center;
    }

    @media print,screen and (min-width:769px) {
        .columns:not(.is-desktop) {
            display: flex;
        }
    }


</style>