import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const addComments = async (id, comment ) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment }, config)
  return response.data
}

const increaseLikes = async (blog) => {

  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const deleteBlog = async id => {
  const config = {
    headers: { Authorization: token }
  }
  const url = baseUrl + `/${id}`
  console.log(url)
  const response = await axios.delete(url, config)
  return response.data
}

export default { getAll, create, setToken, increaseLikes, deleteBlog, addComments }