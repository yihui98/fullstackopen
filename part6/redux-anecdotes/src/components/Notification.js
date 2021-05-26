
import React from 'react'
//import {useSelector} from 'react-redux'
import {connect} from 'react-redux'

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  //const message = useSelector(state => state.notification)
  const message = props.message
  const noMessage = { display: message === '' ? 'none' : '' }
  
  return (
    <div style = {noMessage}>
      <div style={style}>
        {message}
      </div>
    </div>

  )
}
const mapStateToProps = (state) => {
  return {
    message: state.notification
  }
}
const ConnectedNotifications = connect(mapStateToProps)(Notification)

export default ConnectedNotifications