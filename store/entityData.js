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
    async callMiddlewareRoute({ commit }, data) {
      if (data.hasOwnProperty('route')) {
        const response = await axios({
          method: 'post',
          url: process.env.baseURL + '/'+ data.route,
          headers: {},
          data: data,
        })
        return response.data
      }
      return {
        success: false,
        message: 'No route provided'
      }
    },
  },
}
