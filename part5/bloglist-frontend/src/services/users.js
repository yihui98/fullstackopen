import axios from 'axios'
const baseUrl = '/api/users'

const getID = (user) => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  }

export default {getID}