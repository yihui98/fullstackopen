# [Part 4](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing)

## Project structure

    ├── index.js
    ├── app.js
    ├── build
    │   └── ...
    ├── controllers
    │   └── notes.js
    ├── models
    │   └── note.js
    ├── package-lock.json
    ├── package.json
    ├── utils
    │   ├── config.js
    │   ├── logger.js
    │   └── middleware.js  
    
### Extracting logging into its own module
    
If we wanted to start writing logs to a file or send them to an external logging service like [graylog](https://www.graylog.org/) or [papertrail](https://www.papertrail.com/) we would only have to make changes in one place.

Let's separate all printing to the console to its own module utils/logger.js:

    const info = (...params) => {
      console.log(...params)
    }

    const error = (...params) => {
      console.error(...params)
    }

    module.exports = {
      info, error
    }

The logger has two functions, info for printing normal log messages, and error for all error messages.

### Extracting handling of environment variables into a separate utils/config.js file: 

    require('dotenv').config()

    const PORT = process.env.PORT
    const MONGODB_URI = process.env.MONGODB_URI

    module.exports = {
      MONGODB_URI,
      PORT
    }

### Extracting handling of routes into a separate controllers/note.js file: 

    const notesRouter = require('express').Router()
    const Note = require('../models/note')

    notesRouter.get('/', (request, response) => {
      Note.find({}).then(notes => {
        response.json(notes)
      })
    })

    notesRouter.get('/:id', (request, response, next) => {
      Note.findById(request.params.id)
        .then(note => {
          if (note) {
            response.json(note)
          } else {
            response.status(404).end()
          }
        })
        .catch(error => next(error))
    })

    notesRouter.post('/', (request, response, next) => {
      const body = request.body

      const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
      })

      note.save()
        .then(savedNote => {
          response.json(savedNote)
        })
        .catch(error => next(error))
    })

    notesRouter.delete('/:id', (request, response, next) => {
      Note.findByIdAndRemove(request.params.id)
        .then(() => {
          response.status(204).end()
        })
        .catch(error => next(error))
    })

    notesRouter.put('/:id', (request, response, next) => {
      const body = request.body

      const note = {
        content: body.content,
        important: body.important,
      }

      Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
          response.json(updatedNote)
        })
        .catch(error => next(error))
    })

    module.exports = notesRouter
    
### Extracting custom middleware into a seperate utils/middleware.js module:

    const logger = require('./logger')

    const requestLogger = (request, response, next) => {
      logger.info('Method:', request.method)
      logger.info('Path:  ', request.path)
      logger.info('Body:  ', request.body)
      logger.info('---')
      next()
    }

    const unknownEndpoint = (request, response) => {
      response.status(404).send({ error: 'unknown endpoint' })
    }

    const errorHandler = (error, request, response, next) => {
      logger.error(error.message)

      if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }

      next(error)
    }

    module.exports = {
      requestLogger,
      unknownEndpoint,
      errorHandler
    }

### Extracting note model into a seperate models/note.js module:

    const mongoose = require('mongoose')

    const noteSchema = new mongoose.Schema({
      content: {
        type: String,
        required: true,
        minlength: 5
      },
      date: {
        type: Date,
        required: true,
      },
      important: Boolean,
    })

    noteSchema.set('toJSON', {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
    })

    module.exports = mongoose.model('Note', noteSchema)

### Final app.js file

    const config = require('./utils/config')
    const express = require('express')
    const app = express()
    const cors = require('cors')
    const notesRouter = require('./controllers/notes')
    const middleware = require('./utils/middleware')
    const logger = require('./utils/logger')
    const mongoose = require('mongoose')

    logger.info('connecting to', config.MONGODB_URI)

    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
      .then(() => {
        logger.info('connected to MongoDB')
      })
      .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
      })

    app.use(cors())
    app.use(express.static('build'))
    app.use(express.json())
    app.use(middleware.requestLogger)

    app.use('/api/notes', notesRouter)

    app.use(middleware.unknownEndpoint)
    app.use(middleware.errorHandler)

    module.exports = app

## Testing Node applications

[Jest](https://jestjs.io/) is a natural choice for this course, as it works well for testing backends, and it shines when it comes to testing React applications.

    npm install --save-dev jest

Let's define the npm script test to execute tests with Jest and to report about the test execution with the verbose style:

    {
      //...
      "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
        "deploy": "git push heroku master",
        "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
        "logs:prod": "heroku logs --tail",
        "lint": "eslint .",
        "test": "jest --verbose"
      },
      //...
    }

Jest requires one to specify that the execution environment is Node. This can be done by adding the following to the end of package.json:

    {
     //...
     "jest": {
       "testEnvironment": "node"
     }
    }

Alternatively, Jest can look for a configuration file with the default name jest.config.js, where we can define the execution environment like this:

    module.exports = {
      testEnvironment: 'node',
    };

The ESLint configuration we added to the project in the previous part complains about the test and expect commands in our test file, since the configuration does not allow globals. Let's get rid of the complaints by adding "jest": true to the env property in the .eslintrc.js file.

    module.exports = {
      'env': {
        'commonjs': true,
        'es2021': true,
        'node': true,
        'jest': true,
      },
      'extends': 'eslint:recommended',
      'parserOptions': {
        'ecmaVersion': 12
      },
      "rules": {
        // ...
      },
    }


## Test environment

The convention in Node is to define the execution mode of the application with the NODE_ENV environment variable. In our current application, we only load the environment variables defined in the .env file if the application is not in production mode.

It is common practice to define separate modes for development and testing.

Next, let's change the scripts in our package.json so that when tests are run, NODE_ENV gets the value test:

    {
      // ...
      "scripts": {
        "start": "NODE_ENV=production node index.js",
        "dev": "NODE_ENV=development nodemon index.js",
        "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
        "deploy": "git push heroku master",
        "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
        "logs:prod": "heroku logs --tail",
        "lint": "eslint .",
        "test": "NODE_ENV=test jest --verbose --runInBand"
      },
      // ...
    }

We also added the runInBand option to the npm script that executes the tests. This option will prevent Jest from running tests in parallel; we will discuss its significance once our tests start using the database.

We specified the mode of the application to be development in the npm run dev script that uses nodemon. We also specified that the default npm start command will define the mode as production.

There is a slight issue in the way that we have specified the mode of the application in our scripts: it will not work on Windows. We can correct this by installing the cross-env package as a development dependency with the command:

    npm install --save-dev cross-env

Now we can modify the way that our application runs in different modes. As an example of this, we could define the application to use a separate test database when it is running tests.

    require('dotenv').config()

    const PORT = process.env.PORT

    const MONGODB_URI = process.env.NODE_ENV === 'test' 
      ? process.env.TEST_MONGODB_URI
      : process.env.MONGODB_URI

    module.exports = {
      MONGODB_URI,
      PORT
    }

## [supertest](https://github.com/visionmedia/supertest)

We will install the package as a development dependency:

    npm install --save-dev supertest

Let's write our first test in the tests/note_api.test.js file:

    const mongoose = require('mongoose')
    const supertest = require('supertest')
    const app = require('../app')

    const api = supertest(app)

    test('notes are returned as json', async () => {
      await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    afterAll(() => {
      mongoose.connection.close()
    })

The test imports the Express application from the app.js module and wraps it with the supertest function into a so-called superagent object. This object is assigned to the api variable and tests can use it for making HTTP requests to the backend.

When running your tests you may run across the following console warning:
![image](https://user-images.githubusercontent.com/67811876/123579102-cc5ec400-d809-11eb-8995-8d6b95793c63.png)


If this occurs, let's follow the instructions and add a jest.config.js file at the root of the project with the following content:

    module.exports = {
      testEnvironment: 'node'
    }


## Initializing the database before tests

Testing appears to be easy and our tests are currently passing. However, our tests are bad as they are dependent on the state of the database. In order to make our tests more robust, we have to reset the database and generate the needed test data in a controlled manner before we run the tests.

Let's initialize the database before every test with the beforeEach function:

    const mongoose = require('mongoose')
    const supertest = require('supertest')
    const app = require('../app')
    const api = supertest(app)
    const Note = require('../models/note')
    const initialNotes = [
      {
        content: 'HTML is easy',
        date: new Date(),
        important: false,
      },
      {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
      },
    ]
    beforeEach(async () => {
      await Note.deleteMany({})
      let noteObject = new Note(initialNotes[0])
      await noteObject.save()
      noteObject = new Note(initialNotes[1])
      await noteObject.save()
    })
    // ...

### Running tests one by one

The npm test command executes all of the tests of the application. When we are writing tests, it is usually wise to only execute one or two tests. Jest offers a few different ways of accomplishing this, one of which is the only method. If tests are written across many files, this method is not great.

The following command only runs the tests found in the tests/note_api.test.js file:

    npm test -- tests/note_api.test.js

The -t option can be used for running tests with a specific name:

    npm test -- -t "a specific note is within the returned notes"

The provided parameter can refer to the name of the test or the describe block. The parameter can also contain just a part of the name. The following command will run all of the tests that contain notes in their name:

    npm test -- -t 'notes'

When running a single test, the mongoose connection might stay open if no tests using the connection are run. The problem might be due to the fact that supertest primes the connection, but Jest does not run the afterAll portion of the code.

## async/await

The async/await syntax that was introduced in ES7 makes it possible to use asynchronous functions that return a promise in a way that makes the code look synchronous.

By chaining promises we could keep the situation somewhat under control, and avoid callback hell by creating a fairly clean chain of then method calls. We have seen a few of these during the course. To illustrate this, you can view an artificial example of a function that fetches all notes and then deletes the first one:

    Note.find({})
      .then(notes => {
        return notes[0].remove()
      })
      .then(response => {
        console.log('the first note is removed')
        // more code here
      })
      
The slightly complicated example presented above could be implemented by using await like this:

    const notes = await Note.find({})
    const response = await notes[0].remove()

    console.log('the first note is removed')

The code looks exactly like synchronous code. The execution of code pauses at const notes = await Note.find({}) and waits until the related promise is fulfilled, and then continues its execution to the next line. When the execution continues, the result of the operation that returned a promise is assigned to the notes variable.

There are a few important details to pay attention to when using async/await syntax. In order to use the await operator with asynchronous operations, they have to return a promise. This is not a problem as such, as regular asynchronous functions using callbacks are easy to wrap around promises.

The await keyword can't be used just anywhere in JavaScript code. Using await is possible only inside of an async function.

### async/await in the backend

The route for fetching all notes gets changed to the following:

    notesRouter.get('/', async (request, response) => { 
      const notes = await Note.find({})
      response.json(notes)
    })

With async/await the recommended way of dealing with exceptions is the old and familiar try/catch mechanism:

    notesRouter.post('/', async (request, response, next) => {
      const body = request.body

      const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
      })
      try { 
        const savedNote = await note.save()
        response.json(savedNote)
      } catch(exception) {
        next(exception)
      }
    })

The catch block simply calls the next function, which passes the request handling to the error handling middleware.

## Eliminating the try-catch

The express-async-errors library has a solution for this.
  
    npm install express-async-errors

Using the library is very easy. You introduce the library in app.js:

    const config = require('./utils/config')
    const express = require('express')
    require('express-async-errors')
    const app = express()
    const cors = require('cors')
    const notesRouter = require('./controllers/notes')
    const middleware = require('./utils/middleware')
    const logger = require('./utils/logger')
    const mongoose = require('mongoose')

    // ...

    module.exports = app

The 'magic' of the library allows us to eliminate the try-catch blocks completely. For example the route for deleting a note

    notesRouter.delete('/:id', async (request, response, next) => {
      try {
        await Note.findByIdAndRemove(request.params.id)
        response.status(204).end()
      } catch (exception) {
        next(exception)
      }
    })

becomes

    notesRouter.delete('/:id', async (request, response) => {
      await Note.findByIdAndRemove(request.params.id)
      response.status(204).end()
    })

Because of the library, we do not need the next(exception) call anymore. The library handles everything under the hood. If an exception occurs in a async route, the execution is automatically passed to the error handling middleware.

## User administration

Let's start by adding information about users to the database. There is a one-to-many relationship between the user (User) and notes (Note):

![image](https://user-images.githubusercontent.com/67811876/123581636-e5b63f00-d80e-11eb-98bc-e02af2bba986.png)

If we were working with a relational database the implementation would be straightforward. Both resources would have their separate database tables, and the id of the user who created a note would be stored in the notes table as a foreign key.

When working with document databases the situation is a bit different, as there are many different ways of modeling the situation.

The existing solution saves every note in the notes collection in the database. If we do not want to change this existing collection, then the natural choice is to save users in their own collection, users for example.

Like with all document databases, we can use object id's in Mongo to reference documents in other collections. This is similar to using foreign keys in relational databases.

### References across collections

In this case, we make the decision to store the ids of the notes created by the user in the user document. Let's define the model for representing a user in the models/user.js file:

    const mongoose = require('mongoose')

    const userSchema = new mongoose.Schema({
      username: String,
      name: String,
      passwordHash: String,
      notes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Note'
        }
      ],
    })

    userSchema.set('toJSON', {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash
      }
    })

    const User = mongoose.model('User', userSchema)

    module.exports = User

The ids of the notes are stored within the user document as an array of Mongo ids.

Let's expand the schema of the note defined in the model/note.js file so that the note contains information about the user who created it:

    const noteSchema = new mongoose.Schema({
      content: {
        type: String,
        required: true,
        minlength: 5
      },
      date: Date,
      important: Boolean,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    })

In stark contrast to the conventions of relational databases, references are now stored in both documents: the note references the user who created it, and the user has an array of references to all of the notes created by them.

## Creating users

Users have a unique username, a name and something called a passwordHash. The password hash is the output of a one-way hash function applied to the user's password. It is never wise to store unencrypted plain text passwords in the database!

Let's install the bcrypt package for generating the password hashes:

    npm install bcrypt

The contents of the file that defines the router are as follows:

    const bcrypt = require('bcrypt')
    const usersRouter = require('express').Router()
    const User = require('../models/user')

    usersRouter.post('/', async (request, response) => {
      const body = request.body

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(body.password, saltRounds)

      const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
      })

      const savedUser = await user.save()

      response.json(savedUser)
    })

    module.exports = usersRouter
    
The password sent in the request is not stored in the database. We store the hash of the password that is generated with the bcrypt.hash function.    
    
Let's validate the uniqueness of the username with the help of Mongoose validators. As we mentioned in exercise 3.19, Mongoose does not have a built-in validator for checking the uniqueness of a field. We can find a ready-made solution for this from the mongoose-unique-validator npm package. Let's install it:    
    
    npm install mongoose-unique-validator    
    
We must make the following changes to the schema defined in the models/user.js file:    
    
    const mongoose = require('mongoose')
    const uniqueValidator = require('mongoose-unique-validator')

    const userSchema = new mongoose.Schema({
      username: {
        type: String,
        unique: true
      },
      name: String,
      passwordHash: String,
      notes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Note'
        }
      ],
    })

    userSchema.plugin(uniqueValidator)

    // ..    
    
## Creating a new note    
    
The code for creating a new note has to be updated so that the note is assigned to the user who created it.    

    const User = require('../models/user')

    //...

    notesRouter.post('/', async (request, response, next) => {
      const body = request.body

      const user = await User.findById(body.userId)

      const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        date: new Date(),
        user: user._id
      })

      const savedNote = await note.save()
      user.notes = user.notes.concat(savedNote._id)
      await user.save()

      response.json(savedNote)
    })    
    
 ## Populate   
    
We would like our API to work in such a way, that when an HTTP GET request is made to the /api/users route, the user objects would also contain the contents of the user's notes, and not just their id. In a relational database, this functionality would be implemented with a join query.    
    
Mongoose accomplishes the join by doing multiple queries, which is different from join queries in relational databases which are transactional, meaning that the state of the database does not change during the time that the query is made.   
    
The Mongoose join is done with the populate method. Let's update the route that returns all users first:    
    
    usersRouter.get('/', async (request, response) => {
      const users = await User
        .find({}).populate('notes')

      response.json(users)
    })    
    
We can use the populate parameter for choosing the fields we want to include from the documents. The selection of fields is done with the Mongo syntax:    
    
    usersRouter.get('/', async (request, response) => {
      const users = await User
        .find({}).populate('notes', { content: 1, date: 1 })

      response.json(users)
    });    
    
## Token authentication    
    
Let's first implement the functionality for logging in. Install the jsonwebtoken library, which allows us to generate JSON web tokens.

    npm install jsonwebtoken

The code for login functionality goes to the file controllers/login.js.

    const jwt = require('jsonwebtoken')
    const bcrypt = require('bcrypt')
    const loginRouter = require('express').Router()
    const User = require('../models/user')

    loginRouter.post('/', async (request, response) => {
      const body = request.body

      const user = await User.findOne({ username: body.username })
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        return response.status(401).json({
          error: 'invalid username or password'
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      const token = jwt.sign(userForToken, process.env.SECRET)

      response
        .status(200)
        .send({ token, username: user.username, name: user.name })
    })

    module.exports = loginRouter
    
The token has been digitally signed using a string from the environment variable SECRET as the secret. The digital signature ensures that only parties who know the secret can generate a valid token. The value for the environment variable must be set in the .env file.

## Limiting creating new notes to logged in users

There are several ways of sending the token from the browser to the server. We will use the Authorization header. The header also tells which authentication scheme is used. This can be necessary if the server offers multiple ways to authenticate. Identifying the scheme tells the server how the attached credentials should be interpreted.

The Bearer scheme is suitable to our needs.

In practice, this means that if the token is for example, the string eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW, the Authorization header will have the value:

    Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW

Creating new notes will change like so:

    const jwt = require('jsonwebtoken')

    // ...
    const getTokenFrom = request => {
      const authorization = request.get('authorization')
      if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
      }
      return null
    }

    notesRouter.post('/', async (request, response) => {
      const body = request.body
      const token = getTokenFrom(request)
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
      const user = await User.findById(decodedToken.id)

      const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        date: new Date(),
        user: user._id
      })

      const savedNote = await note.save()
      user.notes = user.notes.concat(savedNote._id)
      await user.save()

      response.json(savedNote)
    })

When the identity of the maker of the request is resolved, the execution continues as before.

## Problems of Token-based authentication

Token authentication is pretty easy to implement, but it contains one problem. Once the API user, eg. a React app gets a token, the API has a blind trust to the token holder. What if the access rights of the token holder should be revoked?

There are two solutions to the problem. Easier one is to limit the validity period of a token:

    loginRouter.post('/', async (request, response) => {
      const body = request.body

      const user = await User.findOne({ username: body.username })
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        return response.status(401).json({
          error: 'invalid username or password'
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      // token expires in 60*60 seconds, that is, in one hour
      const token = jwt.sign(
        userForToken, 
        process.env.SECRET,
        { expiresIn: 60*60 }
      )

      response
        .status(200)
        .send({ token, username: user.username, name: user.name })
    })

Once the token expires, the client app needs to get a new token. Usually this happens by forcing the user to relogin to the app.

The error handling middleware should be extended to give a proper error in the case of a expired token:

    const errorHandler = (error, request, response, next) => {
      logger.error(error.message)

      if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
          error: 'invalid token'
        })
      } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
          error: 'token expired'
        })
      }

      next(error)
    }

The shorter the expiration time, the more safe the solution is. So if the token gets into wrong hands, or the user access to the system needs to be revoked, the token is usable only a limited amount of time. On the other hand, a short expiration time forces is a potential pain to a user, one must login to the system more frequently.

The other solution is to save info about each token to backend database and to check for each API request if the access right corresponding to the token is still valid. With this scheme, the access rights can be revoked at any time. This kind of solution is often called a server side session.

The negative aspect of server side sessions is the increased complexity in the backend and also the effect on performance since the token validity needs to be checked for each API request from database. A database access is considerably slower compared to checking the validity from the token itself. That is why it is a quite common to save the session corresponding to a token to a key-value-database such as Redis that is limited in functionality compared to eg. MongoDB or relational database but extremely fast in some usage scenarios.

When server side sessions are used, the token is quite often just a random string, that does not include any information about the user as it is quite often the case when jwt-tokens are used. For each API request the server fetches the relevant information about the identitity of the user from the database. It is also quite usual that instead of using Authorization-header, cookies are used as the mechanism for transferring the token between the client and the server.








