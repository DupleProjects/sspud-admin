import axios from 'axios'
// import api from '~/api/helpers/apiwrapper'
import { setAuthToken, resetAuthToken } from '~/utils/auth'
import cookies from 'js-cookie'

export const authStore = {
  state: () => ({
    user: null
  }),

  getters: {
    isUserLoggedIn(state) {
      return !!state.user;
    }
  },

  mutations: {
    async set_user(store, data) {
      console.log("Setting user");
      console.log()
      store.user = data;
      return;
    },
    async reset_user(store) {
      store.user = null
    }
  },


  actions: {
    async fetch({ commit }, currCookie) {

      console.log("Fetching from: ");
      console.log(process.env.apiURL);

      var body = {
        cooki : currCookie
      }

      let me = await axios({
        method: 'post',
        url: process.env.apiURL + '/users/me',
        headers: {},
        data: body
      })
      try{
        await commit('set_user', me.data.result)
        return;
      }
      catch(error){
        await commit('reset_user')
        return;
      }
    },
    async login({ commit }, data) {
      console.log("Logging in....");
      console.log(data);
      console.log(process.env.apiURL);
      var body = data;
      let logInUser = await axios({
        method: 'post',
        url: process.env.apiURL + '/users/login',
        headers: {},
        data: body
      })
      console.log(logInUser.data);
      await commit('set_user', logInUser.data.user)
      await setAuthToken(logInUser.data.token)
      cookies.set('sspud-access-token', logInUser.data.token, { expires: 7 })
      return logInUser
    },
    async setState({ commit }, data) {
      await commit('set_user', data)

    },
    async reset({ commit }) {
      await commit('reset_user')
      cookies.set('tmmgo-access-token', { expires: Date.now() });
      await resetAuthToken()
      cookies.remove('tmmgo-access-token')
      return Promise.resolve()
    },
    async getQuickSightDetails(vuexContext){
      let getEmbedURL = await axios({
        method: 'post',
        url: process.env.baseURL + 'api/quicksight/embedurl',
        headers: {},
        data: {companyid:vuexContext.state.user.company_id}
      })

      const qsDetail = {
        companyId : vuexContext.state.user.company_id,
        embedUrl : getEmbedURL.data.EmbedUrl
      }

      console.log(getEmbedURL);

      console.log(qsDetail);

      return qsDetail;

    }
  }
}
