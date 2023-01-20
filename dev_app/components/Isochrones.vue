<script src='./IsochronesApp.js'></script>

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

      <l-marker :lat-lng='[points[0][1], points[0][0]]'>
        <l-icon :icon-url="blueIconUrl" :icon-size="iconSize" :icon-anchor="iconAnchor"> </l-icon>
      </l-marker>
      <l-geo-json :geojson='iso[0][5]' :options='hueStyle[5]'> </l-geo-json>
      <l-geo-json :geojson='iso[0][4]' :options='hueStyle[4]'> </l-geo-json>
      <l-geo-json :geojson='iso[0][3]' :options='hueStyle[3]'> </l-geo-json>
      <l-geo-json :geojson='iso[0][2]' :options='hueStyle[2]'> </l-geo-json>
      <l-geo-json :geojson='iso[0][1]' :options='hueStyle[1]'> </l-geo-json>
      <l-geo-json :geojson='iso[0][0]' :options='hueStyle[0]'> </l-geo-json>

      <l-marker :lat-lng='[points[1][1], points[1][0]]'>
        <l-icon :icon-url="blueIconUrl" :icon-size="iconSize" :icon-anchor="iconAnchor"> </l-icon>
      </l-marker>
      <l-geo-json :geojson='iso[1][5]' :options='hueStyle[5]'> </l-geo-json>
      <l-geo-json :geojson='iso[1][4]' :options='hueStyle[4]'> </l-geo-json>
      <l-geo-json :geojson='iso[1][3]' :options='hueStyle[3]'> </l-geo-json>
      <l-geo-json :geojson='iso[1][2]' :options='hueStyle[2]'> </l-geo-json>
      <l-geo-json :geojson='iso[1][1]' :options='hueStyle[1]'> </l-geo-json>
      <l-geo-json :geojson='iso[1][0]' :options='hueStyle[0]'> </l-geo-json>

      <div v-if='hue_style'>
        <l-marker :lat-lng='[points[0][1], points[0][0]]'>
          <l-icon :icon-url="blueIconUrl" :icon-size="iconSize" :icon-anchor="iconAnchor"></l-icon>
        </l-marker>
        <div v-for='(hue, index) in hueStyle' :key='hue'>
          <l-geo-json :geojson='iso[0][iso[0].length - index]' :options='hueStyle[index]'></l-geo-json>
        </div>
      </div>

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
  height: 540px;
  width: 810px;
}
.ors_title {
  font-weight: bold;
}
.ors_call {
  font-size: x-small;
}
</style>