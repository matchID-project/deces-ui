<div style="position:relative">
  <svg {width} {height} viewBox="-30 0 205 130">
      {#if view && departments.length && Object.keys(index).length}
          <g>
          {#each departments as department}
              <path
                  class="hoverable"
                  d={department.path}
                  id={department.id}
                  z-index=0
                  stroke="var(--bf500)"
                  stroke-width="0.1px"
                  fill="var(--bf500)"
                  on:mouseenter={()=> toggle(department.id)}
                  on:mouseleave={() => toggle(department.id)}
                  fill-opacity={scale(value(view, department.id), view)}
              />
          {/each}
          {#each departments as department}
              <g
                  class="tooltip"
                  opacity={selected === department.id ? 0.9 : 0}
              >
                  <rect
                      x={(department.centroid[0] < 80) ? department.centroid[0] : department.centroid[0] - 100}
                      y={(department.centroid[1] < 80) ? department.centroid[1] : department.centroid[1] - 50}
                      width="100"
                      height="30"
                  />
                  <text
                      class="text"
                      text-anchor={(department.centroid[0] < 80) ? 'start' : 'end'}
                      y={(department.centroid[1] < 80) ? 10 + department.centroid[1] : department.centroid[1] - 40}
                  >
                          <tspan x={(department.centroid[0] < 80) ? 5 + department.centroid[0] : department.centroid[0] - 5}>{department.name}</tspan>
                          <tspan x={(department.centroid[0] < 80) ? 5 + department.centroid[0] : department.centroid[0] - 5} dy=10>{labels[view]}: {value(view, department.id)}</tspan>
                  </text>
              </g>
          {/each}
          </g>
      {/if}
  </svg>
  {#if views.length}
    <select
      class="rf-select rf-text--xs"
      style="position:absolute;top:0;left:0;width:120px;"
      bind:value={view}
      on:change={deactivateElement}
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
  let selected;
  let geojson;
  let max = {};
  let yLog = {};
  let labels = {};
  let departments = [];
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

  const toggle = (id) => {
    if (id !== selected) {
      selected = id;
    } else {
      selected = undefined;
    }
  };

  $: if (data && data.labels) {
    index = {};
    data.labels.forEach((departmentId, i)=> {
      index[departmentId] = i;
    });
  };

  $: if (data && data.datasets) {
    views=[];
    data.datasets.forEach((ds, i) => {
      const id = ds.yAxisID;
      labels[id] = ds.label;
      index[id] = i;
      views.push(id);
      const sorted = ds.data.slice(0).sort((a, b) => +b.y - +a.y);
      max[id] = sorted[0].y;
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
    mapExtent: {
      left: -933595.44,
      right: 1507265.91,
      bottom: 2793547.46,
      top: 6809171.15
    },
    output: 'path'
  });

  $: if (geojson) {
      departments = geojson.features.filter(feature => feature.geometry && feature.geometry.coordinates)
        .map(feature => {
            const department = {
                id: feature.properties.code,
                name: feature.properties.nom,
                path: converter.convert(feature)
            };
            `${department.path[0]}`.replace(/^M/,'').split(/\s+/).forEach(c => {
                c = c.split(/,/).map(x => parseInt(x));
                department.xmin = Math.min(c[0],department.xmin||99999);
                department.ymin = Math.min(c[1],department.ymin||99999);
                department.xmax = Math.max(c[0],department.xmax||-99999);
                department.ymax = Math.max(c[1],department.ymax||-99999);
            });
            department.centroid = [
                (department.xmin + department.xmax) / 2,
                (department.ymin + department.ymax) / 2,
            ];
            return department;
        });
  }

  const value = (view, id) => {
    const v = (index[id] !== undefined) ? data.datasets[index[view]].data[index[id]] : 0;
    return v && v.y || 0;
  }

    onMount(async () => {
        try{
            const response = await fetch('/simple-french-departments-wdom.json');
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
