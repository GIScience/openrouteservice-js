<script src='./helloWorld.js'></script>

<template>
  <div>
    <h1 class='green'>{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href='https://vitejs.dev/' target='_blank' rel='noopener'>Vite</a> +
      <a href='https://vuejs.org/' target='_blank' rel='noopener'>Vue 3</a>.
    </h3>
  </div>
  <div class='ors_call'>
    {{ response }}
  </div>
</template>
<style>
.green {
  color: green;
}
.ors_call {
  font-size: x-small;
}
</style>
