


export const login = (user) => {
    return async dispatch => {
      dispatch({
        type: "LOGIN",
        data: user
      })
    }
  }

  export const logout = () => {
    return async dispatch => {
      dispatch({
        type: "LOGOUT"
      })
    }
  }

  export const initializeLogin = () => {
    return async dispatch => {
      await dispatch({
        type: 'INIT'
      })
    }
  }

  const reducer = (state = null, action) => {
    console.log('state now: ', state)
    console.log('action', action)
    switch (action.type){
      case "LOGIN":{
          return state = action.data
      }
      case "LOGOUT":{
          return state = null
        }
      case "INIT":{
        return state
      }
    default:
        return state
    }
}

export default reducer