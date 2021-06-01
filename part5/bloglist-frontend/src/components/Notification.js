import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
    /*
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
        */
    const message = useSelector(state => state.message)

    if (message === null){
        return null
    } else if (message.positive){
        return (
           <Alert variant = "warning">
               {message.content}
           </Alert>
        )
    }
    return (
        <Alert variant = "danger">
            {message.content}
        </Alert>
    )

}

export default Notification