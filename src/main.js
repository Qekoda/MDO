import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from './plugins/axios'
import dayjs from 'dayjs'
import util from './mixins/util'
import VueTheMask from 'vue-the-mask'

Vue.prototype.$dayjs = dayjs
Vue.prototype.$http = axios

Vue.use(VueTheMask)
Vue.mixin(util)

import "@/assets/stylesheets/application.sass"


Vue.config.productionTip = false
Vue.config.devtools = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
