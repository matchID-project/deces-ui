<script>
  import L from "leaflet";

  import { onMount, getContext } from "svelte";
  import { fade } from 'svelte/transition';
  import { searchTyping, waitSearch, maxResultsPerPage } from "../tools/stores.js";
  import getDataGouvCatalog from "../tools/getDataGouvCatalog.js";
  import Result from "./Result.svelte";
  import SearchBox from "./SearchBox.svelte";
  import FontAwesomeIcon from "./FontAwesomeIcon.svelte";

  import { faSpinner } from "@fortawesome/free-solid-svg-icons";

  let mapContainer;
  let leafletMap;
  let birthLayer;
  let deathLayer;
  let lifeLayer;
  let displayLayers = [lifeLayer, birthLayer, deathLayer];
  let showResult;
  let forceExpand = false;
  let control;

  export let center = [46.5, 2.3];
  export let zoom = 6;
  // const headerHeight = getContext ('headerHeight');
  import {
    searchResults,
    searchInput,
    autocompleteBypass,
    resultsPerPage
  } from "../tools/stores.js";

  $: display(displayLayers);

  onMount(() => {
    getDataGouvCatalog();
    $resultsPerPage = $maxResultsPerPage;
    leafletMap = L.map(mapContainer, {
      svgSprite: false,
      preferCanvas: true,
      zoomControl: false,
      center: center,
      zoom: zoom
    });
    leafletMap.doubleClickZoom.disable();
    L.control.zoom({
        position: 'topright'
    }).addTo(leafletMap);
    resize();
  });

  const display = layers => {
    layers.map(layer => layer && layer.addTo(leafletMap));
    [lifeLayer, birthLayer, deathLayer].map(
      layer => layers.includes(layer) || (layer && layer.remove())
    );
  };

  const resize = () => {
    leafletMap.invalidateSize();
  };

  $: updateResults($searchResults);

  $: if ($searchResults) {
    showResult = undefined;
  }

  const updateResults = useless => {
    if (!leafletMap) {
      return;
    }
    let oldLayers = [lifeLayer, birthLayer, deathLayer].filter(x => x);
    lifeLayer = L.layerGroup(
      $searchResults
        .filter(
          result =>
            result.birth &&
            result.birth.location &&
            result.birth.location.latitude &&
            result.birth.location.longitude &&
            result.death &&
            result.death.location &&
            result.death.location.latitude &&
            result.death.location.longitude
        )
        .map(result => {
          return L.polyline(
            [
              [result.birth.location.latitude, result.birth.location.longitude],
              [result.death.location.latitude, result.death.location.longitude]
            ],
            {
              color: "#209cee",
              opacity: 0.3,
              weight: 1
            }
          )
            .on("mouseover", e => {
              forceExpand = false;
              showResult = result;
            })
            .on("click", e => {
              forceExpand = true;
              showResult = result;
            });
        })
    );
    birthLayer = L.layerGroup(
      $searchResults
        .filter(
          result =>
            result.birth &&
            result.birth.location &&
            result.birth.location.latitude &&
            result.birth.location.longitude
        )
        .map(result => {
          return L.circleMarker(
            [result.birth.location.latitude, result.birth.location.longitude],
            {
              color: "#00d1b2",
              opacity: 0.8,
              radius: 1.5,
              weight: 1
            }
          )
            .on("mouseover", e => {
              forceExpand = false;
              showResult = result;
            })
            .on("click", e => {
              forceExpand = true;
              showResult = result;
            });
        })
    );
    deathLayer = L.layerGroup(
      $searchResults
        .filter(
          result =>
            result.death &&
            result.death.location &&
            result.death.location.latitude &&
            result.death.location.longitude
        )
        .map(result => {
          return L.circleMarker(
            [result.death.location.latitude, result.death.location.longitude],
            {
              color: "#ff3860",
              opacity: 0.8,
              radius: 2,
              weight: 1
            }
          )
            .on("mouseover", e => {
              forceExpand = false;
              showResult = result;
            })
            .on("click", e => {
              forceExpand = true;
              showResult = result;
            });
        })
    );
    oldLayers && oldLayers.map(x => x.remove());
    lifeLayer = L.layerGroup([lifeLayer, birthLayer, deathLayer]);
    // lifeLayer && lifeLayer.addTo(leafletMap);
    // birthLayer && birthLayer.addTo(leafletMap);
    // deathLayer && deathLayer.addTo(leafletMap);
    control && control.remove();
    control = L.control
      .layers(
        {
          décès: deathLayer,
          naissances: birthLayer,
          "naissances et décès": lifeLayer
        },
        {}
      )
      .addTo(leafletMap);
    lifeLayer.addTo(leafletMap);
  };

  const renderTooltip = result => {
    return (
      `<b>${
        result.name && result.name.last ? result.name.last.toUpperCase() : aucun
      } ` +
      `${
        result.name && result.name.first ? result.name.first.join(" ") : aucun
      } </b><br/>` +
      `naissance: ${dateFormat(result.birth.date)} ${cityString(
        result.birth.location.city
      )} <br/>` +
      `décès: ${dateFormat(result.death.date)} ${cityString(
        result.death.location.city
      )}`
    );
  };

  const cityString = city => {
    return city
      ? Array.isArray(city)
        ? city.some(x => !x.match(/arrondissement/i))
          ? city.filter(x => !x.match(/arrondissement/i))[0]
          : city[0]
        : city
      : "";
  };

  const dateFormat = dateString => {
    return dateString.replace(/(\d{4})(\d{2})(\d{2})/, "$3/$2/$1");
  };
</script>

<style>
  .map {
    height: 75vh;
    width: 100%;
  }

  .wait {
    width: 100%;
    height: 600px;
    z-index: 1150;
    position: absolute;
    background: rgba(255, 255, 255, 0.5);

  -webkit-transition: background .5s ease-out;
     -moz-transition: background .5s ease-out;
       -o-transition: background .5s ease-out;
          transition: background .5s ease-out;

  }

  .wait-center {
      text-align: center;
      transform: translateY(-50%);
      margin-top: 300px;
  }

  .search {
    width: 100%;
    bottom: 8px;
  }

  .leaflet-top-of {
    z-index: 1150;
    position: absolute;
  }

  @media print,screen and (max-width:768px) {
    .result {
        width: 100%;
        display: flex;
    }
  }

  @media print,screen and (min-width:769px) {
    .result {
        width: 95%;
        display: flex;
    }
  }

  .control {
    margin: 64px;
    padding: 12px;
    background-color: white;
    border-color: black;
    color: black;
    border-width: 1px;
    border: 1px solid;
    border-radius: 4px;
  }

@media print,screen and (max-width:768px) {
    .hide-mobile {
        display: None;
    }
  }
</style>

<svelte:window on:resize={resize} />
<div class="map" bind:this={mapContainer}>
  {#if $waitSearch}
    <div class="wait" in:fade>
        <div class="wait-center">
            <FontAwesomeIcon icon={faSpinner} class="icon is-48" spin={true}/>
        </div>
    </div>
  {/if}
  <slot />
  <div class="search leaflet-top-of bottom hide-mobile">
    <SearchBox/>
  </div>
  {#if showResult}
    <div
      class="result leaflet-top-of"
      style={forceExpand ? 'height: 600px;' : ''}
      on:click|preventDefault={e => {
        forceExpand = !forceExpand;
      }}>
      <Result result={showResult} {forceExpand} />
    </div>
  {/if}
</div>
