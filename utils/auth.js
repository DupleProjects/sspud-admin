import axios from 'axios'

export async function setAuthToken (token) {
  axios.defaults.headers.common['Authorization'] = "Bearer " + token
  return;
}

export async function resetAuthToken () {
  delete axios.defaults.headers.common['Authorization']
  return;
}
