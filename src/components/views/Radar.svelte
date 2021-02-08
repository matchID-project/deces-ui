<svg {width} {height} viewBox="0 0 400 300">
  <g transform={polarValues.transform}
     >
     {#each polarValues.groups.scale as element}
       <circle
         style="fill:#fff;fill-opacity:0.993535;stroke:#666666;stroke-width:0.4"
         cx="{element.cx}"
         cy="{element.cy}"
         r="{element.r}" />
     {/each}
     {#each polarValues.groups.axis as axis}
       <polyline stroke="black" fill="none" style="stroke:#666666;stroke-width: 0.4;"
                                            points="{axis.points}"/>
     {/each}
     {#each polarValues.groups.caption as element, elementId}
       <text x={element.x} y={element.y} 
             font-family={element.fontFamily}
             font-size={element.fontSize}
             fill="{seasonColor(element.text)}"
						 dx="-12"
             dy={element.dy}  text-anchor="{element.textAnchor}"
                              >
                              {element.text}
       </text>
       {#if selected !== undefined}
           <text x={element.x} y={element.y} 
                 font-family={element.fontFamily}
                 font-size={element.fontSize}
                 fill="{seasonColor(element.text)}"
                 dy="20"  text-anchor="{element.textAnchor}"
                          >
                          {renderData[selected][element.col]}
           </text>
       {/if}
     {/each}
     {#each polarValues.groups.shapes as element, ind}
       <path
         style="stroke:{colors[ind%10]};stroke-width:{selected === element.year ? 2.0 : 1}px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
         d="{element.d}"
         fill="none"
         on:mouseenter={()=> toggle(element.year)}
         on:mouseleave={()=> toggle(element.year)}
         />
         <text x="180" y="{-100}" class="small" style="opacity:{selected === element.year ? 0.9: 0}">{element.year}</text>
     {/each}
  </g>
</svg>


<script>
  import render from '../tools/radar';	
  export let data = undefined;
  export let width = "100%";
  export let height = undefined;
  let selected;
  let renderData;
  let polarValues;
  let maxVal = 0;
  const colors = ["#7400B8","#6930C3","#5E60CE","#5390D9","#4EA8DE",
    "#48BFE3","#56CFE1","#64DFDF","#72EFDD","#80FFDB"]
  const seasons = {
    printemps: ["Mars", "Avril", "Mai"],
    ete: ["Juin", "Juillet", "Août"],
    autom: ["Sept", "Oct", "Nov"],
    hiver: ["Déc", "Janvier", "Fév"]
  }
  const columns = {
    '01': 'Janvier',
    '02': 'Fév', //'Février',
    '03': 'Mars',
    '04': 'Avril',
    '05': 'Mai',
    '06': 'Juin',
    '07': 'Juillet',
    '08': 'Août',
    '09': 'Sept', //'Septembre',
    '10': 'Oct', //'Octobre',
    '11': 'Nov', //'Novembre',
    '12': 'Déc' //'Décembre',
  }

  $: if (data && data.datasets) {
    data.datasets.forEach(ds => {
      renderData = ds.data.reduce((total, s) => {
        maxVal = Math.max(maxVal, s.y || 0)
        const [ , year, month] = s.x.match(/(\d{4})(\d{2})\d{2}/)
        if (year in total) {
          if (month in total[year]) {
            total[year][month] += s.y
          } else {
            total[year][month] = s.y
          }
        } else {
          total[year] = {}
          total[year][month] = s.y
        }
        return total
      }, {})
    })
  }

  $: if (renderData) {
    polarValues = render(columns, renderData, {
      maxVal,
      size: 250, // size of the chart (including captions)
      axes: true, // show axes?
      scales: 5, // show scale circles?
      captionProps: () => ({
        className: 'caption',
        textAnchor: 'middle', fontSize: 8,
        fontFamily: 'sans-serif'
      })
    })
  }

  const seasonColor = (text) => {
    if (seasons.ete.includes(text)) return "#e63946"
    if (seasons.hiver.includes(text)) return "#1d3557"
    if (seasons.printemps.includes(text)) return "#457b9d"
    if (seasons.autom.includes(text)) return "#a8dadc"
  }

  const toggle = (id) => {
    if (id !== selected) {
      selected = id;
    } else {
      selected = undefined;
    }
  };
</script>
