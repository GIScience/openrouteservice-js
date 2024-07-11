<script src='./GeocodeApp.js'></script>

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

			<div v-for='(key, index) in points' :key='key'>
				<l-marker :lat-lng='[points[index][1], points[index][0]]'>
					<l-icon :icon-url="iconUrl[0]" :icon-size="iconSize" :icon-anchor="iconAnchor"></l-icon>
					<l-tooltip>Search: {{ search }}</l-tooltip>
				</l-marker>
			</div>
			<div v-for='(key, index) in reversePoints' :key='key'>
				<l-marker :lat-lng='[reversePoints[index][1], reversePoints[index][0]]'>
					<l-icon :icon-url="iconUrl[1]" :icon-size="iconSize" :icon-anchor="iconAnchor"></l-icon>
					<l-tooltip>{{ foundNames[index] }}</l-tooltip>
				</l-marker>
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
    <p class='ors_call' v-if='data_ready'>
      {{ json_data_reverse }}
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
