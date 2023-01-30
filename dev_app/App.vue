<script setup>
import Util from './components/Util.vue'
import Directions from './components/Directions.vue'
import Elevation from './components/Elevation.vue'
import Geocode from './components/Geocode.vue'
import Isochrones from './components/Isochrones.vue'
import Matrix from './components/Matrix.vue'
import Optimization from './components/Optimization.vue'
import Pois from './components/Pois.vue'
</script>

<template>
  <header>
    <div class="title">
      <h3>
        You’ve successfully created a project with
        <a href='https://vitejs.dev/' target='_blank' rel='noopener'>Vite</a> +
        <a href='https://vuejs.org/' target='_blank' rel='noopener'>Vue 3</a>.
      </h3>
    </div>
  </header>

  <div class="sidebar">
    <button class="button" @click="">
      Utils
    </button>
    <button class="button" @click="">
      Directions
    </button>
  </div>

  <div class="main">
    <div class="wrapper" v-if="">
      <Util msg="Utils"/>
    </div>
    <div class="wrapper" v-if="">
      <Directions msg="OrsDirections"/>
    </div>
    <div class="wrapper">
      <Elevation msg="OrsElevation"/>
    </div>
    <div class="wrapper">
      <Geocode msg="OrsGeocode"/>
    </div>
    <div class="leaflet_map">
      <Isochrones msg="OrsIsochrones"/>
    </div>
    <div class="wrapper">
      <Matrix msg="OrsMatrix"/>
    </div>
    <div class="wrapper">
      <Optimization msg="OrsOptimization"/>
    </div>
    <div class="leaflet_map">
      <Pois msg="OrsPOIs"/>
    </div>
  </div>
</template>

<style>
.button {
  border: none;
  margin: 4px 2px;
  width: 100%;
  height: 40px;
  background-color: darkseagreen;
}
.sidebar {
  float: left;
  width: 15%;
  padding: 15px;
}
.main {
  float: right;
  width: 80%;
  padding: 15px;
}
</style>
