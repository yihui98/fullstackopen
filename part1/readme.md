# Part 1 - Introduction to React

## Command Line Codes

npx create-react-app part1 

npm start

## Rules of Hooks

The useState function (as well as the useEffect function introduced later on in the course) must not be called from inside of a loop, a conditional expression, or any place that is not a function defining a component. This must be done to ensure that the hooks are always called in the same order, and if this isn't the case the application will behave erratically.

## Do not define components within components
Never define components inside of other components. The method provides no benefits and leads to many unpleasant problems. The biggest problems are due to the fact that React treats a component defined inside of another component as a new component in every render. This makes it impossible for React to optimize the component.

    // This is the right place to define a component
    const Button = (props) => (
      <button onClick={props.handleClick}>
        {props.text}
      </button>
    )

    const App = () => {
      const [value, setValue] = useState(10)

      const setToValue = newValue => {
        setValue(newValue)
      }

      // Do not define components inside another component
      const Display = props => <div>{props.value}</div>

      return (
        <div>
          <Display value={value} />
          <Button handleClick={() => setToValue(1000)} text="thousand" />
          <Button handleClick={() => setToValue(0)} text="reset" />
          <Button handleClick={() => setToValue(value + 1)} text="increment" />
        </div>
      )
    }

## JSX Codes

### Syntax of a component
    const Hello = (props) => {
        return (
          <div>
            <p>Hello {props.name}</p>
          </div>
          )
        }
        
    <Hello name="George" />
    
### Single expression function

    const square = p => p * p
    
    const t = [1, 2, 3]
    const tSquared = t.map(p => p * p)

### JS Object methods

    const arto = {
      name: 'Arto Hellas',
      age: 35,
      education: 'PhD',
      greet: function() {
        console.log('hello, my name is ' + this.name)
      },
    }

    arto.greet()  // "hello, my name is Arto Hellas" gets printed
    
#### Methods can be assigned to objects even after the creation of the object
   
    arto.growOlder = function() {
      this.age += 1 
    }

### JS Classes
        class Person {
          constructor(name, age) {
            this.name = name
            this.age = age
          }
          greet() {
            console.log('hello, my name is ' + this.name)
          }
        }

        const adam = new Person('Adam Ondra', 35)
        adam.greet()

        const janja = new Person('Janja Garnbret', 22)
        janja.greet()
        
### React State hook

    import React, { useState } from 'react'

    const App = () => {
      const [ counter, setCounter ] = useState(0)

      setTimeout(
        () => setCounter(counter + 1),
        1000
      )

      return (
        <div>{counter}</div>
      )
    }

    export default App
    
### Event handling in React

#### An event handler is supposed to be either a function or a function reference.
      
     Function Call:  <button onClick={setCounter(counter + 1)}> 
In the beginning the value of the counter variable is 0. When React renders the component for the first time, it executes the function call setCounter(0+1), and changes the value of the component's state to 1. This will cause the component to be re-rendered, React will execute the setCounter function call again, and the state will change leading to another rerender...

    const App = () => {
      const [ counter, setCounter ] = useState(0)

      const handleClick = () => {
        console.log('clicked')
      }

      return (
        <div>
          <div>{counter}</div>
          <button onClick={handleClick}>
            plus
          </button>
        </div>
      )
    }
  
#### Destructured event handling

    <button onClick={() => setCounter(counter + 1)}>
      plus
    </button>
    
When one of the buttons is clicked, the event handler is executed. The event handler changes the state of the App component with the setCounter function. **Calling a function which changes the state causes the component to rerender.**

So, if a user clicks the plus button, the button's event handler changes the value of counter to 1, and the App component is rerendered. This causes its subcomponents Display and Button to also be re-rendered. Display receives the new value of the counter, 1, as props. The Button components receive event handlers which can be used to change the state of the counter.

#### Function inside a function

    const App = () => {
      const [value, setValue] = useState(10)

      const hello = (who) => {
        const handler = () => {
          console.log('hello', who)
        }
        return handler
      }

      return (
        <div>
          {value}
          <button onClick={hello('world')}>button</button>
          <button onClick={hello('react')}>button</button>
          <button onClick={hello('function')}>button</button>
        </div>
      )
    }



