import anecdoteService from '../services/anecdotes'

export const asAnecdote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.addAnecdote(anecdote)
    dispatch({
      type: "ADD",
      data: newAnecdote
    })
  }
}

export const vote = (anecdote) => {
  const id = anecdote.id
  return async dispatch => {
    await anecdoteService.changeAnecdote(anecdote)
    dispatch({
    type: 'VOTE',
    id: id
  })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch =>{
    const anecdotes = await anecdoteService.getAll()
    console.log("ANEC", anecdotes)
    await dispatch({
      type: 'INIT',
      data: anecdotes
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type){
    case "ADD":
      return state.concat(action.data)
    case "VOTE":
      const id = action.id
      const ancedoteToChange = state.find(n => n.id === id)
      const changedAncedote = {
        ...ancedoteToChange,
        votes: ancedoteToChange.votes + 1
      }
      return state.map(ancedote =>
        ancedote.id !== id ? ancedote : changedAncedote)
    case "INIT":
      return action.data
  default:
      return state
  }


}

export default reducer