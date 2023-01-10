<script src='./IsochronesApp.js'></script>

<template>
  <div>
    <h1 class='green'>{{ msg }}</h1>
    <h3>

    </h3>
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
.ors_title {
  font-weight: bold;
}
.ors_call {
  font-size: x-small;
}
</style>