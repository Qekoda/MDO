import Vue from "vue"

export const errorStore = {
  state: {
    errors: {},
  },
  mutations: {
    SET_ERROR(state, errors) {
      Vue.set(state, 'errors', errors)
    },
    CLEAR_ERROR(state){
      Vue.set(state, 'errors', {})
    },
  },
  actions: {
  }
}
