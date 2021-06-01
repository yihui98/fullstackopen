export const positiveMessage = (content) => {
    return async dispatch => {
      dispatch({
        type: "POSITIVE",
        data: content
      })
      setTimeout(() => {
        dispatch({
            type:"REMOVE"
        })
      }, 5000)
    }
  }

  export const negativeMessage = (content) => {
    return async dispatch => {
      dispatch({
        type: "NEGATIVE",
        data: content
      })
      setTimeout(() => {
        dispatch({
            type:"REMOVE"
        })
      }, 5000)
    }
  }

  const reducer = (state = null, action) => {
    console.log('state now: ', state)
    console.log('action', action)
    switch (action.type){
      case "POSITIVE":{
          return state = {
              content: action.data,
              positive: true
          }
      }
      case "NEGATIVE":{
          return state = {
              content: action.data,
              positive: false
          }
      }
      case "REMOVE" :{
          return state = null
      }

    default:
        return state
    }
}

export default reducer