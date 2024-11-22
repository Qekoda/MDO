import Vue from "vue"

export const apartmentsStore = {
  state: {
    apartments: [],
  },
  mutations: {
    SET_APARTMENTS(state, apartments) {
      Vue.set(state, 'apartments', apartments)
    },
    CLEAR_APARTMENTS(state) {
      Vue.set(state, 'apartments', [])
    }
  },
  actions: {
    getApartments({ state, commit }, params = {}) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http.get(`/api/geo/v1.0/apartments/`, { params })
          .then((response) => {
            if (response.status == 200) {
              commit('SET_APARTMENTS', response.data.results)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  },
}