const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // suas outras configurações do Cypress...

    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false,
      json: true,
    },
  },
})