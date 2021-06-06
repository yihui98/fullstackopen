import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query{
        allAuthors {
            name
            born
            bookCount
            books{
                title
            }
        }
    }
`
export const ALL_BOOKS = gql `
    query{
        allBooks{
            title
            author{
                name
            }
            published
            genres
        }
    }
`
export const ADD_BOOK = gql `
        mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!){
        addBook(
            title: $title
            published: $published
            author: $author
            genres: $genres
        ){
        title
        published
        author{
            name
        }
        genres
    }
}`

export const CHANGE_BIRTH = gql `
    mutation changeBirth($name: String!, $born: Int!){
        editAuthor(
            name: $name
            setBornTo: $born
        ){
            name
        }
    }`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }`

export const ME = gql`
    query{
        me {
            username
            favoriteGenre
        }
    }
`

export const FIND_GENRE = gql`
query allBooksByGenre($genre: String!){
  allBooks(genre: $genre){
      title
      author{
          name
      }
      published
      genres
  }
}
`

export const BOOK_ADDED = gql `
  subscription{
    bookAdded{
      title
      published
      genres
      author{
        name
      }
    }
  }`