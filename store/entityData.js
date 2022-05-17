import axios from 'axios'

export const entityDataStore = {
  getters: {},

  mutations: {},
  actions: {
    async dataGate({ commit }, data) {
      const body = data
      console.log('data', data)
      const response = await axios({
        method: 'post',
        url: process.env.apiURL + '/dataGate',
        headers: {},
        data: body,
      })

      return response.data
    },
  },
}
