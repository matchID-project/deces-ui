<svg {width} {height} viewBox="0 0 260 130">
    {#if countries.length && data && Object.keys(index).length}
        <g>
        {#each countries as country}
            <path
                class="hoverable"
                d={country.path}
                id={country.id}
                stroke="var(--bf500)"
                stroke-width="0.1px"
                fill="var(--bf500)"
                fill-opacity={scale(value(view, country.id), view)}
            >
                <title>
                    {country.id}
                        - {labels['visitors']}:{value('visitors', country.id)}
                        - {labels['hits']}:{value('hits', country.id)}
                        - {labels['bytes']}:{value('bytes', country.id)}
                </title>
            </path>
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
  let geojson;
  let max = {};
  let labels = {};
  let layers = undefined;
  let countries = [];
  let index = {};
  let scale =  (x, view) => x;
  let view = 'visitors';

  $: if (data && data.labels) {
      data.labels.forEach((countryId, i)=> {
        //   console.log(countryId, i);
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
    mapExtent: {left: -180, bottom: -90, right: 180, top: 90},
    output: 'path'
  });

  $: if (geojson) {
      countries = geojson.features.filter(feature => feature.geometry && feature.geometry.coordinates)
        .map(feature => {
            return {
                id: feature.id,
                path: converter.convert(feature)
            };
        });
    //   console.log(countries);
  }

  const value = (view, id) => {
      const v = data.datasets[index[view]].data[index[id]];
    //   console.log(view, id, v && v.y, scale(v && v.y || 0, view));
      return v && v.y || 0;
  }

    onMount(async () => {
        try{
            const response = await fetch('/simple-world-map.json');
            geojson = await response.json();
        } catch(e) {
            console.log(reponse);
        }
  })
</script>

<style>

.hoverable:hover {
  stroke-width: 0.5px;
}

</style>
