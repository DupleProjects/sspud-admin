import axios from 'axios'

export async function setAuthToken (token) {
  axios.defaults.headers.common['tmmgo-access-token'] = token
  return;
}

export async function resetAuthToken () {
  delete axios.defaults.headers.common['tmmgo-access-token']
  return;
}