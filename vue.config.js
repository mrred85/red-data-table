const { defineConfig } = require('@vue/cli-service')
const _package = require('./package.json')

process.env.VUE_APP_NAME = _package.displayName
process.env.VUE_APP_VERSION = _package.version

module.exports = defineConfig({
  transpileDependencies: true
})
