<svg {width} {height} viewBox="0 0 260 130">
    {#if countries.length && Object.keys(index).length}
        <g>
        {#each countries as country}
            <path
                class="hoverable"
                d={country.path}
                id={country.id}
                z-index=0
                stroke="var(--bf500)"
                stroke-width="0.1px"
                fill="var(--bf500)"
                on:mouseenter={()=> toggle(country.id)}
                on:mouseleave={() => toggle(country.id)}
                fill-opacity={scale(value(view, country.id), view)}
            />
        {/each}
        {#each countries as country}
            <g
                class="tooltip"
                opacity={selected === country.id ? 0.9 : 0}
            >
                <rect
                    x={(country.centroid[0] < 120) ? country.centroid[0] : country.centroid[0] - 100}
                    y={(country.centroid[1] < 80) ? country.centroid[1] : country.centroid[1] - 50}
                    width="100"
                    height="30"
                />
                <text
                    class="text"
                    text-anchor={(country.centroid[0] < 120) ? 'start' : 'end'}
                    y={(country.centroid[1] < 80) ? 10 + country.centroid[1] : country.centroid[1] - 40}
                >
                        <tspan x={(country.centroid[0] < 120) ? 5 + country.centroid[0] : country.centroid[0] - 5}>{country.name}</tspan>
                        <tspan x={(country.centroid[0] < 120) ? 5 + country.centroid[0] : country.centroid[0] - 5} dy=10>{labels[view]}: {value(view, country.id)}</tspan>
                </text>
            </g>
        {/each}
        </g>
    {/if}
</svg>

<script>
  import { onMount } from 'svelte';
  import geojson2svg from 'geojson2svg';

  export let width = "100%";
  export let height = undefined;
  export let data = undefined;
  export let options = undefined;
  let selected;
  let geojson;
  let max = {};
  let labels = {};
  let layers = undefined;
  let countries = [];
  let index = {};
  let scale =  (x, view) => x;
  let view = 'deaths';

  const toggle = (id) => {
    if (id !== selected) {
      selected = id;
    } else {
      selected = undefined;
    }
  };

  $: if (data && data.labels) {
    index = {};
    data.labels.forEach((countryId, i)=> {
      index[countryId] = i;
    });
  };

  $: if (data && data.datasets) {
    data.datasets.forEach((ds, i) => {
      const id = ds.yAxisID;
      labels[id] = ds.label;
      index[id] = i;
      max[id] = 0;
      ds.data.forEach(d => {
        max[id] = Math.max(max[id], d.y)
      });
    });
  }

  $: if (Object.keys(max).length) {
      if (options && options.scales.yAxes) {
        scale = (x,id) => options.scales.yAxes[0].type === 'logarithmic' ?
                            (max[id] ? Math.log(x+1)/Math.log(max[id]) : Math.log(x+1))
                            : ( max[id] ? x/max[id] : x);
      }
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
      countries = geojson.features.filter(feature => feature.geometry && feature.geometry.coordinates)
        .map(feature => {
            const country = {
                id: feature.properties.code,
                name: feature.properties.nom,
                path: converter.convert(feature)
            };
            `${country.path[0]}`.replace(/^M/,'').split(/\s+/).forEach(c => {
                c = c.split(/,/).map(x => parseInt(x));
                country.xmin = Math.min(c[0],country.xmin||99999);
                country.ymin = Math.min(c[1],country.ymin||99999);
                country.xmax = Math.max(c[0],country.xmax||-99999);
                country.ymax = Math.max(c[1],country.ymax||-99999);
            });
            country.centroid = [
                (country.xmin + country.xmax) / 2,
                (country.ymin + country.ymax) / 2,
            ];
            return country;
        });
  }

  const value = (view, id) => {
    const v = index[id] !== undefined ? data.datasets[index[view]].data[index[id]] : 0;
    return v && v.y || 0;
  }

    onMount(async () => {
        try{
            const response = await fetch('/simple-french-departments-wdom.json');
            geojson = await response.json();
        } catch(e) {
            console.log(reponse);
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
