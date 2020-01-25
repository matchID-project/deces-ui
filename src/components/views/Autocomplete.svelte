import React from "react";

import {
  Container,
  Table
} from 'react-bulma-components';



function CustomAutocompleteView({
  autocompletedResults,
  getItemProps,
}) {
  return (
    <div className="sui-search-box__autocomplete-container" style={{display: "block"}}>
      <Container style={{marginLeft: "15px", marginTop: "-20px"}} className="is-widescreen">
        <span className="is-uppercase is-size-7 is-small has-text-grey">
          Résultats
        </span>

        <Table className="is-narrow">
          <thead>
            <tr className="is-uppercase">
              <td className="is-size-7 is-small has-text-grey"> Prénom Nom </td>
              <td className="is-size-7 is-small has-text-grey"> Naissance </td>
              <td className="is-size-7 is-small has-text-grey"> Décès </td>
            </tr>
          </thead>
          <tbody>
            {!!autocompletedResults && autocompletedResults.map((result, i) => (
              <tr className="is-size-7 is-hoverable"
                {...getItemProps({
                  key: result.id.raw,
                  index: i,
                  item: result
                })}
              >
                <td>
                  {result.PRENOM.raw} {result.NOM.raw}
                </td>
                <td>
                  {result.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")
                  } {
                  result.COMMUNE_NAISSANCE
                  ? "- " + result.COMMUNE_NAISSANCE.raw
                  : result.PAYS_NAISSANCE
                    ? "- " + result.PAYS_NAISSANCE.raw
                    : ""
                  }
                </td>
                <td>
                  {result.DATE_DECES.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")
                  } {
                    result.COMMUNE_DECES
                    ? "- " + result.COMMUNE_DECES.raw
                    : result.PAYS_DECES
                      ? "- " + result.PAYS_DECES.raw
                      : ""
                    }
                </td>
              </tr>
              )
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default CustomAutocompleteView;

