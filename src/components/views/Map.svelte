<svelte:window on:resize={resize} />
<div class="map" bind:this={mapContainer}>
  <div class="control">
    {#each Object.keys(possibleLayers) as layer, index}
        <span
            style={`color: ${layerParams[layer].color};`}
            on:click|preventDefault={(e) => {toggleLayer(layer)}}
        >
            { displayLayers.includes(possibleLayers[layer]) ? '☑️':'☐' } {possibleLayers[layer]}
        </span>
        <br/>
    {/each}
  </div>
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
  let currentLayer;
  let lifeLayer;
  let birthLayer;
  let deathLayer;
  let scale;
  const maxBase = 10000;
  const possibleLayers = {
      birth: 'naissance',
      death: 'décès'
  };
  let layerParams;
  let displayLayers = [possibleLayers.birth, possibleLayers.death];
  let showResult;
  let forceExpand = false;
  let control;

  export let center = [46.5, 2.3];
  export let zoom = 6;
  import {
    searchResults,
    searchInput,
    autocompleteBypass,
    resultsPerPage
  } from "../tools/stores.js";

  $: updateDisplay(displayLayers);
  $: updateDisplay(layerParams);
  $: scale = leafletMap &&  (leafletMap.getZoom() ** 1.5) * 0.05 * (2 - Math.log(Math.max(1, $searchResults.length))/Math.log(maxBase)) ** 3;
  $: layerParams = {
      birth: {
          color:'#00d1b2',
          opacity: 0.8,
          radius: 1.5 * scale,
          weight: scale
      },
      death: {
          color: '#ff3860',
          opacity: 0.8,
          radius: 2 * scale,
          weight: scale
      },
      life: {
          color: '#209cee',
          opacity: 0.3,
          weight: scale
      }
  }

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
    leafletMap.on('zoomend', e => {
        scale = leafletMap &&  (leafletMap.getZoom() ** 1.5) * 0.05 * (2 - Math.log(Math.max(1, $searchResults.length))/Math.log(maxBase)) ** 3;
    });
    resize();
  });

  const resize = () => {
    leafletMap.invalidateSize();
  };

  const toggleLayer = (layer) => {
      console.log('ici',layer);
      displayLayers=Object.keys(possibleLayers).map((l)  => {
          if (l === layer) {
            if (!displayLayers.includes(possibleLayers[layer])) {
                console.log('la',l,layer);
                return possibleLayers[l];
            }
          } else {
              if (displayLayers.includes(possibleLayers[l])
                    || ((displayLayers.includes(possibleLayers[layer])
                        && (displayLayers.length === 1)))) {
                    console.log('hop',l,layer);
                    return possibleLayers[l];
              }
          }
      }).filter(x => x);
  }

  $: if ($searchResults) {
    showResult = undefined;
  }

  const updateDisplay = (arg) => {
    if (!leafletMap) {
      return;
    }
    if (displayLayers.includes(possibleLayers.birth) && displayLayers.includes(possibleLayers.death)) {
        if ((arg !== displayLayers) || !lifeLayer) { // do not compute if already exists
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
                    layerParams.life
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
        }
    } else {
        if (arg !== displayLayers) { // purge cache if update due to searchUpdate
            lifeLayer = undefined;
        }
    }
    if (displayLayers.includes(possibleLayers.birth)) {
        if ((arg !== displayLayers) || !birthLayer) { // do not compute if already exists
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
                    layerParams.birth
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
        }
    } else {
        if (arg !== displayLayers) { // purge cache if update due to searchUpdate
            birthLayer = undefined;
        }
    }
    if (displayLayers.includes(possibleLayers.death)) {
        if ((arg !== displayLayers) || !birthLayer) { // do not compute if already exists
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
                    layerParams.death,
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
        }
    } else {
        if (arg !== displayLayers) { // purge cache if update due to searchUpdate
            deathLayer = undefined;
        }
    }
    currentLayer && currentLayer.remove();
    if (displayLayers.length == 2) {
        currentLayer = L.layerGroup([lifeLayer, birthLayer, deathLayer]).addTo(leafletMap);
    } else if (displayLayers.includes(possibleLayers.birth)) {
        currentLayer = birthLayer.addTo(leafletMap);
    } else {
        currentLayer = deathLayer.addTo(leafletMap);
    }
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
    top: 0;
    right: 0;
    margin-right: 10px;
    margin-top: 80px;
    position: absolute;
    z-index: 1150;
    padding: 6px 12px;
    border: 2px dotted #38f;
    background: rgba(255,255,255,0.5);
    color: #333;
    border-radius: 4px;
    pointer-events: visiblePainted; /* IE 9-10 doesn't have auto */
	pointer-events: auto;
    font-size: 1rem;
    font-weight: 600;
    text-indent: 1px;

  }

@media print,screen and (max-width:768px) {
    .hide-mobile {
        display: None;
    }
  }
</style>
