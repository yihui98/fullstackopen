const initialState = ''

let timeoutID

export const addNotification = (message, time) => {
  return async dispatch => {
      dispatch({
        type: 'MESSAGE',
        data: message
      })
      if (timeoutID){
        clearTimeout(timeoutID)
      }
      timeoutID = setTimeout(() => {
        dispatch(removeNotification())
      }, time * 1000);
  }
}
export const removeNotification = () => {
    return{
        type: "REMOVE"
    }
}

const reducer = (state = initialState, action) => {
    console.log('state now: ', state)
    console.log('action', action)
    switch (action.type){
      case "MESSAGE":
        return state = action.data
      case "REMOVE":
        return state = ''
    default:
        return state
    }  
  }
  
  export default reducer