<svelte:window on:resize={resize} />
<div class="map" bind:this={mapContainer}>
  <div class="control rf-padding-bottom-0">
    {#each Object.keys(possibleLayers) as layer, index}
        <span
            on:click|preventDefault={(e) => {toggleLayer(layer)}}
        >
            <input
              id={possibleLayers[layer]}
              type="checkbox"
              checked={displayLayers.includes(possibleLayers[layer])}
            >
            <label
              class="rf-label rf-padding-0" for={possibleLayers[layer]}
              style={`color: ${layerParams[layer].color};`}
            >
              {possibleLayers[layer]}
            </label>
        </span>
        <br/>
    {/each}
  </div>
  {#if $waitSearch}
    <div class="wait" in:fade out:fade>
        <div class="wait-center">
            <Icon icon="ri:loader-line" class="rf-fi--xxl rf-margin-top-1N" spin center/>
        </div>
    </div>
  {/if}
  <slot />
  <div
    class="fullscreen-link leaflet-top-of bottom"
    on:click|preventDefault={toggleFullScreen}
  >
    {#if isFull}
        Cliquez ici pour sortir du plein écran
    {:else}
        Cliquez ici pour le plein écran
    {/if}
  </div>

  {#if showResult}
    <div
      class="result leaflet-top-of"
      style={forceExpand ? 'height: 600px;' : ''}
      on:click|preventDefault={e => {
        forceExpand = !forceExpand;
      }}>
      <ResultCard result={showResult} {forceExpand} />
    </div>
  {/if}
</div>

<script>
  import L from "leaflet";

  import { onMount, getContext } from "svelte";
  import { fade } from 'svelte/transition';
  import { searchTyping, waitSearch, maxResultsPerPage, displayMode } from "../tools/stores.js";
  import getDataGouvCatalog from "../tools/getDataGouvCatalog.js";
  import ResultCard from "./ResultCard.svelte";
  import ResultsHeader from './ResultsHeader.svelte';
  import SearchBox from "./SearchBox.svelte";
  import Icon from "./Icon.svelte";

  let mapContainer;
  let leafletMap;
  let currentLayer;
  let lifeLayer;
  let birthLayer;
  let deathLayer;
  let scale;
  let isFull = false;
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

  export let center = [47, 2.3];
  export let zoom = 6;
  import {
    searchResults,
    searchInput,
    resultsPerPage
  } from "../tools/stores.js";

  $: scale = leafletMap &&  (leafletMap.getZoom() ** 1.5) * 0.05 * (2 - Math.log(Math.max(1, $searchResults.length))/Math.log(maxBase)) ** 3;
  $: layerParams = {
      birth: {
          color:'var(--bf500)',
          opacity: 0.8,
          radius: 1.5 * scale,
          weight: scale,
          pane: 'birth'
      },
      death: {
          color: 'var(--rm500)',
          opacity: 0.8,
          radius: 2 * scale,
          weight: scale,
          pane: 'death'
      },
      life: {
          color: '#209cee',
          opacity: 0.3,
          weight: scale,
          pane: 'overlayPane'
      }
  }
  $: drawLayers(layerParams);


  onMount(() => {
    getDataGouvCatalog();
    if ($displayMode) {$displayMode = 'geo'};
    $resultsPerPage = $maxResultsPerPage;
    leafletMap = L.map(mapContainer, {
      svgSprite: false,
      preferCanvas: false,
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
    leafletMap.getPane('overlayPane').style.zIndex = 650;
    leafletMap.createPane('birth');
    leafletMap.getPane('birth').style.zIndex = 700;
    leafletMap.createPane('death');
    leafletMap.getPane('death').style.zIndex = 750;
    resize();
  });

  const toggleFullScreen = () => {
      if (isFull) {
          exitFullscreen();
      } else {
          requestFullscreen()
      }
      isFull = !isFull
  }

  const requestFullscreen = () => {
    const requestFS = (
      mapContainer.requestFullscreen ||
      mapContainer.mozRequestFullScreen ||
      mapContainer.webkitRequestFullscreen ||
      mapContainer.msRequestFullscreen ||
      noop
    ).bind(mapContainer);
    requestFS();
  };

  const exitFullscreen = (
    document.exitFullscreen ||
    document.mozCancelFullScreen ||
    document.webkitExitFullscreen ||
    document.msExitFullscreen ||
    noop
  ).bind(document);

  const resize = () => {
    leafletMap.invalidateSize();
  };

  const toggleLayer = (layer) => {
      displayLayers=Object.keys(possibleLayers).map((l)  => {
          if (l === layer) {
            if (!displayLayers.includes(possibleLayers[layer])) {
                return possibleLayers[l];
            }
          } else {
              if (displayLayers.includes(possibleLayers[l])
                    || ((displayLayers.includes(possibleLayers[layer])
                        && (displayLayers.length === 1)))) {
                    return possibleLayers[l];
              }
          }
      }).filter(x => x);
      if (displayLayers.length === 2) {
          leafletMap.getPane('overlayPane').style.display='block';
      } else {
          leafletMap.getPane('overlayPane').style.display='none';
      }
      Object.keys(possibleLayers).map(layer => {
        if (displayLayers.includes(possibleLayers[layer])) {
          leafletMap.getPane(`${layer}`).style.display='block';
        } else {
          leafletMap.getPane(`${layer}`).style.display='none';
        }
      });
  }

  $: if ($searchResults) {
    showResult = undefined;
  }

  const drawLayers = (arg) => {
    if (!leafletMap) {
      return;
    }
    let oldLayers= [lifeLayer, birthLayer, deathLayer];
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
    oldLayers.map(l => l && l.remove());
    lifeLayer.addTo(leafletMap);
    birthLayer.addTo(leafletMap);
    deathLayer.addTo(leafletMap);
  };

</script>

<style>
  .map {
    height: 75vh;
    width: 100%;
  }

  .wait {
    width: 100%;
    height: 100vh;
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

  .fullscreen-link {
    width: 100%;
    bottom: 0;
    margin-left: 4px;
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
        width: calc(100% - 190px);
        display: flex;
    }
  }

  .control {
    top: 0;
    right: 0;
    margin-top: 10px;
    margin-right: 60px;
    position: absolute;
    z-index: 1100;
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
