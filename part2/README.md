# Part 2

## Getting data from a server

Install JSON server globally:

    npm install -g json-server
    
However, a global installation is not necessary. From the root directory of your app, we can run the json-server using the command npx:

    npx json-server --port 3001 --watch db.json

The json-server starts running on port 3000 by default; but since projects created using create-react-app reserve port 3000, we must define an alternate port, such as port 3001, for the json-server.

json-server stores all the data in the db.json file, which resides on the server. In the real world, data would be stored in some kind of database. However, json-server is a handy tool that enables the use of server-side functionality in the development phase without the need to program any of it.

In Java the code executes line by line and stops to wait for the HTTP request, which means waiting for the command request.get(...) to finish. The data returned by the command, in this case the notes, are then stored in a variable, and we begin manipulating the data in the desired manner.

On the other hand, JavaScript engines, or runtime environments, follow the asynchronous model. In principle, this requires all IO-operations (with some exceptions) to be executed as non-blocking. This means that the code execution continues immediately after calling an IO function, without waiting for it to return.

When an asynchronous operation is completed, or more specifically, at some point after its completion, the JavaScript engine calls the event handlers registered to the operation.

Currently, JavaScript engines are single-threaded, which means that they cannot execute code in parallel. As a result, it is a requirement in practice to use a non-blocking model for executing IO operations. Otherwise, the browser would "freeze" during, for instance, the fetching of data from a server.

Another consequence of this single-threaded nature of JavaScript engines is that if some code execution takes up a lot of time, the browser will get stuck for the duration of the execution. 

### Using the axios library for communication between the browser and server

Installing it from the command line:

    npm install axios
    
Installing json-server as a development dependency (only used during development)

    npm install json-server --save-dev
    
Adding a server script to *package.json* file

      {
        // ... 
        "scripts": {
          "start": "react-scripts start",
          "build": "react-scripts build",
          "test": "react-scripts test",
          "eject": "react-scripts eject",
          "server": "json-server -p3001 --watch db.json"
        },
      }

We can now conveniently, without parameter definitions, start the json-server from the project root directory with the command:

    npm run server
 
### Axios and promises

Axios' method get returns a promise.

The documentation on Mozilla's site states the following about promises:

    A Promise is an object representing the eventual completion or failure of an asynchronous operation.

In other words, a promise is an object that represents an asynchronous operation. A promise can have three distinct states:

1. The promise is pending: It means that the final value (one of the following two) is not available yet.
2. The promise is fulfilled: It means that the operation has completed and the final value is available, which generally is a successful operation. This state is sometimes also called resolved.
3. The promise is rejected: It means that an error prevented the final value from being determined, which generally represents a failed operation.

If, and when, we want to access the result of the operation represented by the promise, we must register an event handler to the promise. This is achieved using the method then:

    import axios from 'axios'

    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        const notes = response.data
        console.log(notes)
      })
   
### Effect-hooks

The Effect Hook lets you perform side effects in function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.

By default, effects run after every completed render, but you can choose to fire it only when certain values have changed

    const App = () => {
      const [notes, setNotes] = useState([])
      const [newNote, setNewNote] = useState('')
      const [showAll, setShowAll] = useState(true)

      useEffect(() => {
        console.log('effect')
        axios
          .get('http://localhost:3001/notes')
          .then(response => {
            console.log('promise fulfilled')
            setNotes(response.data)
          })
      }, [])
      console.log('render', notes.length, 'notes')

      // ...
    }

## REST

In REST terminology, we refer to individual data objects, such as the notes in our application, as resources. Every resource has a unique address associated with it - its URL. According to a general convention used by json-server, we would be able to locate an individual note at the resource URL notes/3, where 3 is the id of the resource. The notes url, on the other hand, would point to a resource collection containing all the notes.

Resources are fetched from the server with HTTP GET requests. For instance, an HTTP GET request to the URL notes/3 will return the note that has the id number 3. An HTTP GET request to the notes URL would return a list of all notes.

Creating a new resource for storing a note is done by making an HTTP POST request to the notes URL according to the REST convention that the json-server adheres to. The data for the new note resource is sent in the body of the request.

json-server requires all data to be sent in JSON format. What this means in practice is that the data must be a correctly formatted string, and that the request must contain the Content-Type request header with the value application/json.

### Sending data to the server

    addNote = event => {
      event.preventDefault()
      const noteObject = {
        content: newNote,
        date: new Date(),
        important: Math.random() > 0.5,
      }

      axios
        .post('http://localhost:3001/notes', noteObject)
        .then(response => {
          setNotes(notes.concat(response.data))
          setNewNote('')
        })
    }
### Editing data in the server

    const toggleImportanceOf = id => {
      const url = `http://localhost:3001/notes/${id}`
      const note = notes.find(n => n.id === id)
      const changedNote = { ...note, important: !note.important } //create a new note => never mutate state directly in React

      axios.put(url, changedNote).then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data))
      })
    }

### Handling error in promises

    const toggleImportanceOf = id => {
      const note = notes.find(n => n.id === id)
      const changedNote = { ...note, important: !note.important }

      noteService
        .update(id, changedNote).then(returnedNote => {
          setNotes(notes.map(note => note.id !== id ? note : returnedNote))
        })
        .catch(error => {
          alert(
            `the note '${note.content}' was already deleted from server`
          )
          setNotes(notes.filter(n => n.id !== id))
        })
    }

## Adding styles to React app

Inline styles

    const Footer = () => {
      const footerStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
      }
      return (
        <div style={footerStyle}>
          <br />
          <em>Note app, Department of Computer Science, University of Helsinki 2021</em>
        </div>
      )
    }
    
## JSX codes

### Creating a form

    const App = (props) => {
      const [notes, setNotes] = useState(props.notes)
      const [newNote, setNewNote] = useState(
        'a new note...'
      ) 

      const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
          content: newNote,
          date: new Date().toISOString(),
          important: Math.random() < 0.5,
          id: notes.length + 1,
        }

        setNotes(notes.concat(noteObject))
        setNewNote('')
      }

      const handleNoteChange = (event) => {
        console.log(event.target.value)
        setNewNote(event.target.value)
      }

      return (
        <div>
          <h1>Notes</h1>
          <ul>
            {notes.map(note => 
              <Note key={note.id} note={note} />
            )}
          </ul>
          <form onSubmit={addNote}>
            <input
              value={newNote}
              onChange={handleNoteChange}
            />
            <button type="submit">save</button>
          </form>   
        </div>
      )
    }
    
   ### Filtering displayed elements
   
    import React, { useState } from 'react'
    import Note from './components/Note'

    const App = (props) => {
      const [notes, setNotes] = useState(props.notes)
      const [newNote, setNewNote] = useState('') 
      const [showAll, setShowAll] = useState(true)

      // ...

      const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important)

      return (
        <div>
          <h1>Notes</h1>
          <div>
            <button onClick={() => setShowAll(!showAll)}>
              show {showAll ? 'important' : 'all' }
            </button>
          </div>
          <ul>
            {notesToShow.map(note =>
              <Note key={note.id} note={note} />
            )}
          </ul>
          // ...    
        </div>
      )
    }
