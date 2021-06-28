# [Part 6 Flux-architecture and Redux](https://fullstackopen.com/en/part6/flux_architecture_and_redux)

Facebook developed the Flux- architecture to make state management easier. In Flux, the state is separated completely from the React-components into its own stores. State in the store is not changed directly, but with different actions.

When an action changes the state of the store, the views are rerendered:

![image](https://user-images.githubusercontent.com/67811876/123621461-cf73a780-d83d-11eb-8edd-1e42519b94d4.png)

If some action on the application, for example pushing a button, causes the need to change the state, the change is made with an action. This causes rerendering the view again:

![image](https://user-images.githubusercontent.com/67811876/123621469-d1d60180-d83d-11eb-945f-84d44d24e44a.png)

Flux offers a standard way for how and where the application's state is kept and how it is modified.

## Redux

Create a new create-react-app-application and install redux with the command:

    npm install redux

### Actuon creators

It is actually not necessary for React-components to know the Redux action types and forms. Let's separate creating actions into their own functions:

onst createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}
Functions that create actions are called action creators.

The App component does not have to know anything about the inner representation of the actions anymore, it just gets the right action by calling the creator-function:

    const App = () => {
      const addNote = (event) => {
        event.preventDefault()
        const content = event.target.note.value
        event.target.note.value = ''
        store.dispatch(createNote(content))

      }

      const toggleImportance = (id) => {
        store.dispatch(toggleImportanceOf(id))
      }

      // ...
    }

### Forwarding Redux-Store to various components

There are multiple ways to share the redux-store with components. First we will look into the newest, and possibly the easiest way using the hooks-api of the react-redux library.

First we install react-redux

    npm install react-redux
    
Next we move the App component into its own file App.js. Let's see how this affects the rest of the application files.

Index.js becomes:

    import React from 'react'
    import ReactDOM from 'react-dom'
    import { createStore } from 'redux'
    import { Provider } from 'react-redux'
    import App from './App'
    import noteReducer from './reducers/noteReducer'

    const store = createStore(noteReducer)

    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    )

Defining the action creators has been moved to the file reducers/noteReducer.js where the reducer is defined. File looks like this:

    const noteReducer = (state = [], action) => {
      // ...
    }

    const generateId = () =>
      Number((Math.random() * 1000000).toFixed(0))

    export const createNote = (content) => {
      return {
        type: 'NEW_NOTE',
        data: {
          content,
          important: false,
          id: generateId()
        }
      }
    }

    export const toggleImportanceOf = (id) => {
      return {
        type: 'TOGGLE_IMPORTANCE',
        data: { id }
      }
    }

    export default noteReducer

Code for the App component
Code now dispatches actions by calling the dispatch method of the redux-store

    import React from 'react'
    import { createNote, toggleImportanceOf } from './reducers/noteReducer'
    import { useSelector, useDispatch } from 'react-redux'

    const App = () => {
      const dispatch = useDispatch()
      const notes = useSelector(state => state)

      const addNote = (event) => {
        event.preventDefault()
        const content = event.target.note.value
        event.target.note.value = ''
        dispatch(createNote(content))
      }

      const toggleImportance = (id) => {
        dispatch(toggleImportanceOf(id))
      }

      return (
        <div>
          <form onSubmit={addNote}>
            <input name="note" /> 
            <button type="submit">add</button>
          </form>
          <ul>
            {notes.map(note =>
              <li
                key={note.id} 
                onClick={() => toggleImportance(note.id)}
              >
                {note.content} <strong>{note.important ? 'important' : ''}</strong>
              </li>
            )}
          </ul>
        </div>
      )
    }

    export default App

The useDispatch-hook provides any React component access to the dispatch-function of the redux-store defined in index.js. This allows all components to make changes to the state of the redux-store.

useSelector receives a function as a parameter. The function either searches for or selects data from the redux-store.

## Combined Reducers

Let's define the combined reducer in the index.js file:

    import React from 'react'
    import ReactDOM from 'react-dom'
    import { createStore, combineReducers } from 'redux'
    import { Provider } from 'react-redux' 
    import App from './App'

    import noteReducer from './reducers/noteReducer'
    import filterReducer from './reducers/filterReducer'

    const reducer = combineReducers({
      notes: noteReducer,
      filter: filterReducer
    })

    const store = createStore(reducer)

    console.log(store.getState())

    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    )

## Communicating with server in a redux application

The initial state of the database is stored into the file db.json, which is placed in the root of the project.

We'll install json-server for the project...

    npm install json-server --save-dev

and add the following line to the scripts part of the file package.json

    "scripts": {
      "server": "json-server -p3001 --watch db.json",
      // ...
    }
    
Now let's launch json-server with the command npm run server.

We'll add axios to the project

    npm install axios

Let's expand the code communicating with the server as follows:

    const baseUrl = 'http://localhost:3001/notes'

    const getAll = async () => {
      const response = await axios.get(baseUrl)
      return response.data
    }

    const createNew = async (content) => {
      const object = { content, important: false }
      const response = await axios.post(baseUrl, object)
      return response.data
    }

    export default {
      getAll,
      createNew,
    }
    
The method addNote of the component NewNote changes slightly:

    import React from 'react'
    import { useDispatch } from 'react-redux'
    import { createNote } from '../reducers/noteReducer'
    import noteService from '../services/notes'

    const NewNote = (props) => {
      const dispatch = useDispatch()

      const addNote = async (event) => {
        event.preventDefault()
        const content = event.target.note.value
        event.target.note.value = ''
        const newNote = await noteService.createNew(content)
        dispatch(createNote(newNote))
      }

      return (
        <form onSubmit={addNote}>
          <input name="note" />
          <button type="submit">add</button>
        </form>
      )
    }

    export default NewNote

Because the backend generates ids for the notes, we'll change the action creator createNote

    export const createNote = (data) => {
      return {
        type: 'NEW_NOTE',
        data,
      }
    }

## Asynchronous actions and redux thunk

Now let's install the redux-thunk-library, which enables us to create asynchronous actions. Installation is done with the command:

    npm install redux-thunk

The redux-thunk-library is a so-called redux-middleware, which must be initialized along with the initialization of the store. While we're here, let's extract the definition of the store into its own file src/store.js:

    import { createStore, combineReducers, applyMiddleware } from 'redux'
    import thunk from 'redux-thunk'
    import { composeWithDevTools } from 'redux-devtools-extension'

    import noteReducer from './reducers/noteReducer'
    import filterReducer from './reducers/filterReducer'

    const reducer = combineReducers({
      notes: noteReducer,
      filter: filterReducer,
    })

    const store = createStore(
      reducer,
      composeWithDevTools(
        applyMiddleware(thunk)
      )
    )

    export default store

Thanks to redux-thunk, it is possible to define action creators so that they return a function having the dispatch-method of redux-store as its parameter. As a result of this, one can make asynchronous action creators, which first wait for some operation to finish, after which they then dispatch the real action.

Now we can define the action creator, initializeNotes, that initializes the state of the notes as follows:

    export const initializeNotes = () => {
      return async dispatch => {
        const notes = await noteService.getAll()
        dispatch({
          type: 'INIT_NOTES',
          data: notes,
        })
      }
    }

In the inner function, meaning the asynchronous action, the operation first fetches all the notes from the server and then dispatches the notes to the action, which adds them to the store.

The component App can now be defined as follows:

    const App = () => {
      const dispatch = useDispatch()

      useEffect(() => {
        dispatch(initializeNotes()) 
      },[dispatch]) 

      return (
        <div>
          <NewNote />
          <VisibilityFilter />
          <Notes />
        </div>
      )
    }

The principle is: first an asynchronous operation is executed, after which the action changing the state of the store is dispatched.

## connect

To finish this part we will look into another older and more complicated way to use redux, the connect-function provided by react-redux.

In new applications you should absolutely use the hook-api, but knowing how to use connect is useful when maintaining older projects using redux.


Let's modify the Notes component so that instead of using the hook-api (the useDispatch and useSelector functions ) it uses the connect-function. We have to modify the following parts of the component:

    import React from 'react'
    import { useDispatch, useSelector } from 'react-redux'
    import { toggleImportanceOf } from '../reducers/noteReducer'

    const Notes = () => {
      const dispatch = useDispatch() 
      const notes = useSelector(({filter, notes}) => {
        if ( filter === 'ALL' ) {
          return notes
        }
        return filter === 'IMPORTANT'
          ? notes.filter(note => note.important)
          : notes.filter(note => !note.important)
      })

      return(
        <ul>
          {notes.map(note =>
            <Note
              key={note.id}
              note={note}
              handleClick={() => 
                dispatch(toggleImportanceOf(note.id))
              }
            />
          )}
        </ul>
      )
    }

    export default Notes
    
The connect function can be used for transforming "regular" React components so that the state of the Redux store can be "mapped" into the component's props.

Let's first use the connect function to transform our Notes component into a connected component:

    import React from 'react'
    import { connect } from 'react-redux'
    import { toggleImportanceOf } from '../reducers/noteReducer'

    const Notes = () => {
      // ...
    }

    const ConnectedNotes = connect()(Notes)
    export default ConnectedNotes

The component needs the list of notes and the value of the filter from the Redux store. The connect function accepts a so-called mapStateToProps function as its first parameter. The function can be used for defining the props of the connected component that are based on the state of the Redux store.

If we define:

    const Notes = (props) => {
      const dispatch = useDispatch()

      const notesToShow = () => {
        if ( props.filter === 'ALL' ) {
          return props.notes
        }

        return props.filter  === 'IMPORTANT'
          ? props.notes.filter(note => note.important)
          : props.notes.filter(note => !note.important)
      }

      return(
        <ul>
          {notesToShow().map(note =>
            <Note
              key={note.id}
              note={note}
              handleClick={() => 
                dispatch(toggleImportanceOf(note.id))
              }
            />
          )}
        </ul>
      )
    }

    const mapStateToProps = (state) => {
      return {
        notes: state.notes,
        filter: state.filter,
      }
    }

    const ConnectedNotes = connect(mapStateToProps)(Notes)

    export default ConnectedNotes
    
The Notes component can access the state of the store directly, e.g. through props.notes that contains the list of notes. Similarly, props.filter references the value of the filter.

### mapDispatchToProps

The second parameter of the connect function can be used for defining mapDispatchToProps which is a group of action creator functions passed to the connected component as props. Let's make the following changes to our existing connect operation:

    const mapStateToProps = (state) => {
      if ( state.filter === 'ALL' ) {
        return {
          notes: state.notes
        }
      }

      return {
        notes: (state.filter  === 'IMPORTANT' 
        ? state.notes.filter(note => note.important)
        : state.notes.filter(note => !note.important)
        )
      }
    }

    const mapDispatchToProps = {
      toggleImportanceOf,
    }

    const ConnectedNotes = connect(
      mapStateToProps,
      mapDispatchToProps
    )(Notes)

    export default ConnectedNotes

Now the component can directly dispatch the action defined by the toggleImportanceOf action creator by calling the function through its props:

    const Notes = (props) => {
      return(
        <ul>
          {props.notes.map(note =>
            <Note
              key={note.id}
              note={note}
              handleClick={() => props.toggleImportanceOf(note.id)}
            />
          )}
        </ul>
      )
    }


































































































