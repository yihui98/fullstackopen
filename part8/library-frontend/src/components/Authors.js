  
import React, {useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, CHANGE_BIRTH } from '../queries'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [ name, setName ] = useState('')
  const [ born, setBorn ] = useState('')
  const [ changeBirth ] = useMutation(CHANGE_BIRTH,{
    refetchQueries: [ {query: ALL_AUTHORS}]
  })

  
  console.log("AUTHORS", result)
  if (result.loading){
    return <div> loading...</div>
  }
  
  if (!props.show) {
    return null
  }
  var authors = []
  if (result.data){
    authors = result.data.allAuthors
  }
  console.log("AUTHORS", authors)

  const submit = async (event) => {
    event.preventDefault()
    changeBirth({ variables: { name, born: Number(born) } })
    console.log('add book...')

    setName('')
    setBorn('')
  }
  if (props.token){
    return (
      <div>
        <div>
          <h2>authors</h2>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>
                  born
                </th>
                <th>
                  books
                </th>
              </tr>
              {authors.map(a =>
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>{a.born}</td>
                  <td>{a.books.length}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <h2> Set birthyear </h2>
        <form onSubmit = {submit}>
          <div>
            <label>
              name
              <select value = {name} onChange={({ target }) => setName(target.value)}>
              {authors.map(author => 
                <option value = {author.name}>{author.name}</option>
              )}
              </select>
            </label>
          </div>
          <div>
            born
            <input
              type = 'number'
              value = {born}
              onChange = {({ target }) => setBorn(target.value)}
              />
          </div>
          <button type='submit'>update author</button>
        </form>
        </div>
  
      </div>
    )

  }
  return (
    <div>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                born
              </th>
              <th>
                books
              </th>
            </tr>
            {authors.map(a =>
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.books.length}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  )
  
}

export default Authors
