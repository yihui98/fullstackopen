import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button className = "show" onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button className = "hide" onClick={toggleVisibility}>{props.endLabel}</button>
      </div>
    </div>
  )
}

Togglable.displayName = 'Togglable'

Togglable.propTypes ={
  buttonLabel: PropTypes.string.isRequired,
  endLabel: PropTypes.string.isRequired
}

export default Togglable