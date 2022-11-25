<script src='./OptimizationApp.js'></script>

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

      <div v-for='(key, index) in vehicle_routes' :key="key">
        <l-marker :lat-lng='[vehicle_routes[index][0][1], vehicle_routes[index][0][0]]'>
          <l-icon :icon-url="iconUrl[0]" :icon-size="iconSize" :icon-anchor="iconAnchor"></l-icon>
					<l-tooltip>Vehicle {{ index + 1 }}: start</l-tooltip>
        </l-marker>
        <l-marker :lat-lng='[vehicle_routes[index][1][1], vehicle_routes[index][1][0]]'>
          <l-icon :icon-url="iconUrl[0]" :icon-size="iconSize" :icon-anchor="iconAnchor"></l-icon>
					<l-tooltip>Vehicle {{ index + 1 }}: end</l-tooltip>
        </l-marker>

				<div v-for="(key, job) in jobs[index]" :key="key">
					<l-marker :lat-lng='[jobs[index][job][1], jobs[index][job][0]]'>
						<l-icon :icon-url="iconUrl[index + 1]" :icon-size="iconSize" :icon-anchor="iconAnchor"></l-icon>
						<l-tooltip>Job: {{ job + 1 }}</l-tooltip>
					</l-marker>
				</div>

				<l-geo-json :geojson='geojson[index]' :options='colorStyle[index]'></l-geo-json>
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
