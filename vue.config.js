const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       // additionalData: `@use "@/assets/stylesheets/application.sass" as *;`,
  //       additionalData: `@import "@/assets/stylesheets/application.sass"`,
  //     },
  //   },
  // },
  devServer: {
    client: {
      overlay: false
    }
  }
})