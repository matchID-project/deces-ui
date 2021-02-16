<svg {width} {height} viewBox="0 0 {widthBox} {heightBox}">
  <g transform={polarValues.transform}
     >
     {#each polarValues.groups.scale as element}
       <circle
         fill="none"
         style="stroke:#666666;stroke-width:0.4;stroke-opacity:0.4;"
         cx="{element.cx}"
         cy="{element.cy}"
         r="{element.r}" />
     {/each}
     {#each polarValues.groups.axis as axis}
       <polyline stroke="black" fill="none" style="stroke:#666666;stroke-width: 0.4;stroke-opacity:0.4;"
                                            points="{axis.points}"/>
     {/each}
     {#each polarValues.groups.caption as element}
       <text x={element.x} y={element.y} 
             font-family={element.fontFamily}
             font-size={element.fontSize}
             fill="{seasonColor(element.text)}"
						 dx="-12"
             dy={element.dy}  text-anchor="{element.textAnchor}"
                              >
                              {element.text}
       </text>
       {#if selected !== undefined && renderData[selected][element.col] !== undefined}
           <text x={element.x} y={element.y} 
                 font-family={element.fontFamily}
                 font-size={element.fontSize}
                 fill="{seasonColor(element.text)}"
                 dy="{element.y > 0 ? -10 : 20}"  text-anchor="{element.textAnchor}"
                          >
                          {renderData[selected][element.col]}
           </text>
       {/if}
     {/each}
     {#each polarValues.groups.shapes as element, ind}
       <path
         style="stroke:{colors[ind%4]};stroke-width:{selected === element.year ? 3.0 : 1}px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
         d="{element.d}"
         fill="none"
         on:mouseenter={()=> toggle(element.year)}
         on:mouseleave={()=> toggle(element.year)}
         />
         <text x="150" y="-100" class="small" style="opacity:{selected === element.year ? 0.9: 0};stroke:{colors[ind%4]};">{element.year}</text>
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
  const widthBox = 400;
  const heightBox = 300;

  let style = getComputedStyle(document.body);
  const hexToRgba = (hex, alpha) => 'rgba(' + hex.match(/^\s*\#?([\da-f]{2})([\da-f]{2})([\da-f]{2})\s*$/)
        .slice(1).map(e => parseInt(e, 16)).join(',') + `,${alpha})`;
  const colors = [
    hexToRgba(style.getPropertyValue('--bf500'), 0.7),
    hexToRgba(style.getPropertyValue('--bf500'), 0.55),
    hexToRgba(style.getPropertyValue('--bf500'), 0.4),
    hexToRgba(style.getPropertyValue('--bf500'), 0.25)
  ]

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
      size: 300, // size of the chart (including captions)
      width: widthBox,
      height: heightBox,
      axes: true, // show axes?
      scales: 10, // show scale circles?
      captionProps: () => ({
        className: 'caption',
        textAnchor: 'middle', fontSize: 8,
        fontFamily: 'Marianne'
      })
    })
  }

  const seasonColor = (text) => {
    if (seasons.ete.includes(text)) return "#e63946"
    if (seasons.hiver.includes(text)) return "#457b9d"
    if (seasons.printemps.includes(text)) return "#666666"
    if (seasons.autom.includes(text)) return "#666666"
  }

  const toggle = (id) => {
    if (id !== selected) {
      selected = id;
    } else {
      selected = undefined;
    }
  };
</script>
