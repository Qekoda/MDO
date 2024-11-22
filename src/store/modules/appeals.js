import Vue from "vue"

export const appealsStore = {
  state: {
    appeals: [],
    pageInfo: {
      currentPage: 1,
      pageSize: 15,
      pages: 10
    }
  },
  mutations: {
    SET_APPEALS(state, appeals) {
      Vue.set(state, 'appeals', appeals)
    },
    SET_USER_PREMISES(state, userPremises) {
      Vue.set(state, 'userPremises', userPremises)
    },
    SET_PAGEINFO(state, { propertyName, value }) {
      Vue.set(state.pageInfo, propertyName, value)
    },
  },
  actions: {
    getAppeals({ state, commit }, params = {}) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http.get('/api/appeals/v1.0/appeals', { params })
          .then((response) => {
            if (response.status == 200) {
              commit('SET_APPEALS', response.data.results)
              commit('SET_PAGEINFO', { propertyName: 'currentPage', value: response.data.page })
              commit('SET_PAGEINFO', { propertyName: 'pageSize', value: response.data.page_size })
              commit('SET_PAGEINFO', { propertyName: 'pages', value: response.data.pages })
              resolve(response)
            }
          })
          .catch((error) => reject(error))
      })
    },
    updateAppeal({ state, commit }, params) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http.patch(`/api/appeals/v1.0/appeals/${params.id}/`, params)
          .then((response) => {
            if (response.status == 200) {
              resolve(response)
            }
          })
          .catch((error) => {
            commit('errors/SET_ERROR', error.response.data?.data, { root: true })
            reject(error)
          })
      })
    },
    createAppeal({ state, commit }, params) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http.post('/api/appeals/v1.0/appeals/', params)
          .then((response) => {
            if (response.status == 201) {
              resolve(response)
            }
          })
          .catch((error) => {
            commit('errors/SET_ERROR', error.response.data?.data, { root: true })
            reject(error)
          })
      })
    },
  },
  getters: {
    shortName: () => applicant => {
      const parts = []
      if (applicant.last_name) parts.push(applicant.last_name.charAt(0).toUpperCase() + applicant.last_name.slice(1))
      if (applicant.first_name) parts.push(`${applicant.first_name.charAt(0).toUpperCase()}.`)
      if (applicant.patronymic_name)parts.push(`${applicant.patronymic_name.charAt(0).toUpperCase()}.`)
      
      return parts.join(' ').trim() || 'Не указан'
    },
    formatAddress: () => appeal => {
      const premiseAddress = appeal.premise?.address || ''
      const apartmentLabel = appeal.apartment?.label || ''
      return `${premiseAddress} ${apartmentLabel}`.trim() || 'Не указан'
    },
  }
}