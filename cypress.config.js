const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // dein Vite Dev Server
    supportFile: 'cypress/support/commands.js',
    specPattern: 'cypress/e2e/**/*.spec.js'
  },
})
