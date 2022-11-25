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

			<div v-if='color_style'>
				<div v-for='(key, index) in iso' :key='key'>
					<l-marker :lat-lng='[points[index][1], points[index][0]]'>
						<l-icon :icon-url="iconUrl[index]" :icon-size="iconSize" :icon-anchor="iconAnchor"></l-icon>
					</l-marker>
					<l-geo-json :geojson='iso[index]' :options='colorStyle[index]'></l-geo-json>
				</div>
			</div>

			<div v-if='hue_style'>
				<l-marker :lat-lng='[points[0][1], points[0][0]]'>
					<l-icon :icon-url="iconUrl[0]" :icon-size="iconSize" :icon-anchor="iconAnchor"></l-icon>
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
