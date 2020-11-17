<div>
    <svg {width} {height} viewBox="0 0 130 70">
        {#if heatmap && heatmap[view] && Object.keys(heatmap[view]).length}
            <g>
            {#each Object.keys(heatmap[view]) as day,i}
                {#each Object.keys(heatmap[view][day]).sort((a,b) => parseInt(a.replace('h','')) - parseInt(b.replace('h',''))) as hour,j}
                    <rect
                        id="{day}{hour}"
                        x={(i+1)*15}
                        y={5+(j+1)*2+1}
                        width=13
                        height=2
                        stroke="var(--beige)"
                        stroke-width="0.5px"
                        fill={colorScale(heatmap[view][day][hour], view)}
                    >
                        <title>
                            {day} {hour}h
                            - {labels['visitors']}:{heatmap['visitors'][day][hour]}
                            - {labels['hits']}:{heatmap['hits'][day][hour]}
                            - {labels['bytes']}:{heatmap['bytes'][day][hour]}
                        </title>
                     </rect>
                {/each}
                <text
                    id="{day}"
                    text-anchor="middle"
                    x={(i+1)*15+7.5}
                    y={62}
                    font-size=3
                    fill="var(--g600)"
                >
                    {day}
                </text>
            {/each}
            {#each [2, 6, 10, 14, 18, 22] as hour}
                <text
                    id="{hour}"
                    text-anchor="middle"
                    x={7.5}
                    y={8+hour*2}
                    font-size=3
                    fill="var(--g600)"
                >
                    {hour}h
                </text>
            {/each}
            </g>
        {/if}
    </svg>
</div>

<script>
  export let width = "100%";
  export let height = undefined;
  export let data = undefined;
  export let options = undefined;
  let max = {};
  let labels = {};
  let scale =  (x, view) => x;
  let view = 'visitors';
  let heatmap = {};
  const style = getComputedStyle(document.body);

  const rgbToHex = ([r, g, b]) => '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0')).join('');

  const hexToRgb = (hex) => hex.match(/^\s*\#?([\da-f]{2})([\da-f]{2})([\da-f]{2})\s*$/)
        .slice(1).map(e => parseInt(e, 16));

  const interpolateColor = (c0, c1, f) => {
        const h0 = hexToRgb(c0);
        return rgbToHex(hexToRgb(c1).map((c,i) => Math.ceil(c*f+(1-f)*h0[i])));
   }

  const colorScale = (v, view) => {
      const threshold = 0.7;
      let color;
      let s = scale(v, view);
      if (s > threshold) {
          color = interpolateColor(
              style.getPropertyValue('--bf500'),
              style.getPropertyValue('--rm500'),
              (s-threshold)/(1-threshold)
          );
      } else {
          color = interpolateColor(
              '#ffffff',
              style.getPropertyValue('--bf500'),
              s/threshold
          );
      };
      return color;
  }

  $: if (data && data.datasets) {
      data.datasets.forEach((ds, i) => {
          const id = ds.yAxisID;
          labels[id] = ds.label;
          max[id] = 0;
          ds.data.forEach(d => {
            max[id] = Math.max(max[id], d.y);
            if (!heatmap[id]) { heatmap[id] = {} }
            if (!heatmap[id][d.x.replace(/-.*/,'')]) { heatmap[id][d.x.replace(/-.*/,'')] = {} }
            heatmap[id][d.x.replace(/-.*/,'')][d.x.replace(/.*-(..).*/,'$1')] = d.y;
          });
      });
  };

  $: if (Object.keys(max).length) {
      if (options && options.scales.yAxes) {
        scale = (x,id) => options.scales.yAxes[0].type === 'logarithmic' ?
                            (max[id] ? Math.log(x+1)/Math.log(max[id]) : Math.log(x+1))
                            : ( max[id] ? x/max[id] : x);
      }
  };

</script>


