import React, { useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { ALL_BOOKS, FIND_GENRE } from '../queries'

const Books = (props) => {

  const [getGenre, result] = useLazyQuery(FIND_GENRE)
  const [genre, setGenre] = useState(null) 
  const [books, setBooks] = useState([])
  const [genreType, setGenreType] = useState('')
  
  const results = useQuery(ALL_BOOKS)
  const allGenres = []

  const showGenre = (genre) =>{
    getGenre({variables: { genre: genre}})
    setGenreType(genre)
  }
  useEffect(() =>{
    if (results.loading){
      return <div> loading...</div>
    }
    if (results.data){
      setBooks(results.data.allBooks)
    }
  }, [results])

  books.map(book =>
    book.genres.forEach(element => {
      if (!allGenres.includes(element)){
        allGenres.push(element)
      }
    }))

  useEffect(() =>{
    console.log("RESULTGENRE", result)
    if (result.data){
      setGenre(result.data.allBooks)
    }
  }, [result]) 


  if (!props.show) {
    return null
  }

  if (genre){
    return (
      <div>
        <h2>books</h2>
        <h3> in genre {genreType} </h3>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                author
              </th>
              <th>
                published
              </th>
            </tr>
            {genre.map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )}
          </tbody>
        </table>
        <button onClick = {() => setGenre(null)}> all genres  </button>
    </div>
)}

  return (
    <div>
      <h2>books</h2>
      <h3> in genre {genre} </h3>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {allGenres.map(genre =>
      <button key = {genre} onClick = {() => showGenre(genre)}> {genre} </button>
      )}
      <button onClick = {() => setGenre(null)}> all genres  </button>
    </div>
  )
}

export default Books