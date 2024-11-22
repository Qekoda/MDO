import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import { errorStore } from './modules/errors'
import { appealsStore } from './modules/appeals'
import { premisesStore } from './modules/premises'
import { apartmentsStore } from './modules/apartments'

export default new Vuex.Store({
  modules: {
    errors: { namespaced: true, ...errorStore },
    appeals: { namespaced: true, ...appealsStore },
    premises: { namespaced: true, ...premisesStore },
    apartments: { namespaced: true, ...apartmentsStore },
  }
})
