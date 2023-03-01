<script src='./AppData.js'></script>

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
    <button
        v-for="service in servicesData"
        :key="service"
        :class="['button', { active: renderedData === service }]"
        @click="renderedData = service"
    >
      {{ service }}
    </button>
  </div>

  <div class="main">
    <div class="wrapper">
      <component :is="renderedData"></component>
    </div>
  </div>
</template>

<style>
.button {
  border: none;
  margin: 25px 2px;
  width: 100%;
  height: 55px;
  background: darkseagreen;
}
.button:hover {
  background: lightseagreen;
}
.button.active {
  background: seagreen;
}
.sidebar {
	position: fixed;
  float: left;
  width: 16%;
	height: 100%;
  padding: 15px;
}
.main {
  float: right;
  width: 80%;
  padding: 15px;
}
</style>