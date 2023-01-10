<div style="position: relative">
    <svg {width} {height} viewBox="0 0 260 130">
        {#if view && geozones.length && data && Object.keys(index).length}
            <g>
            {#each geozones as geozone}
                <path
                    class="hoverable"
                    d={geozone.path}
                    id={geozone.id}
                    z-index=0
                    stroke="var(--bf500)"
                    stroke-width="0.1px"
                    fill="var(--bf500)"
                    on:mouseenter={()=> toggle(geozone.id)}
                    on:mouseleave={() => toggle(geozone.id)}
                    fill-opacity={scale(value(view, geozone.id), view)}
                />
            {/each}
            {#each geozones as geozone}
                <g
                    class="tooltip"
                    opacity={selected === geozone.id ? 0.9 : 0}
                >
                    <rect
                        x={(geozone.centroid[0] < 120) ? geozone.centroid[0] : geozone.centroid[0] - 100}
                        y={(geozone.centroid[1] < 80) ? geozone.centroid[1] : geozone.centroid[1] - 50}
                        width="100"
                        height="50"
                    />
                    <text
                        class="text"
                        text-anchor={(geozone.centroid[0] < 120) ? 'start' : 'end'}
                        y={(geozone.centroid[1] < 80) ? 10 + geozone.centroid[1] : geozone.centroid[1] - 40}
                    >
                            <tspan x={(geozone.centroid[0] < 120) ? 5 + geozone.centroid[0] : geozone.centroid[0] - 5}>{geozone.id}</tspan>
                            <tspan x={(geozone.centroid[0] < 120) ? 5 + geozone.centroid[0] : geozone.centroid[0] - 5} dy=10>{labels['visitors']}:{value('visitors', geozone.id)}</tspan>
                            <tspan x={(geozone.centroid[0] < 120) ? 5 + geozone.centroid[0] : geozone.centroid[0] - 5} dy=10>{labels['hits']}:{value('hits', geozone.id)}</tspan>
                            <tspan x={(geozone.centroid[0] < 120) ? 5 + geozone.centroid[0] : geozone.centroid[0] - 5} dy=10>{labels['bytes']}:{value('bytes', geozone.id)}</tspan>
                    </text>
                </g>
            {/each}
            </g>
        {/if}
    </svg>
    {#if views.length}
        <select
            class="rf-select rf-text--xs"
            style="position:absolute;bottom:60px;left:0;width:120px;"
            bind:value={view}
            id="view"
        >
            {#each views as v}
                <option>{v}</option>
            {/each}
        </select>
    {/if}
</div>

<script>
  import { onMount } from 'svelte';
  import geojson2svg from 'geojson2svg';
  import { activeElement } from '../tools/stores.js';

  export let width = "100%";
  export let height = undefined;
  export let data = undefined;
  export let options = undefined;
  let selected;
  let geojson;
  let max = {};
  let yLog = {};
  let labels = {};
  let layers = undefined;
  let geozones = [];
  let index = {};
  let scale =  (x, view) => x;
  let views = [];
  let view;

  const deactivateElement = () => {
      activeElement.update(v => {
          v && v.blur();
          return undefined;
      });
  }

  $: if (view) {
      deactivateElement();
  }

  const toggle = (id) => {
      if (id !== selected) {
          selected = id;
      } else {
          selected = undefined;
      }
  };

  $: if (data && data.labels) {
      index = {};
      data.labels.forEach((geozoneId, i)=> {
        index[geozoneId] = i;
      });
  };

  $: if (data && data.datasets) {
      views = [];
      data.datasets.forEach((ds, i) => {
        const id = ds.yAxisID;
        labels[id] = ds.label;
        index[id] = i;
        views.push(id);
        const sorted = ds.data.slice(0).sort((a, b) => +b.y - +a.y);
        max[id] = sorted.length ? sorted[0].y : 0;
        const secMax = sorted.length > 1 ? sorted[1].y : max[id];
        yLog[id] = (secMax < (max[id]/5)) ? true : false;
      });
      if (!view) {
        view = views[0];
      }
  }

  $: if (Object.keys(yLog).length) {
      scale = (x,id) => yLog[id] ?
                (max[id] ? Math.log(x+1)/Math.log(max[id]) : Math.log(x+1))
                : ( max[id] ? x/max[id] : x);
  };

  const converter = geojson2svg({
    viewportExtent: {width: width, height: height},
    mapExtent: {left: -180, bottom: -90, right: 180, top: 90},
    output: 'path'
  });

  $: if (geojson) {
      geozones = geojson.features.filter(feature => feature.geometry && feature.geometry.coordinates)
        .map(feature => {
            const geozone = {
                id: feature.id,
                path: converter.convert(feature)
            };
            `${geozone.path[0]}`.replace(/^M/,'').split(/\s+/).forEach(c => {
                c = c.split(/,/).map(x => parseInt(x));
                geozone.xmin = Math.min(c[0],geozone.xmin||99999);
                geozone.ymin = Math.min(c[1],geozone.ymin||99999);
                geozone.xmax = Math.max(c[0],geozone.xmax||-99999);
                geozone.ymax = Math.max(c[1],geozone.ymax||-99999);
            });
            geozone.centroid = [
                (geozone.xmin + geozone.xmax) / 2,
                (geozone.ymin + geozone.ymax) / 2,
            ];
            return geozone;
        });
  }

  const value = (view, id) => {
      const v = (index[id] !== undefined) ? data.datasets[index[view] || 0].data[index[id]] : 0;
      return v && v.y || 0;
  }

    onMount(async () => {
        try{
            const response = await fetch('/simple-world-map.json');
            geojson = await response.json();
        } catch(e) {
            console.log(e);
            console.log(response);
        }
  })
</script>

<style>

.hoverable:hover {
  stroke-width: 0.5px;
  cursor:pointer;
}

.tooltip {
    pointer-events:none;
    transition: opacity 0.3s;
}

.tooltip text {
    font-size: 7px;
}

g.tooltip rect {
    fill: var(--w);
    stroke: var(--bf500);
}


</style>
