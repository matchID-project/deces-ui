<div class="rf-container">
  <div class="rf-col-12 rf-text--center">
    <h4 class="rf-margin-bottom-0">Détails sur l'algorithme d'appariement </h4>
    <p>
      Le scoring est composé de trois composantes relatives aux données de l'identité pivot: nom & prénom, sexe, date et lieu de naissance.

      Les champs textuels (nom prénom, libellés de commune et pays) sont traités en normalisation et tokenization, puis comparés avec la distance de Levenshtein, et sont pénalisés en cas de différence de sonorité (soundex-fr).

      Le lieu de naissance prend en compte les trois paramètres éventuels (commune, département, pays) et effectue un traitement différencié en cas de naissance à l'étranger.

      Les scores (nom+prénom, sexe, date, lieu) sont ensuite multipliés, et un coefficient de puissance est affecté selon le nombre de paramètres de match (moins il y a de champs soumis à requête, plus une erreur unitaire est pénalisante). Lorsque l'une des données n'est pas fournie, une faible pénalité est soumise (entre 50% et 100% selon le champ).

      Le code source du scoring est également <a href="https://github.com/matchID-project/deces-backend/blob/dev/backend/src/score.ts" title="code source de la recherche" rel="noreferrer" target="_blank">sur GitHub</a>.
    </p>
    <svg width="137.94624mm" height="{maxHeight}mm" viewBox="0 0 137.94624 {maxHeight}">
      <g
        id="layer1"
        transform="translate(-23.078687,-32.508447)">
      {#if score != undefined}
      <text
        xml:space="preserve"
        style="font-size:4.9389px;line-height:1.25;font-family:Cantarell;-inkscape-font-specification:'Cantarell, Normal';letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;stroke-width:0.264583"
        x="22.851498"
        y="100.50045"
        id="text1121"><tspan
        id="tspan1119"
        style="stroke-width:0.264583"
        x="22.851498"
        y="100.50045">score</tspan></text>
      <text
        xml:space="preserve"
        style="font-size:4.9389px;line-height:1.25;font-family:Cantarell;-inkscape-font-specification:'Cantarell, Normal';letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;stroke-width:0.264583"
        x="23.153355"
        y="106.78215"
        id="text1341"><tspan
        id="tspan1339"
        style="stroke-width:0.264583"
        x="23.153355"
        y="106.78215">{parseInt(score * 100)}%</tspan></text>
      {/if}
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="M 64.699124,89.350914 H 120.46429"
        id="path1422"/>
      <ellipse
        style="fill:#88def7;fill-opacity:1;stroke-width:0.264583;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"
        id="path1492"
        cy="89.063599"
        cx="80.190178"
        ry="10.101881"
        rx="14.77804" />
      {#if birthLocation}
      <text
        xml:space="preserve"
        style="font-size:4.9389px;line-height:1.25;font-family:Cantarell;-inkscape-font-specification:'Cantarell, Normal';letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;stroke-width:0.264583"
        x="80.194824"
        y="89.797661"
        id="text1125"><tspan
        id="tspan1123"
        style="text-align:center;text-anchor:middle;stroke-width:0.264583"
        x="80.194824"
        y="89.797661">Lieu de naissance</tspan><tspan
        style="text-align:center;text-anchor:middle;stroke-width:0.264583"
        x="80.194824"
        y="95.971283"
        id="tspan668">{birthLocation.score * 100}%</tspan></text>
      {/if}
      {#if deathDate}
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="M 65.31712,115.62576 57.353724,101.85357"
        id="path1418"/>
      <ellipse
        style="fill:#f1e877;fill-opacity:1;stroke-width:0.264583;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"
        id="ellipse1753"
        cy="115.54081"
        cx="77.455742"
        ry="10.016745"
        rx="12.248161" />
      <text
        xml:space="preserve"
        style="font-size:4.9389px;line-height:1.25;font-family:Cantarell;-inkscape-font-specification:'Cantarell, Normal';letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;stroke-width:0.264583"
        x="77.229439"
        y="115.02527"
        id="text1283"><tspan
        id="tspan1281"
        style="text-align:center;text-anchor:middle;stroke-width:0.264583"
        x="77.229439"
        y="115.02527">Date de décès</tspan><tspan
        style="text-align:center;text-anchor:middle;stroke-width:0.264583"
        x="77.229439"
        y="121.19889"
        id="tspan616">{deathDate * 100}%</tspan></text>
      {/if}
      {#if birthLocation}
        {#if birthLocation.city}
          <path
            style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="M 120.51449,70.396261 101.60384,89.306915"
            id="path1426" />
        {/if}
        {#if birthLocation.code}
          <path
            style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="M 120.53642,76.468152 107.57181,89.432759"
            id="path1428" />
        {/if}
        {#if birthLocation.codePostal}
          <path
            style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="m 120.66701,82.63498 -6.79135,6.791344"
            id="path1430" />
        {/if}
        {#if birthLocation.country}
          <path
            style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="M 120.85762,95.136699 115.11157,89.39064"
            id="path1432" />
        {/if}
        {#if birthLocation.countryCode}
          <path
            style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="M 120.93259,101.19368 109.20556,89.466646"
            id="path1434" />
        {/if}
        {#if birthLocation.geo}
          <path
            style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="M 120.88761,107.05515 103.29137,89.458913"
            id="path1436" />
        {/if}
        <text
          xml:space="preserve"
          style="font-size:4.9389px;line-height:1.25;font-family:Cantarell;-inkscape-font-specification:'Cantarell, Normal';letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;stroke-width:0.264583"
          x="121.10381"
          y="71.392685"
          id="text1287">
      {#if birthLocation.city}
      <tspan
        id="tspan1285"
        style="stroke-width:0.264583"
        x="121.10381"
        y="71.392685">Commune: {birthLocation.city * 100}%</tspan>
      {/if}
      {#if birthLocation.code}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="77.566307"
        id="tspan1289">Code INSEE: {birthLocation.code * 100}%</tspan>
      {/if}
      {#if birthLocation.codePostal}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="83.739937"
        id="tspan1291">Code postal: {birthLocation.codePostal * 100}%</tspan>
      {/if}
      {#if birthLocation.departmentCode}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="89.913559"
        id="tspan1293">Département: {birthLocation.departmentCode * 100}%</tspan>
      {/if}
      {#if birthLocation.country}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="96.087189"
        id="tspan1295">Pays: {birthLocation.country * 100}%</tspan>
      {/if}
      {#if birthLocation.countryCode}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="102.26081"
        id="tspan1297">Code pays: {birthLocation.countryCode * 100}%</tspan>
      {/if}
      {#if birthLocation.geo}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="108.43443"
        id="tspan1301">Coordonnées géo: {birthLocation.geo * 100}%</tspan>
      {/if}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="114.60806"
        id="tspan1303" /></text>
      {/if}
      {#if deathLocation}
        {#if deathLocation.city}
          <path
            style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="m 120.72359,123.94657 -18.19754,18.19592"
            id="path1811"/>
        {/if}
        {#if deathLocation.code}
          <path
            style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="m 120.81903,130.05902 -12.11822,12.08416"
            id="path1813" />
        {/if}
        {#if deathLocation.codePostal}
          <path
            style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="m 120.86081,136.32981 -5.81758,5.78003"
            id="path1815" />
        {/if}
        {#if deathLocation.countryCode}
          <path
            style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="M 120.77385,154.60438 108.31596,142.11662"
            id="path1819"/>
        {/if}
        {#if deathLocation.country}
          <path
            style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="m 120.70448,148.2892 -6.1581,-6.15473"
            id="path1821"/>
        {/if}
        {#if deathLocation.geo}
          <path
            style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            d="M 120.6705,160.79084 102.04563,142.11553"
            id="path1817"/>
        {/if}
      <text
        xml:space="preserve"
        style="font-size:4.9389px;line-height:1.25;font-family:Cantarell;-inkscape-font-specification:'Cantarell, Normal';letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;stroke-width:0.264583"
        x="121.10381"
        y="124.92219"
        id="text1323">
      {#if deathLocation.city}
      <tspan
        id="tspan1305"
        style="stroke-width:0.264583"
        x="121.10381"
        y="124.92219">Commune: {deathLocation.city * 100}%</tspan>
      {/if}
      {#if deathLocation.code}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="131.09581"
        id="tspan1307">Code INSEE: {deathLocation.code}%</tspan>
      {/if}
      {#if deathLocation.codePostal}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="137.26944"
        id="tspan1309">Code postal: {deathLocation.codePostal * 100}%</tspan>
      {/if}
      {#if deathLocation.departmentCode}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="143.44307"
        id="tspan1311">Département: {deathLocation.departmentCode * 100}%</tspan>
      {/if}
      {#if deathLocation.country}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="149.61668"
        id="tspan1313">Pays: {deathLocation.country * 100}%</tspan>
      {/if}
      {#if deathLocation.countryCode}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="155.79031"
        id="tspan1315">Code pays: {deathLocation.countryCode * 100}%</tspan>
      {/if}
      {#if deathLocation.geo}
      <tspan
        style="stroke-width:0.264583"
        x="121.10381"
        y="161.96394"
        id="tspan1321">Coordonnées géo: {deathLocation.geo}</tspan>
      {/if}
      </text>
      {/if}
      {#if name}
      <text
        xml:space="preserve"
        style="font-size:4.9389px;line-height:1.25;font-family:Cantarell;-inkscape-font-specification:'Cantarell, Normal';letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;stroke-width:0.264583"
        x="91.473221"
        y="36.20499"
        id="text1333">
      {#if name.first}
      <tspan
        id="tspan1331"
        style="stroke-width:0.264583"
        x="91.473221"
        y="36.20499">Prénom: {name.first * 100}%</tspan>
      {/if}
      {#if name.last}
      <tspan
        style="stroke-width:0.264583"
        x="91.473221"
        y="42.378616"
        id="tspan1335">Nom: {name.last * 100}%</tspan>
      {/if}
      {#if name.legal}
        <path
          style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
          d="m 84.716651,41.168076 6.368073,6.368076"
          id="path1827" />
        <tspan
          style="stroke-width:0.264583"
          x="91.473221"
          y="48.552238"
          id="tspan1337">Nom de jeune fille: {name.legal * 100}%</tspan>
      {/if}
      </text>
      {/if}
      <circle
        style="fill:#f1e877;fill-opacity:1;stroke-width:0.264583;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"
        id="ellipse1755"
        cy="101.67178"
        cx="42.222668"
        r="3.7178617" />
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="m 27.494677,101.88685 h 34.29757"
        id="path1406"/>
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="M 47.571214,101.90904 63.821919,41.250819"
        id="path1408"/>
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="M 64.853637,69.348725 56.169788,101.98151"
        id="path1412"/>
      <ellipse
        style="fill:#f1e877;fill-opacity:1;stroke-width:0.264583;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"
        id="ellipse1751"
        cy="69.095718"
        cx="75.701324"
        ry="9.6569815"
        rx="11.878016" />
      {#if birthDate}
      <text
        xml:space="preserve"
        style="font-size:4.9389px;line-height:1.25;font-family:Cantarell;-inkscape-font-specification:'Cantarell, Normal';letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;stroke-width:0.264583"
        x="75.27256"
        y="69.08725"
        id="text1279"><tspan
        id="tspan1277"
        style="text-align:center;text-anchor:middle;stroke-width:0.264583"
        x="75.27256"
        y="69.08725">Date de naissance</tspan><tspan
        style="text-align:center;text-anchor:middle;stroke-width:0.264583"
        x="75.27256"
        y="75.260872"
        id="tspan670">{birthDate * 100}%</tspan></text>
      {/if}
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="M 64.824749,89.323488 61.657674,101.94754"
        id="path1414"/>
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="m 121.0628,88.930066 -0.72143,0.438961"
        id="path1438"/>
      {#if deathLocation}
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="M 65.088833,142.21506 41.804796,101.88593"
        id="path1416" />
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="M 65.016607,142.14586 H 120.62334"
        id="path1809" />
      <ellipse
        style="fill:#88def7;fill-opacity:1;stroke-width:0.264583;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"
        id="ellipse1654"
        cy="141.9783"
        cx="81.455437"
        ry="9.7924366"
        rx="15.830065" />
      <text
        xml:space="preserve"
        style="font-size:4.9389px;line-height:1.25;font-family:Cantarell;-inkscape-font-specification:'Cantarell, Normal';letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;stroke-width:0.264583"
        x="81.433563"
        y="142.44539"
        id="text1129"><tspan
        id="tspan1127"
        style="text-align:center;text-anchor:middle;stroke-width:0.264583"
        x="81.433563"
        y="142.44539">Lieu du décès</tspan><tspan
        style="text-align:center;text-anchor:middle;stroke-width:0.264583"
        x="81.433563"
        y="148.61902"
        id="tspan672">{deathLocation.score * 100}%</tspan></text>
      {/if}
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="m 63.749403,41.26217 27.280168,0"
        id="path1823"/>
      <ellipse
        style="fill:#f1e877;fill-opacity:1;stroke-width:0.264583;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"
        id="ellipse1658"
        cy="41.026848"
        cx="71.684952"
        ry="7.6121683"
        rx="7.3372321" />
      {#if name}
      <text
        xml:space="preserve"
        style="font-size:4.9389px;line-height:1.25;font-family:Cantarell;-inkscape-font-specification:'Cantarell, Normal';letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;stroke-width:0.264583"
        x="71.663582"
        y="39.634148"
        id="text1275"><tspan
        id="tspan1273"
        style="text-align:center;text-anchor:middle;stroke-width:0.264583"
        x="71.663582"
        y="39.634148">Nom</tspan><tspan
        style="text-align:center;text-anchor:middle;stroke-width:0.264583"
        x="71.663582"
        y="45.807774"
        id="tspan879">{name.score * 100}%</tspan></text>
      {/if}
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="m 91.212208,34.794245 -6.368073,6.368076"
        id="path1825" />
      {#if sex}
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="M 64.245621,55.519505 51.800586,101.93451"
        id="path1410"/>
      <path
        style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="M 64.196101,55.490193 H 126.75438"
        id="path877" />
      <ellipse
        style="fill:#88def7;fill-opacity:1;stroke-width:0.264583;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers"
        id="ellipse1656"
        cy="55.610458"
        cx="126.81845"
        ry="7.284533"
        rx="6.8359699" />
      <text
        xml:space="preserve"
        style="font-size:4.9389px;line-height:1.25;font-family:Cantarell;-inkscape-font-specification:'Cantarell, Normal';letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;stroke-width:0.264583"
        x="126.94625"
        y="53.968166"
        id="text1271"><tspan
        id="tspan1269"
        style="text-align:center;text-anchor:middle;stroke-width:0.264583"
        x="126.94625"
        y="53.968166">Sexe</tspan><tspan
        style="text-align:center;text-anchor:middle;stroke-width:0.264583"
        x="126.94625"
        y="60.141792"
        id="tspan674">{sex * 100}%</tspan></text>
      {/if}
      </g>
    </svg>
    <div class="rf-grid-row">
      <div class="rf-col-6">
        <div class="rf-container-fluid">
          <div class="rf-grid-row">
            {#each Object.keys(personA) as key}
              {#if key != "fullText"}
                {#if personA[key].section}
                  <div class="rf-col-12 rf-margin-top-2N rf-padding-left-4px">
                    <strong>
                      {#if personA[key].label === "Nom"}
                        Identité A
                      {:else}
                        {personA[key].section}
                      {/if}
                    </strong>
                  </div>
                {/if}

                <div class="rf-margin-top-1N rf-padding-left-4px rf-padding-right-4px rf-padding-bottom-4px {personA[key].size}">
                  <label
                    class="rf-label"
                    for={personA[key].url}
                    style="overflow: hidden;text-overflow:ellipsis;"
                    >
                    {personA[key].label}
                  </label>
                  <div class="rf-field">
                    <input
                      id={personA[key].url}
                      name={personA[key].path}
                      autoComplete="off"
                      placeholder={personA[key].placeholder}
                      class="rf-input {isValid(key) ? "" : "rf-color--rm rf-input--error"}"
                      on:input={() => handleInput(key)}
                      bind:value={personA[key].value}
                      title={personA[key].title}
                      disabled={personA[key].disabled}
                      />
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      </div>
      <div class="rf-col-6">
        <div class="rf-container-fluid">
          <div class="rf-grid-row">
            {#each Object.keys(personB) as key}
              {#if key != "fullText"}
                {#if personB[key].section}
                  <div class="rf-col-12 rf-margin-top-2N rf-padding-left-4px">
                    <strong>
                      {#if personB[key].label === "Nom"}
                        Identité B
                      {:else}
                        {personB[key].section}
                      {/if}
                    </strong>
                  </div>
                {/if}

                <div class="rf-margin-top-1N rf-padding-left-4px rf-padding-right-4px rf-padding-bottom-4px {personB[key].size}">
                  <label
                    class="rf-label"
                    for={personB[key].url}
                    style="overflow: hidden;text-overflow:ellipsis;"
                    >
                    {personB[key].label}
                  </label>
                  <div class="rf-field">
                    <input
                      id={personB[key].url}
                      name={personB[key].path}
                      autoComplete="off"
                      placeholder={personB[key].placeholder}
                      class="rf-input {isValid(key) ? "" : "rf-color--rm rf-input--error"}"
                      on:input={() => handleInput(key)}
                      bind:value={personB[key].value}
                      title={personB[key].title}
                      disabled={personB[key].disabled}
                      />
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
    import { onMount } from 'svelte';
    import { runCompareRequest } from '../tools/runRequest.js';
    import { searchInput, searchTyping } from '../tools/stores.js';

    const personA = JSON.parse(JSON.stringify($searchInput));
    const personB = JSON.parse(JSON.stringify($searchInput));
    let lastInput = {}

    const isValid = (key) => {
      if ($searchInput[key].mask && $searchInput[key].mask.validation) {
        return $searchInput[key].mask.validation($searchInput[key].value);
      } else {
        return true;
      }
    }

    const defaultA =  {
      firstName: 'georges',
      lastName: 'pompidous',
      birthDate: "01/11/1969"
    }

    const defaultB = {
      firstName: "Georges",
      lastName: "Pompidou",
      sex: "M",
      birthDate: "01/11/1969",
    }
    let maxHeight;

    $: if (deathLocation) {
      maxHeight = 137
    } else if (deathDate) {
      maxHeight = 100
    } else {
      maxHeight = 90
    }

    // replace default
    Object.keys(personA).forEach((key) => {
      if (Object.keys(defaultA).includes(key)) {
        personA[key].value = defaultA[key]
      }
    })

    Object.keys(personB).forEach((key) => {
      if (Object.keys(defaultB).includes(key)) {
        personB[key].value = defaultB[key]
      }
    })

    let score, birthDate, deathDate, name, birthLocation, deathLocation, sex = undefined;

    const format = 'dd/MM/yyyy'

    const startDate = new Date().getTime();

    const date = () => {
      return Math.round(new Date().getTime() - startDate);
    }

    const handleInput = (key) => {
        if (personA[key].mask && personA[key].mask.typing) {
          if (!personA[key].mask.typing(personA[key].value)) {
            personA[key].value = lastInput[key] || '';
          }
          lastInput[key] = personA[key].value
        }
        if (personB[key].mask && personB[key].mask.typing) {
          if (!personB[key].mask.typing(personB[key].value)) {
            personB[key].value = lastInput[key] || '';
          }
          lastInput[key] = personB[key].value
        }
        if (isValid(key)) {
          $searchTyping = date() + 350;
          setTimeout(() => {
            if (date() > $searchTyping) {
              searchCompare()
            } else {
              console.log("key input limiter")
            }
          }, 355)
        }
    }

    const searchCompare = async () => {
      const persA = {}
      Object.keys(personA).forEach(key => {
        if (personA[key].value != "") {
          persA[key] = personA[key].value
        }
      })
      const persB = {}
      Object.keys(personB).forEach(key => {
        if (personB[key].value != "") {
          persB[key] = personB[key].value
        }
      })
      const res = await runCompareRequest({personA: persA, personB: persB, params: {dateFormatA: format, dateFormatB: format, explain: true}}, false)
      if (res) {
        ({ score, birthDate, deathDate, name, birthLocation, deathLocation, sex } = res)
      }
    }

    onMount(() => {
      setTimeout(async () => {
        await searchCompare()
      }, 500);
    })

</script>
