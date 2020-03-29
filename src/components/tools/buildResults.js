export default function buildResults (response, resultsPerPage, current, ) {
    const filteredResults = response.hits.hits.map(item => {
      return {
        score: item._score,
        source: item._source.SOURCE,
        id: item._id,
        name: {
          first: item._source.PRENOMS.split(' '),
          last: item._source.NOM
        },
        sex: item._source.SEXE,
        birth: {
          date: item._source.DATE_NAISSANCE,
          location: {
            city: item._source.COMMUNE_NAISSANCE,
            cityCode: item._source.CODE_INSEE_NAISSANCE,
            departmentCode: item._source.DEPARTEMENT_NAISSANCE,
            country: item._source.PAYS_NAISSANCE,
            countryCode: item._source.PAYS_NAISSANCE_CODEISO3
          }
        },
        death: {
          date: item._source.DATE_DECES,
          certificateId: item._source.NUM_DECES,
          location: {
            city: item._source.COMMUNE_DECES, // str|str[]
            cityCode: item._source.CODE_INSEE_DECES,
            departmentCode: item._source.DEPARTEMENT_DECES,
            country: item._source.PAYS_DECES,
            countryCode: item._source.PAYS_DECES_CODEISO3
          }
        }
      }
    });
    return {
      response: {
        total: response.hits.total.value,
        maxScore: response.hits.max_score,
        size: resultsPerPage,
        page: current,
        delay: response.took,
        persons: filteredResults
      }
    }
  }
