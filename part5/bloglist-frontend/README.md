# [Part 5](https://fullstackopen.com/en/part5/login_in_frontend)

## Handling login

The code of the App component:

    const App = () => {
      const [notes, setNotes] = useState([]) 
      const [newNote, setNewNote] = useState('')
      const [showAll, setShowAll] = useState(true)
      const [errorMessage, setErrorMessage] = useState(null)
      const [username, setUsername] = useState('') 
      const [password, setPassword] = useState('') 
      const [user, setUser] = useState(null)
      
      useEffect(() => {
        noteService
          .getAll().then(initialNotes => {
            setNotes(initialNotes)
          })
      }, [])

      // ...

      const handleLogin = async (event) => {
        event.preventDefault()

        try {
          const user = await loginService.login({
            username, password,
          })
          noteService.setToken(user.token)
          setUser(user)
          setUsername('')
          setPassword('')
        } catch (exception) {
          setErrorMessage('Wrong credentials')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
      }

      return (
        <div>
          <h1>Notes</h1>

          <Notification message={errorMessage} />

          <form onSubmit={handleLogin}>
            <div>
              username
                <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password
                <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>

          // ...
        </div>
      )
    }

    export default App
    
Logging is done by sending an HTTP POST request to server address api/login. Let's separate the code responsible for this request to its own module, to file services/login.js.    
    
    import axios from 'axios'
    const baseUrl = '/api/login'

    const login = async credentials => {
      const response = await axios.post(baseUrl, credentials)
      return response.data
    }

    export default { login }    
    
## Creating new notes    
    
The token returned with a successful login is saved to the application's state - the user's field token:    
    
    const handleLogin = async (event) => {
      event.preventDefault()
      try {
        const user = await loginService.login({
          username, password,
        })

        setUser(user)
        setUsername('')
        setPassword('')
      } catch (exception) {
        // ...
      }
    }    

Let's fix creating new notes so it works with the backend. This means adding the token of the logged-in user to the Authorization header of the HTTP request.    
    
The noteService module changes like so:

    import axios from 'axios'
    const baseUrl = '/api/notes'

    let token = null

    const setToken = newToken => {
      token = `bearer ${newToken}`
    }

    const getAll = () => {
      const request = axios.get(baseUrl)
      return request.then(response => response.data)
    }

    const create = async newObject => {
      const config = {
        headers: { Authorization: token },
      }

      const response = await axios.post(baseUrl, newObject, config)
      return response.data
    }

    const update = (id, newObject) => {
      const request = axios.put(`${ baseUrl } /${id}`, newObject)
      return request.then(response => response.data)
    }

    export default { getAll, create, update, setToken }    
    
The noteService module contains a private variable token. Its value can be changed with a function setToken, which is exported by the module. create, now with async/await syntax, sets the token to the Authorization header. The header is given to axios as the third parameter of the post method.   
     
 ## Saving the token to the browser's local storage
 
When the page is rerendered, information of the user's login disappears. This also slows down development. For example when we test creating new notes, we have to login again every single time.    
    
This problem is easily solved by saving the login details to local storage. Local Storage is a key-value database in the browser.

Values in the local storage are persisted even when the page is rerendered. The storage is origin-specific so each web application has its own storage.    
    
Values saved to the storage are DOMstrings, so we cannot save a JavaScript object as is. The object has to be parsed to JSON first, with the method JSON.stringify. Correspondingly, when a JSON object is read from the local storage, it has to be parsed back to JavaScript with JSON.parse.    
    
Changes to the login method are as follows:    
    
    const handleLogin = async (event) => {
      event.preventDefault()
      try {
        const user = await loginService.login({
          username, password,
        })

        window.localStorage.setItem(
          'loggedNoteappUser', JSON.stringify(user)
        ) 
        noteService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
      } catch (exception) {
        // ...
      }
    }    

We still have to modify our application so that when we enter the page, the application checks if user details of a logged-in user can already be found on the local storage. If they can, the details are saved to the state of the application and to noteService.

The right way to do this is with an effect hook: a mechanism we first encountered in part 2, and used to fetch notes from the server.    
    
     useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if (loggedUserJSON) {
          const user = JSON.parse(loggedUserJSON)
          setUser(user)
          noteService.setToken(user.token)
        }
      }, [])    
    
The empty array as the parameter of the effect ensures that the effect is executed only when the component is rendered for the first time.    
    
## The components children, aka props.children    
    
Our goal is to implement a new Togglable component that can be used in the following way:    
    
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>    
    
The way that the component is used is slightly different from our previous components. The component has both opening and closing tags which surround a LoginForm component. In React terminology LoginForm is a child component of Togglable.

We can add any React elements we want between the opening and closing tags of Togglable.
    
The code for the Togglable component is shown below:    
    
    import React, { useState } from 'react'

    const Togglable = (props) => {
      const [visible, setVisible] = useState(false)

      const hideWhenVisible = { display: visible ? 'none' : '' }
      const showWhenVisible = { display: visible ? '' : 'none' }

      const toggleVisibility = () => {
        setVisible(!visible)
      }

      return (
        <div>
          <div style={hideWhenVisible}>
            <button onClick={toggleVisibility}>{props.buttonLabel}</button>
          </div>
          <div style={showWhenVisible}>
            {props.children}
            <button onClick={toggleVisibility}>cancel</button>
          </div>
        </div>
      )
    }

    export default Togglable    
    
The new and interesting part of the code is props.children, that is used for referencing the child components of the component. The child components are the React elements that we define between the opening and closing tags of a component.    
    
Unlike the "normal" props we've seen before, children is automatically added by React and always exists. If a component is defined with an automatically closing /> tag, like this:   

    <Note
      key={note.id}
      note={note}
      toggleImportance={() => toggleImportanceOf(note.id)}
    />    
    
Then props.children is an empty array.

The Togglable component is reusable and we can use it to add similar visibility toggling functionality to the form that is used for creating new notes.    
    
## PropTypes    
    
The expected and required props of a component can be defined with the prop-types package. Let's install the package:    
    
    npm install prop-types 
    
We can define the buttonLabel prop as a mandatory or required string-type prop as shown below:    
    
    import PropTypes from 'prop-types'

    const Togglable = React.forwardRef((props, ref) => {
      // ..
    })

    Togglable.propTypes = {
      buttonLabel: PropTypes.string.isRequired
    }    
    
The console will display the following error message if the prop is left undefined: 

![image](https://user-images.githubusercontent.com/67811876/123605400-5f115a00-d82e-11eb-8880-19abaa503e06.png)
    
## Testing React apps    
    
In addition to Jest, we also need another testing library that will help us render components for testing purposes. The current best option for this is react-testing-library which has seen rapid growth in popularity in recent times.    
    
Let's install the library with the command:    
    
    npm install --save-dev @testing-library/react @testing-library/jest-dom    
    
Let's first write tests for the component that is responsible for rendering a note:    
    
    const Note = ({ note, toggleImportance }) => {
      const label = note.important
        ? 'make not important'
        : 'make important'

      return (
        <li className='note'>
          {note.content}
          <button onClick={toggleImportance}>{label}</button>
        </li>
      )
    }    
    
The first test verifies that the component renders the contents of the note:

    import React from 'react'
    import '@testing-library/jest-dom/extend-expect'
    import { render } from '@testing-library/react'
    import Note from './Note'

    test('renders content', () => {
      const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
      }

      const component = render(
        <Note note={note} />
      )
      
      component.debug()
      
      expect(component.container).toHaveTextContent(
        'Component testing is done with react-testing-library'
      )
    })    
    
render returns an object that has several [properties](https://testing-library.com/docs/react-testing-library/api/#render-result). One of the properties is called container, and it contains all of the HTML rendered by the component.    
    
Create-react-app configures tests to be run in watch mode by default, which means that the npm test command will not exit once the tests have finished, and will instead wait for changes to be made to the code. Once new changes to the code are saved, the tests are executed automatically after which Jest goes back to waiting for new changes to be made.

If you want to run tests "normally", you can do so with the command:

    CI=true npm test    
    
The react-testing-library package offers many different ways of investigating the content of the component being tested. Let's slightly expand our test:    
    
    test('renders content', () => {
      const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
      }

      const component = render(
        <Note note={note} />
      )

      // method 1
      expect(component.container).toHaveTextContent(
        'Component testing is done with react-testing-library'
      )

      // method 2
      const element = component.getByText(
        'Component testing is done with react-testing-library'
      )
      expect(element).toBeDefined()

      // method 3
      const div = component.container.querySelector('.note')
      expect(div).toHaveTextContent(
        'Component testing is done with react-testing-library'
      )
    })    
    
### Clicking buttons in tests    
    
In addition to displaying content, the Note component also makes sure that when the button associated with the note is pressed, the toggleImportance event handler function gets called.

Testing this functionality can be accomplished like this:    
    
    import React from 'react'
    import { render, fireEvent } from '@testing-library/react'
    import { prettyDOM } from '@testing-library/dom'
    import Note from './Note'

    // ...

    test('clicking the button calls event handler once', () => {
      const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
      }

      const mockHandler = jest.fn()

      const component = render(
        <Note note={note} toggleImportance={mockHandler} />
      )

      const button = component.getByText('make not important')
      fireEvent.click(button)

      expect(mockHandler.mock.calls).toHaveLength(1)
    })    
    
In practice we used the fireEvent to create a click event for the button component. We can also simulate text input with fireEvent.    
    
    import React from 'react'
    import { render, fireEvent } from '@testing-library/react'
    import '@testing-library/jest-dom/extend-expect'
    import NoteForm from './NoteForm'

    test('<NoteForm /> updates parent state and calls onSubmit', () => {
      const createNote = jest.fn()

      const component = render(
        <NoteForm createNote={createNote} />
      )

      const input = component.container.querySelector('input')
      const form = component.container.querySelector('form')

      fireEvent.change(input, { 
        target: { value: 'testing of forms could be easier' } 
      })
      fireEvent.submit(form)

      expect(createNote.mock.calls).toHaveLength(1)
      expect(createNote.mock.calls[0][0].content).toBe('testing of forms could be easier' )
    })    
 
 ### Test coverage
    
We can easily find out the coverage of our tests by running them with the command.

    CI=true npm test -- --coverage    
    
## End to end testing   
    
E2E library Cypress has become popular within the last year. Cypress is exceptionally easy to use, and when compared to Selenium, for example, it requires a lot less hassle and headache. Its operating principle is radically different than most E2E testing libraries, because Cypress tests are run completely within the browser. Other libraries run the tests in a Node-process, which is connected to the browser through an API.

Let's make some end to end tests for our note application.

We begin by installing Cypress to the frontend as development dependency    

    npm install --save-dev cypress

and by adding an npm-script to run it:

    {
      // ...
      "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject",
        "server": "json-server -p3001 db.json",
        "cypress:open": "cypress open"
      },
      // ...
    }    
    
The tests require the tested system to be running. Unlike our backend integration tests, Cypress tests do not start the system when they are run.    
    
When we first run Cypress, it creates a cypress directory. It contains an integration subdirectory, where we will place our tests. Cypress creates a bunch of example tests for us in the integration/examples directory. We can delete the examples directory and make our own test in file note_app.spec.js:    
    
    describe('Note app', function() {
      it('front page can be opened', function() {
        cy.visit('http://localhost:3000')
        cy.contains('Notes')
        cy.contains('Note app, Department of Computer Science, University of Helsinki 2021')
      })
    })    
    
It would be better to give our inputs unique ids and use those to find them. We change our login form like so    
    
    const LoginForm = ({ ... }) => {
      return (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              username
              <input
                id='username'
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div>
              password
              <input
                id='password'
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button id="login-button" type="submit">
              login
            </button>
          </form>
        </div>
      )
    }

We also added an id to our submit button so we can access it in our tests.

The test becomes

    describe('Note app',  function() {
      // ..
      it('user can log in', function() {
        cy.contains('log in').click()
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('salainen')
        cy.get('#login-button').click()

        cy.contains('Matti Luukkainen logged in')
      })
    })    

Now we notice that the variable cy our tests use gives us a nasty Eslint error    
    
We can get rid of it by installing eslint-plugin-cypress as a development dependency    
    
    npm install eslint-plugin-cypress --save-dev

and changing the configuration in .eslintrc.js like so:

    module.exports = {
        "env": {
            "browser": true,
            "es6": true,
            "jest/globals": true,
            "cypress/globals": true
        },
        "extends": [ 
          // ...
        ],
        "parserOptions": {
          // ...
        },
        "plugins": [
            "react", "jest", "cypress"
        ],
        "rules": {
          // ...
        }
    }    
    
Cypress will run all tests each time by default, and as the number of tests increases it starts to become quite time consuming. When developing a new test or when debugging a broken test, we can define the test with it.only instead of it, so that Cypress will only run the required test. When the test is working, we can remove .only.    
    
    describe('Note app', function() {
      // ...

      it.only('login fails with wrong password', function() {
        cy.contains('log in').click()
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('wrong')
        cy.get('#login-button').click()

        cy.contains('wrong credentials')
      })

      // ...
    )}    
    
The application renders the error message to a component with the CSS class error:

    const Notification = ({ message }) => {
      if (message === null) {
        return null
      }

      return (
        <div className="error">
          {message}
        </div>
      )
    }
    
We could make the test ensure, that the error message is rendered to the correct component, or the component with the CSS class error:

    it('login fails with wrong password', function() {
      // ...

      cy.get('.error').contains('wrong credentials')
    })

First we use cy.get to search for a component with the CSS class error. Then we check that the error message can be found from this component. Note that the CSS class selector starts with a full stop, so the selector for the class error is .error.

We could do the same using the should syntax:

    it('login fails with wrong password', function() {
      // ...

      cy.get('.error').should('contain', 'wrong credentials')
    })

Using should is a bit trickier than using contains, but it allows for more diverse tests than contains which works based on text content only.

List of the most common assertions which can be used with should can be found [here](https://docs.cypress.io/guides/references/assertions#Common-Assertions).

