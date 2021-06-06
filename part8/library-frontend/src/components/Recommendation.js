import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'


const Recommendations = (props) => {
    const result =  useQuery(ALL_BOOKS)
    const user = useQuery(ME)

    if (result.loading){
      return <div> loading...</div>
    }
    if (!props.show) {
      return null
    }

    if (user.data.me.favoriteGenre === null){
        return(
            <div>
            No Recommendations
            </div>
        )
    }
    var books = []
    var filteredBooks = []
    if (result.data){
      books = result.data.allBooks
    }
    if (user.data){
        console.log(books)
        console.log(user.data.me.favoriteGenre)
        filteredBooks = books.filter((book) => book.genres.includes(user.data.me.favoriteGenre))
    }
    
    return(
        <div>
        <h2> Recommendations </h2>
        <h3> books in your favourite genre {user.favouriteGenre} </h3>
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
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
        
        </div>
    )

}

export default Recommendations