import React from "react";

import {
  Card,
  Columns,
  Content,
  Container,
  Heading,
  Image,
  Table
} from 'react-bulma-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

export default function CustomResult({result}) {
    if (result.error) {
        return (
            <Columns.Column size={12}>
            <Card>
                <Card.Header className="has-background-danger">
                    <Container className="is-fluid">
                    <Columns className="is-vcentered">
                        <Columns.Column size={3}>
                            <FontAwesomeIcon icon={faExclamationTriangle} size="4x" className="is-pulled-left"/>
                        </Columns.Column>
                        <Columns.Column size={6}>
                            <Heading className="has-text-white has-text-centered">Erreur {result.status.raw}</Heading>
                            <Heading subtitle className="has-text-white has-text-centered">
                                {result.statusText.raw}
                            </Heading>
                        </Columns.Column>
                    </Columns>
                    </Container>
                </Card.Header>
                <Card.Content>
                    <Content>
                        {result.status.raw === 429
                            ? "Le service est momentanément saturé, veuillez réessayer."
                            : "Erreur de service. Le service est en version alpha, à ce stade tous les cas d'erreur ne sont pas gérés. Si l'erreur perdure, veuillez nous contacter matchid.result@gmail.com"
                        }
                    </Content>
                </Card.Content>
            </Card>
        </Columns.Column>
        )
    } else {
        return (
            <Columns.Column size={12}>
                <Card>
                    <Card.Header className="has-background-primary">
                        <Columns className="is-vcentered is-mobile">
                            <Columns.Column size={3}>
                                <Image
                                    size={64} alt="64x64"
                                    src={ result.SEXE.raw === 'M' ? '/male.svg' : '/female.svg' }
                                />
                            </Columns.Column>
                            <Columns.Column size={9} >
                                <Heading size={4} className="has-text-white">{result.PRENOM.raw} {result.NOM.raw}</Heading>
                                <Heading subtitle size={6} className="has-text-white">
                                    {result.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")}
                                    &nbsp; - &nbsp;
                                    {result.DATE_DECES.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")}
                                </Heading>
                            </Columns.Column>
                        </Columns>
                    </Card.Header>
                    <Card.Content>
                        <Content>
                            <Columns>
                                <Columns.Column size={6}>
                                    <span className="is-grey is-uppercase is-small">Naissance</span>
                                    <Table className="is-narrow">
                                        <tbody>
                                            <tr>
                                                <td>Nom</td>
                                                <td>{result.NOM.raw}</td>
                                            </tr>
                                            <tr>
                                                <td>Prénoms</td>
                                                <td>{result.PRENOMS.raw}</td>
                                            </tr>
                                            <tr>
                                                <td>Date</td>
                                                <td>{result.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")}</td>
                                            </tr>
                                            <tr>
                                                <td>Lieu</td>
                                                <td>
                                                    {result.COMMUNE_NAISSANCE
                                                    ? result.PAYS_NAISSANCE
                                                        ? result.COMMUNE_NAISSANCE.raw + ", " + result.PAYS_NAISSANCE.raw
                                                        : result.COMMUNE_NAISSANCE
                                                    : result.PAYS_NAISSANCE
                                                        ? result.PAYS_NAISSANCE.raw
                                                        : "ND"
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Columns.Column>
                                <Columns.Column size={6}>
                                    <span className="is-grey is-uppercase is-small">Décès</span>
                                    <Table className="is-narrow">
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
                                                    ? ( result.PAYS_DECES
                                                        ? result.COMMUNE_DECES.raw + ", " + result.PAYS_DECES.raw
                                                        : result.COMMUNE_DECES.raw )
                                                    : (result.PAYS_DECES
                                                        ? result.PAYS_DECES.raw
                                                        : "ND")
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Columns.Column>
                            </Columns>
                        </Content>
                    </Card.Content>
                </Card>
            </Columns.Column>
        )
    }
}


