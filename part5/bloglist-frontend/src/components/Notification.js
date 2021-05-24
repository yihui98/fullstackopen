import React from 'react'

const Notification = ({ message, positive }) => {
    const ErrorStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 30,
        border: '1px solid rgba(0,0,0,0.05)',
        borderColor : 'red'
        }
    const NormalStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 30,
        border: '1px solid rgba(0,0,0,0.05)',
        borderColor : 'green'
        }
    if (message === null){
        return null
    } else if (positive){
        return (
            <div style = {NormalStyle}>
            {message}
            </div>
        )
    }
    return (
        <div className = 'error' style = {ErrorStyle}>
        {message}
        </div>
    )

}

export default Notification