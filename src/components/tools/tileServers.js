export default {
    'osm.mapnik': {
        attribution: '<a href="https://www.mapnik.org">Mapnik</a>',
        description: 'OSM Mapnik',
        url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
    },
    'osm.humanitarian': {
        attribution: '<a href="https://www.openstreetmap.org">OpenStreetMap</a>',
        description: 'OSM Humanitarian',
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    },
    'esri.grey.dark': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'ESRI Dark Grey',
        url:'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    },
    'esri.grey.light': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'ESRI Dark Light',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    },
    'esri.world.hillshade': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'ESRI Hillshade',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}'
    },
    'esri.world.ocean': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'ESRI Ocean',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}'
    },
    'esri.world.delorme': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'Delorme',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}'
    },
    'esri.world.street.map': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'ESRI Street Map',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
    },
    // 'esri.world.navigation.charts': {
    //     attribution: 'Map data &copy; <a href="https://www.esri.com">ESRI</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    //     description: 'ESRI World Navigation Charts',
    //     url:'https://services.arcgisonline.com/arcgis/rest/services/Specialty/World_Navigation_Charts/MapServer/tile/{z}/{y}/{x}'
    // },
    'esri.national.geographic': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'ESRI National Geographic',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
    },
    'esri.world.imagery': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'ESRI Imagery',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    },
    'esri.world.physical.map': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'ESRI Physical Map',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}'
    },
    'esri.world.shaded.relief': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'ESRI Shaded Relief',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}'
    },
    'esri.world.terrain': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'ESRI Terrain',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}'
    },
    'esri.world.topo': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'ESRI Topo',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
    },
    'cartodb.positron': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'CartoDB Positron',
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    },
    'cartodb.dark.matter': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'CartoDB Dark Matter',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
    },
    'cartodb.positron2': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'CartoDB Positron 2',
        url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
    },
    'cartodb.dark.matter2': {
        attribution: '<a href="https://www.esri.com">ESRI</a>',
        description: 'CartoDB Dark Matter 2',
        url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
    },
};