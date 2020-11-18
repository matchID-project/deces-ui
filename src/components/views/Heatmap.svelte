<svg {width} {height} viewBox="0 0 260 130">
    {#if heatmap && heatmap[view] && Object.keys(heatmap[view]).length}
        <g>
        {#each Object.keys(heatmap[view]) as day,i}
            {#each Object.keys(heatmap[view][day]).sort((a,b) => parseInt(a.replace('h','')) - parseInt(b.replace('h',''))) as hour,j}
                <rect
                    id="{day}{hour}"
                    class="hoverable"
                    x={(i+1)*30}
                    y={10+(j+1)*4+2}
                    width=26
                    height=4
                    stroke="var(--beige)"
                    stroke-width="1px"
                    on:mouseenter={()=> toggle(day,hour)}
                    on:mouseleave={() => toggle(day,hour)}
                    fill={colorScale(heatmap[view][day][hour], view)}
                />
            {/each}
            <text
                id="{day}"
                text-anchor="middle"
                x={(i+1)*30+15}
                y={124}
                font-size=6
                fill="var(--g600)"
            >
                {day}
            </text>
        {/each}
        {#each [2, 6, 10, 14, 18, 22] as hour}
            <text
                id="{hour}"
                text-anchor="middle"
                x={15}
                y={16+hour*4}
                font-size=6
                fill="var(--g600)"
            >
                {hour}h
            </text>
        {/each}
        {#each Object.keys(heatmap[view]) as day,i}
            {#each Object.keys(heatmap[view][day]).sort((a,b) => parseInt(a.replace('h','')) - parseInt(b.replace('h',''))) as hour,j}
                <g
                    class="tooltip"
                    opacity={selected === `${day}${hour}` ? 0.95 : 0}
                >
                    <rect
                        x={(i<4) ? (i+2)*30 : (i+1)*30 - 105}
                        y={(j<12) ? 10+(j+2)*4+2 : 10+(j-1)*4+2 - 50}
                        width="105"
                        height="50"
                        opacity=1
                    />
                    <text
                        class="text"
                        text-anchor={(i<4) ? 'start' : 'end'}
                        y={(j < 12) ? 15 + 10+(j+1)*4+2 : 10+(j+1)*4+2 - 45}
                    >
                            <tspan x={(i<4) ? 5 + (i+2)*30 : (i+1)*30 - 5}>{day+" "} {hour}h</tspan>
                            <tspan x={(i<4) ? 5 + (i+2)*30 : (i+1)*30 - 5} dy=10>{labels['visitors']}:{heatmap['visitors'][day][hour]}</tspan>
                            <tspan x={(i<4) ? 5 + (i+2)*30 : (i+1)*30 - 5} dy=10>{labels['hits']}:{heatmap['hits'][day][hour]}</tspan>
                            <tspan x={(i<4) ? 5 + (i+2)*30 : (i+1)*30 - 5} dy=10>{labels['bytes']}:{heatmap['bytes'][day][hour]}</tspan>
                    </text>
                </g>
            {/each}
        {/each}

        </g>
    {/if}
</svg>

<script>
  export let width = "100%";
  export let height = undefined;
  export let data = undefined;
  export let options = undefined;
  let selected;
  let max = {};
  let labels = {};
  let scale =  (x, view) => x;
  let view = 'visitors';
  let heatmap = {};
  const style = getComputedStyle(document.body);

  const toggle = (d,h) => {
      console.log(d,h);
      if (`${d}${h}` !== selected) {
          selected = `${d}${h}`;
      } else {
          selected = undefined;
      }
  };

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

<style>

.hoverable:hover {
  stroke-width: 0px;
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
