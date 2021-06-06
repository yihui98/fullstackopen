
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendation from './components/Recommendation'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from './queries'



const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const handleLogout = (event) =>{
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const result = useQuery(ALL_BOOKS)

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) =>{
      console.log(subscriptionData)
      const addedBook = subscriptionData.data.addedBook
      window.alert(`${addedBook.title} by ${addedBook.author.name} has been added`)
    }
  })

  if (result.loading){
    return <div> loading...</div>
  }



  if (!token){
    return(
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>
        <Authors
        show={page === 'authors' } token = {false}
        />

        <Books
        show={page === 'books'} books = {result.data.allBooks}
        />

        <Login
        show = {page === 'login'} setPage = {setPage} setToken = {setToken}
        />
      </div>
    )
  }
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommendation')}>recommend</button>
        <button onClick= {handleLogout}>logout</button>
      </div>
      <Authors
        show={page === 'authors' } token = {true}
        />

        <Books
        show={page === 'books'}
        />

        <NewBook
        show={page === 'add'}
        />

        <Recommendation 
        show = {page === 'recommendation'}
        />
    </div>
  )
}

export default App