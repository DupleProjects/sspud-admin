import cookie from 'cookie'
import Vuex from 'vuex'
import {setAuthToken, resetAuthToken} from '~/utils/auth'
import { authStore } from './auth'
import { entityDataStore } from './entityData'

const createStore = () => {
  return new Vuex.Store({
    modules :
    {
      auth : authStore,
      entity : entityDataStore,
    },

    state: () => (
    {
      sidebar: false
    }),

    mutations :
    {
      toggleSidebar (state) {
        state.sidebar = !state.sidebar
      },
    },

    actions :
    {
      nuxtServerInit ({dispatch}, context) {
        console.log("Starting server")
        return new Promise((resolve, reject) => {
          const cookies = cookie.parse(context.req.headers.cookie || '')
          if (cookies.hasOwnProperty('sspud-access-token')) {
            console.log("Fetching user");
            setAuthToken(cookies['sspud-access-token'])
            dispatch('fetch', cookies['sspud-access-token'])
              .then(result => {
                console.log("Dispatching fetch method");
                resolve(true)
              })
              .catch(error => {
                console.log('fetch user error', error)
                resetAuthToken()
                resolve(false)
              })
          } else {
            console.log("Resetting user");
            resetAuthToken()
            resolve(false)
          }
        })
      },
      test()
      {
        console.log("Testing");
      }
    }

  });
}

export default createStore;
