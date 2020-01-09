import React from "react";

import {
  Button,
  Columns,
  Container
} from 'react-bulma-components';

import { SearchBox } from "@elastic/react-search-ui";
import CustomAutocompleteView from "./CustomAutocompleteView";

const gatherSearchTerm = (id, searchParams) => {
  let searchTerm = searchParams.inputs.map((input) => {
    const value = document.getElementById(`${id}-${input.field}`)
                ? document.getElementById(`${id}-${input.field}`).value
                : "";
    return (input.field === "fullText")
           ? value
           : `${input.field}:${value.replace(/\s+/,"_")}`
  }).join(" ");
  return searchTerm;
}

const updateSearchTerm = (id, field, value) => {
  let searchTerm = document.getElementById(id) ? document.getElementById(id).value : ""
  let query = parseSearchTerm(searchTerm)
  query[field] = value
  return Object.keys(query).map((key) => (key === "fullText")
                                  ? query[key]
                                  : (query[key]
                                    ? `${key}:${query[key].replace(/\s+/,"_")}`
                                    : "")
                                ).join(" ");
}

const parseSearchTerm = (searchTerm) => {
  let query = {
    fullText: searchTerm.split(/\s+/).filter(s => !s.includes(":")).join(" ")
  }
  searchTerm.split(/\s+/).filter(s => s.includes(":")).map((s) => {
    s = s.split(':')
    query[s[0]] = s[1].replace(/_/," ")
  })
  return query
}

const dispatchSearchTerm = (id, searchTerm) => {
  const query = parseSearchTerm(searchTerm)
  Object.keys(query).map((key)=> {
    try {
      document.getElementById(`${id}-${key}`).value = query[key]
    } catch (e) {
      console.log(`Error while dispatching ${key}`, e)
    }
  })
}

export default function CustomSearchBox({searchParams, setSearchTerm}) {
    return (
    <SearchBox
        focus={true}
        autocompleteMinimumCharacters={3}
        autocompleteSuggestions={true}
        autocompleteView={CustomAutocompleteView}
        inputView={({ openMenu, getAutocomplete, getInputProps }) => {
          const { onChange, id } = getInputProps();
          let query = {};
          searchParams.inputs.forEach((input) => {
            query[input.field] = "";
          });
          if (document.getElementById(id)) {
            dispatchSearchTerm(id, document.getElementById(id).value)
          }
          return(
            <Container className="column is-6" style={{marginTop: "-15px"}}>
              <Columns className="is-vcentered">
                <Columns.Column size={9}>
                  <input
                      {...getInputProps({})}
                      onChange ={(e) => {
                        // dispatchSearchTerm(id, e.currentTarget.value);
                        onChange(e)
                        }}
                      className="is-size-5 is-fullwidth"
                      style={{display: "block", height: "2.35em", width:"100%"}}
                  />
                  <Columns>
                  { !!searchParams.inputs
                    && searchParams.inputs.map((input) => {
                      return (
                        <Columns.Column
                          key={`${id}-${input.field}`}
                          size={input.size}
                        >
                                  <input
                                    autoComplete="off"
                                    id={`${id}-${input.field}`}
                                    placeholder= {input.placeholder}
                                    onChange={(e) => {
                                      setSearchTerm(e.currentTarget.value, {autocompleteSuggestions: true, refresh: false})
                                      openMenu();
                                    }}

                                    className={`is-size-5 is-fullwidth`}
                                    style={{height: "2.35em",width:"100%"}}
                                 />
                        </Columns.Column>
                    )}
                  )
                  }
                  </Columns>
                </Columns.Column>
                <Columns.Column size={3}>
                {getAutocomplete()}
                  <Button
                    className="is-size-5 is-fullwidth"
                    color="info"
                  >
                    Recherche
                  </Button>
                </Columns.Column>
              </Columns>
            </Container>
          )
        }
      }
        onSelectAutocomplete={(selection) => {
          setSearchTerm(selection.PRENOM.raw + " " + selection.NOM.raw + " " +
            selection.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")
          )
        }}
    />
  )}