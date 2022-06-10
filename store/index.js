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
        // console.log("Starting server")
        return new Promise(async (resolve, reject) => {
          const cookies = cookie.parse(context.req.headers.cookie || '')
          // console.log('cookies[sspud-access-token]', cookies['sspud-access-token'])
          if (cookies.hasOwnProperty('sspud-access-token')) {
            // console.log("Fetching user");
            await setAuthToken(cookies['sspud-access-token'])
            dispatch('fetch', cookies['sspud-access-token'])
              .then(result => {
                // console.log("Dispatching fetch method");
                resolve(true)
              })
              .catch(error => {
                console.log('fetch user error', error)
                resetAuthToken()
                resolve(false)
              })
          } else {
            // console.log("Resetting user");
            await resetAuthToken()
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
