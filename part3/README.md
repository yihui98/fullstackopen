# [Part 3](https://fullstackopen.com/en/part3/node_js_and_express) 

## Node.js and Express

Define Express as a project dependency:

    npm install express

JSX Code:

    const express = require('express')
    const app = express()

    let notes = [
      ...
    ]

    app.get('/', (request, response) => {
      response.send('<h1>Hello World!</h1>')
    })

    app.get('/api/notes', (request, response) => {
      response.json(notes)
    })

    const PORT = 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

## Nodemon 

nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

Installing nodemon as a development dependency:

    npm install --save-dev nodemon
    node_modules/.bin/nodemon index.js //to start nodemon
    
Or add a dedicated npm script to package.json (start with npm run dev)

    {
      // ..
      "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      // ..
    }
    
## Fetching a single resource

We can define parameters for routes in express by using the colon syntax

    app.get('/api/notes/:id', (request, response) => {
      const id = request.params.id
      const note = notes.find(note => note.id === id)
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })

The id parameter can be accessed through the request object.
If a note does not exist, a status error will be thrown.

## Deleting resources

Return either status code 204 (not found) or status code 404 (does not exisit)

    app.delete('/api/notes/:id', (request, response) => {
      const id = Number(request.params.id)
      notes = notes.filter(note => note.id !== id)

      response.status(204).end()
    })

## Receiving data

In order to access the data easily, we need the help of the express json-parser, that is taken to use with command app.use(express.json()).
    
    const express = require('express')
    const app = express()

    app.use(express.json())

    //...

    app.post('/api/notes', (request, response) => {
      const body = request.body

      if (!body.content) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }

      const note = {
        content: body.content,
        important: body.important || false, //set default as false
        date: new Date(),
        id: generateId(),
      }

      notes = notes.concat(note)

      response.json(note)
    })

Without the json-parser, the body property would be undefined. The json-parser functions so that it takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the body property of the request object before the route handler is called.

## Same origin policy and CORS

Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos. Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.

We can allow requests from other origins by using Node's cors middleware.

In your backend repository, install cors with the command

    npm install cors
    
take the middleware to use and allow for requests from all origins:    
 
    const cors = require('cors')

    app.use(cors()) 
 
## [Application to the Internet with heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) 
 
Add a file called Procfile to the project's root to tell Heroku how to start the application.

    web: npm start
 
Change the definition of the port our application uses at the bottom of the index.js file like so:
 
    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
     
Create a Heroku application with the command *heroku create*, commit your code to the repository and move it to Heroku with command *git push heroku main*.  
   
If you are deploying from a git repository where your code is not on the main branch, you will need to run *git push heroku HEAD:master*. If you have already done a push to heroku, you may need to run *git push heroku HEAD:main --force*.   
   
## Frontend production build   
   
When the application is deployed, we must create a production build or a version of the application which is optimized for production.

A production build of applications created with create-react-app can be created with command *npm run build*.   
   
This creates a directory called build (which contains the only HTML file of our application, index.html ) which contains the directory static. Minified version of our application's JavaScript code will be generated to the static directory. Even though the application code is in multiple files, all of the JavaScript will be minified into one file. Actually all of the code from all of the application's dependencies will also be minified into this single file.   
   
### Serving static files from the backend

One option for deploying the frontend is to copy the production build (the build directory) to the root of the backend repository and configure the backend to show the frontend's main page (the file build/index.html) as its main page.

To make express show static content, the page index.html and the JavaScript, etc., it fetches, we need a built-in middleware from express called static.

When we add the following amidst the declarations of middlewares

    app.use(express.static('build'))

whenever express gets an HTTP GET request it will first check if the build directory contains a file corresponding to the request's address. If a correct file is found, express will return it.

### The whole app to the internet

After ensuring that the production version of the application works locally, commit the production build of the frontend to the backend repository, and push the code to Heroku again.

## Proxy

Changes on the frontend have caused it to no longer work in development mode (when started with command *npm start*), as the connection to the backend does not work.

This is due to changing the backend address to a relative URL:

    const baseUrl = '/api/notes'
    
Because in development mode the frontend is at the address localhost:3000, the requests to the backend go to the wrong address localhost:3000/api/notes. The backend is at localhost:3001.

If the project was created with create-react-app, this problem is easy to solve. It is enough to add the following declaration to the package.json file of the frontend repository.

    {
      "dependencies": {
        // ...
      },
      "scripts": {
        // ...
      },
      "proxy": "http://localhost:3001"
    }
   
After a restart, the React development environment will work as a proxy. If the React code does an HTTP request to a server address at http://localhost:3000 not managed by the React application itself (i.e. when requests are not about fetching the CSS or JavaScript of the application), the request will be redirected to the server at http://localhost:3001.   
   
## [MongoDB](https://fullstackopen.com/en/part3/saving_data_to_mongo_db)   

### [Mongoose](https://mongoosejs.com/index.html)

Mongoose could be described as an object document mapper (ODM), and saving JavaScript objects as Mongo documents is straightforward with this library.

    npm install mongoose

First we define the schema of a note that is stored in the noteSchema variable. The schema tells Mongoose how the note objects are to be stored in the database.

    const noteSchema = new mongoose.Schema({
      content: String,
      date: Date,
      important: Boolean,
    })

    const Note = mongoose.model('Note', noteSchema)

Document databases like Mongo are schemaless, meaning that the database itself does not care about the structure of the data that is stored in the database. It is possible to store documents with completely different fields in the same collection.

The idea behind Mongoose is that the data stored in the database is given a schema at the level of the application that defines the shape of the documents stored in any given collection.

#### Creating and saving objects

    const note = new Note({
      content: 'HTML is Easy',
      date: new Date(),
      important: false,
    })

    note.save().then(result => {
      console.log('note saved!')
      mongoose.connection.close()
    })

When the object is saved to the database, the event handler provided to then gets called. The event handler closes the database connection with the command *mongoose.connection.close()*. If the connection is not closed, the program will never finish its execution.


#### Fetching objects from the database

    Note.find({}).then(result => {
      result.forEach(note => {
        console.log(note)
      })
      mongoose.connection.close()
    })      

We could restrict our search to only include important notes like this:

    Note.find({ important: true }).then(result => {
      // ...
    })

## Backend connected to a database

Let's get a quick start by copy pasting the Mongoose definitions to the index.js file:

    const mongoose = require('mongoose')

    // DO NOT SAVE YOUR PASSWORD TO GITHUB!!
    const url =
      'mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

    const noteSchema = new mongoose.Schema({
      content: String,
      date: Date,
      important: Boolean,
    })

    const Note = mongoose.model('Note', noteSchema)

Let's change the handler for fetching all notes to the following form:

    app.get('/api/notes', (request, response) => {
      Note.find({}).then(notes => {
        response.json(notes)
      })
    })

One way to format the objects returned by Mongoose is to modify the toJSON method of the schema, which is used on all instances of the models produced with that schema. Modifying the method works like this:

    noteSchema.set('toJSON', {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
    })

Even though the _id property of Mongoose objects looks like a string, it is in fact an object. The toJSON method we defined transforms it into a string just to be safe. If we didn't make this change, it would cause more harm for us in the future once we start writing tests.

Let's respond to the HTTP request with a list of objects formatted with the toJSON method:

    app.get('/api/notes', (request, response) => {
      Note.find({}).then(notes => {
        response.json(notes)
      })
    })

Now the notes variable is assigned to an array of objects returned by Mongo. When the response is sent in the JSON format, the toJSON method of each object in the array is called automatically by the JSON.stringify method.

### Extract database configuration into its own module

Let's create a new directory for the module called models, and add a file called note.js:

    const mongoose = require('mongoose')

    const url = process.env.MONGODB_URI

    console.log('connecting to', url)

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
      .then(result => {
        console.log('connected to MongoDB')
      })
      .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
      })

    const noteSchema = new mongoose.Schema({
      content: String,
      date: Date,
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

Importing the module happens by adding the following line to index.js:

    const Note = require('./models/note')

## [dotenv library](https://github.com/motdotla/dotenv#readme)

    npm install dotenv

To use the library, we create a .env file at the root of the project. The environment variables are defined inside of the file, and it can look like this:

    MONGODB_URI='mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
    PORT=3001

The .env file should be gitignored right away, since we do not want to publish any confidential information publicly online!

The environment variables defined in the .env file can be taken into use with the expression require('dotenv').config() and you can reference them in your code just like you would reference normal environment variables, with the familiar process.env.MONGODB_URI syntax.

It's important that dotenv gets imported before the note model is imported. This ensures that the environment variables from the .env file are available globally before the code from the other modules is imported.

## Using databases in route handlers

Creating a new note is accomplished like this:

    app.post('/api/notes', (request, response) => {
      const body = request.body

      if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
      }

      const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
      })

      note.save().then(savedNote => {
        response.json(savedNote)
      })
    })

The savedNote parameter in the callback function is the saved and newly created note. The data sent back in the response is the formatted version created with the toJSON method:

Using Mongoose's findById method, fetching an individual note gets changed into the following:

    app.get('/api/notes/:id', (request, response) => {
      Note.findById(request.params.id).then(note => {
        response.json(note)
      })
    })

The easiest way to delete a note from the database is with the findByIdAndRemove method:

    app.delete('/api/notes/:id', (request, response, next) => {
      Note.findByIdAndRemove(request.params.id)
        .then(result => {
          response.status(204).end()
        })
        .catch(error => next(error))
    })

The toggling of the importance of a note can be easily accomplished with the findByIdAndUpdate method.

    app.put('/api/notes/:id', (request, response, next) => {
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

## Validation and ESLint

One smarter way of validating the format of the data before it is stored in the database, is to use the validation functionality available in Mongoose.

We can define specific validation rules for each field in the schema:

    const noteSchema = new mongoose.Schema({
      content: {
        type: String,
        minLength: 5,
        required: true
      },
      date: { 
        type: Date,
        required: true
      },
      important: Boolean
    })

## Deploying the database backend to production

The environment variables defined in dotenv will only be used when the backend is not in production mode, i.e. Heroku.

We defined the environment variables for development in file .env, but the environment variable that defines the database URL in production should be set to Heroku with the heroku config:set command.

    $ heroku config:set MONGODB_URI=mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true

If the command causes an error, give the value of MONGODB_URI in apostrophes:

    $ heroku config:set MONGODB_URI='mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true'

## Lint:

Generically, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.

In the JavaScript universe, the current leading tool for static analysis aka. "linting" is [ESlint](https://eslint.org/).

    npm install eslint --save-dev

After this we can initialize a default ESlint configuration with the command:

    node_modules/.bin/eslint --init
    
It is recommended to create a separate npm script for linting:    
    
    {
      // ...
      "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        // ...
        "lint": "eslint ."
      },
      // ...
    }    
    
Now the npm run lint command will check every file in the project.

Also the files in the build directory get checked when the command is run. We do not want this to happen, and we can accomplish this by creating an .eslintignore file in the project's root with the following contents:    
    
    build
    
Eslint configurations are stored in .eslintrc.js

    module.exports = {
      'env': {
        'commonjs': true,
        'es2021': true,
        'node': true
      },
      'extends': 'eslint:recommended',
      'parserOptions': {
        'ecmaVersion': 12
      },
      'rules': {
        'indent': [
          'error',
          2
        ],
        'linebreak-style': [
          'error',
          'unix'
        ],
        'quotes': [
          'error',
          'single'
        ],
        'semi': [
          'error',
          'never'
        ],
        'no-console': 0,
      }
    }
    
    
