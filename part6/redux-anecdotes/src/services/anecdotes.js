import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addAnecdote = async(content) => {
    const anecdote = {
        content: content,
        votes:0
    }
    const response = await axios.post(baseUrl, anecdote)
    return response.data
}

const changeAnecdote = async (anecdote) =>{
  const NewAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1
  }
  const url = `${baseUrl}/${anecdote.id}`
  const response = await axios.put(url, NewAnecdote)
  return response.data
}

export default { getAll, addAnecdote, changeAnecdote }