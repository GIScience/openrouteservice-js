<script src='./PoisApp.js'></script>

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

			<l-marker :lat-lng='[coordinates[1], coordinates[0]]'>
				<l-icon :icon-url="redIconUrl" :icon-size="iconSize" :icon-anchor="iconAnchor"></l-icon>
			</l-marker>
			<l-geo-json :geojson='geojson'></l-geo-json>

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
  float: right;
  width: 50%;
  padding: 10px;
}
.ors_title {
	font-weight: bold;
}
.ors_call {
	font-size: x-small;
}
</style>