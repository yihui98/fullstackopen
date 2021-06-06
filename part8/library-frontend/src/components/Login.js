import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const Login = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [ login, result ] = useMutation(LOGIN)


  useEffect(() => {
      if (result.data){
          const token = result.data.login.value
          props.setToken(token)
          localStorage.setItem("user-token", token)
          props.setPage("authors")
      }
  }, [result.data, props])

  if (!props.show) {
    return null
  }

  const onSubmit = async (event) => {
      event.preventDefault()
      login({variables: {username, password}})
      
      setUsername('')
      setPassword('')

  }


  return (
    <div>
        <form onSubmit = {onSubmit}>
            <div>
            username:
            <input type = "text" value = {username} onChange = {({ target }) => setUsername(target.value)}/>
            </div>
            <div>
            password:
            <input type = "text" value = {password} onChange = {({ target }) => setPassword(target.value)}/>
            </div>
            <div>
                <button type = "submit">login</button>
            </div>
        </form>
        
    </div>
  )
}

export default Login