require('dotenv').config()

const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET

console.log(MONGODB_URI)
console.log(JWT_SECRET)

console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

mongoose.set('debug', true)

const typeDefs = gql`
    type Book {
        title: String!
        published: Int!
        author: Author!
        id: ID!
        genres: [String!]!
   }
   type Author {
     name: String!
     born: Int
     books: [Book]!
     bookCount: Int
   }
   type User {
     username: String!
     favoriteGenre: String
     id: ID!
   }
   type Token {
     value: String!
   }


  type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
      me: User
  }
  type Mutation{
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ) : Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ) : Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        var books = await Book.find({})
        if (args.author && args.genre){
          const author = await Author.find({name : args.author})
          books = await Books.find({
            author : {$in: [author._id]},
            genres: {$in: args.genre}
          })
          
        } else if (args.author){
          const author = await Author.findOne({name : args.author})
          books = await Book.find({ author: { $in:  author._id} })

        } else if (args.genre){
          books = await Book.find({ genres: {$in : args.genre}})
        }
        return getAuthor(books)
      }
      ,
      allAuthors: () => Author.find({}).populate('books'),
      me: (root, args, context) => {
        return context.currentUser
      }
    },
  Mutation: {
    addBook: async (root, args, context) =>{
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const existingAuthor = await Author.findOne({name:args.author})

      if (existingAuthor === null){
        try{
          const author = new Author({name: args.author})
          const book = new Book({...args, author : author})
          author.books = author.books.concat(book)
          
          await author.save()
          await book.save()
          
          pubsub.publish('BOOK_ADDED', { bookAdded: book})

          return book
        }catch(error){
          throw new UserInputError(error.message,{
            invalidArgs: args
          })
        }
      }
      try{
        const book = new Book({...args, author : existingAuthor})
        console.log(book)
        existingAuthor.books = existingAuthor.books.concat(book)
        await existingAuthor.save()
        await book.save()
        return book
      } catch(error){
        throw new UserInputError(error.message,{
          invalidArgs: args
        })
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }
        const author = await Author.findOne({name: args.name})
        console.log(author)
        author.born = args.setBornTo
        try{
          await author.save()
        } catch (error){
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
        return author
      },
    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre})

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({username: args.username})
      if (!user || args.password !== 'secret'){
        throw new UserInputError("Wrong credentials")
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }
      jwt.sign(userForToken, JWT_SECRET)
      return {value: jwt.sign(userForToken, JWT_SECRET)}
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const getAuthor = (books) => {
  return books.map(book => {
    return {
      title: book.title, published: book.published, genres: book.genres,
      author: Author.findById(book.author)
    }
  })
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})