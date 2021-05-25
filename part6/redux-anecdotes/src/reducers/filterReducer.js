const initialState = ''

export const changeFilter = (message) => {
    return {
      type: 'Filter',
      data: message
    }
  }

const reducer = (state = initialState, action) => {
    console.log('state now: ', state)
    console.log('action', action)
    switch (action.type){
      case "Filter":
        return state = action.data
    default:
        return state
    }  
  }
  
  export default reducer