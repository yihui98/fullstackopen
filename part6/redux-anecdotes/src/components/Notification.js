
import React from 'react'
import {useSelector} from 'react-redux'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  const message = useSelector(state => state.notification)
  const noMessage = { display: message === '' ? 'none' : '' }
  
  return (
    <div style = {noMessage}>
      <div style={style}>
        {message}
      </div>
    </div>

  )
}

export default Notification