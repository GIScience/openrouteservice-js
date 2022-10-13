require('dotenv').config({path: ".env.local"})
const { defineConfig } = require("cypress");


module.exports = defineConfig({
  e2e: {
    specPattern: [
      "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
      "src/**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}"
    ],
    baseUrl: "http://localhost:5173",
    env:{
      api_key: process.env.VITE_ORS_API_KEY
    }
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  }
});
