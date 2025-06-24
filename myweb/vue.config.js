const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // close eslint check
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [],
    },
  },
})
