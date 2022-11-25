<script src='./ElevationApp.js'></script>

<template>
  <div>
    <h1 class='green'>{{ msg }}</h1>
  </div>

  <div class='leaflet' v-if='map_ready'>
    <l-map ref='map' :useGlobalLeaflet='false' v-model:zoom='zoom' :center='[center.lat, center.lon]'>
      <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
      ></l-tile-layer>

      <l-marker :lat-lng='linestring[0]'>
        <l-icon :icon-url="iconUrl" :icon-size="iconSize" :icon-anchor="iconAnchor"></l-icon>
        <l-tooltip>Elevation: {{ height[0] }}</l-tooltip>
      </l-marker>
      <l-marker :lat-lng='linestring[linestring.length - 1]'>
        <l-icon :icon-url="iconUrl" :icon-size="iconSize" :icon-anchor="iconAnchor"></l-icon>
        <l-tooltip>Elevation: {{ height[1] }}</l-tooltip>
      </l-marker>
      <l-polyline :lat-lngs='linestring'></l-polyline>
    </l-map>
  </div>

  <div>
    <p class='ors_title' v-if='data_ready'>
      {{ json_title }}
    </p>
    <p class='ors_call' v-if='data_ready'>
      {{ json_data }}
    </p>
  </div>
</template>

<style>
.green {
  color: green;
}
.leaflet {
	height: 850px;
	width: 100%;
	padding-bottom: 15px;
}
.ors_title {
  font-weight: bold;
}
.ors_call {
  font-size: x-small;
}
</style>
