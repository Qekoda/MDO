import Vue from "vue"

export const premisesStore = {
  state: {
    userPremises: [],
  },
  mutations: {
    SET_USER_PREMISES(state, userPremises) {
      Vue.set(state, 'userPremises', userPremises)
    },
  },
  actions: {
    getUserPremises({ state, commit }, params = {}) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http.get('/api/geo/v2.0/user-premises', { params })
          .then((response) => {
            if (response.status == 200) {
              commit('SET_USER_PREMISES', response.data.results)
              resolve(response)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  },
}