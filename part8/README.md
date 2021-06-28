# [Part 8 - GraphQL](https://fullstackopen.com/en/part8/graph_ql_server)

The GraphQL philosophy is very different from REST. REST is resource based. Every resource, for example a user has its own address which identifies it, for example /users/10. All operations done to the resource are done with HTTP requests to its URL. The action depends on the used HTTP-method.

The main principle of GraphQL is, that the code on the browser forms a query describing the data wanted, and sends it to the API with an HTTP POST request. Unlike REST, all GraphQL queries are sent to the same address, and their type is POST.

## Schemas and queries

In the heart of all GraphQL applications is a schema, which describes the data sent between the client and the server. The initial schema for our phonebook is as follows:

    type Person {
      name: String!
      phone: String
      street: String!
      city: String!
      id: ID! 
    }

    type Query {
      personCount: Int!
      allPersons: [Person!]!
      findPerson(name: String!): Person
    }

All of the String fields, except phone, must be given a value. This is marked by the exclamation mark on the schema. The type of the field id is ID. ID fields are strings, but GraphQL ensures they are unique.

The second type is a Query. Practically every GraphQL schema describes a Query, which tells what kind of queries can be made to the API.

The simplest of the queries, personCount, looks as follows:

    query {
      personCount
    }
    
Assuming our applications has saved the information of three people, the response would look like this:

    {
      "data": {
        "personCount": 3
      }
    }

Despite its name, GraphQL does not actually have anything to do with databases. It does not care how the data is saved. The data a GraphQL API uses can be saved into a relational database, document database, or to other servers which GraphQL-server can access with for example REST.

## Apollo server

Let's implement a GraphQL-server with today's leading library Apollo -server.

Create a new npm-project with npm init and install the required dependencies.

    npm install apollo-server graphql

The initial code is as follows:

    const { ApolloServer, gql } = require('apollo-server')

    let persons = [
      {
        name: "Arto Hellas",
        phone: "040-123543",
        street: "Tapiolankatu 5 A",
        city: "Espoo",
        id: "3d594650-3436-11e9-bc57-8b80ba54c431"
      },
      {
        name: "Matti Luukkainen",
        phone: "040-432342",
        street: "Malminkaari 10 A",
        city: "Helsinki",
        id: '3d599470-3436-11e9-bc57-8b80ba54c431'
      },
      {
        name: "Venla Ruuska",
        street: "Nallemäentie 22 C",
        city: "Helsinki",
        id: '3d599471-3436-11e9-bc57-8b80ba54c431'
      },
    ]

    const typeDefs = gql`
      type Person {
        name: String!
        phone: String
        street: String!
        city: String! 
        id: ID!
      }

      type Query {
        personCount: Int!
        allPersons: [Person!]!
        findPerson(name: String!): Person
      }
    `

    const resolvers = {
      Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) =>
          persons.find(p => p.name === args.name)
      }
    }

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    })

    server.listen().then(({ url }) => {
      console.log(`Server ready at ${url}`)
    })

## GraphQL-playground

When Apollo-server is run on development mode (node filename.js), it starts a GraphQL-playground to address http://localhost:4000/graphql. This is very useful for a developer, and can be used to make queries to the server.

### The default resolver

When we do a query, for example

query {
  findPerson(name: "Arto Hellas") {
    phone 
    city 
    street
  }
}
the server knows to send back exactly the fields required by the query. How does that happen?

A GraphQL-server must define resolvers for each field of each type in the schema. We have so far only defined resolvers for fields of the type Query, so for each query of the application.

Because we did not define resolvers for the fields of the type Person, Apollo has defined default resolvers for them. They work like the one shown below:

    const resolvers = {
      Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) => persons.find(p => p.name === args.name)
      },
      Person: {
        name: (root) => root.name,
        phone: (root) => root.phone,
        street: (root) => root.street,
        city: (root) => root.city,
        id: (root) => root.id
      }
    }
    
The default resolver returns the value of the corresponding field of the object. The object itself can be accessed through the first parameter of the resolver, root.

If the functionality of the default resolver is enough, you don't need to define your own. It is also possible to define resolvers for only some fields of a type, and let the default resolvers handle the rest.

#### Object within an object

Let's modify the schema a bit

    type Address {
      street: String!
      city: String! 
    }

    type Person {
      name: String!
      phone: String
      address: Address!
      id: ID!
    }

    type Query {
      personCount: Int!
      allPersons: [Person!]!
      findPerson(name: String!): Person
    }
    
so a person now has a field with the type Address, which contains the street and the city.

Contrary to the type Person, the Address type does not have an id field, because they are not saved into their own data structure in the server.

Because the objects saved in the array do not have a field address, the default resolver is not sufficient enough. Let's add a resolver for the field address of type Person:

    const resolvers = {
      Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) =>
          persons.find(p => p.name === args.name)
      },
      Person: {
        address: (root) => {
          return { 
            street: root.street,
            city: root.city
          }
        }
      }
    }

## Mutations

Let's add a functionality for adding new persons to the phonebook. In GraphQL, all operations which cause a change are done with mutations. Mutations are described in the schema as the keys of type Mutation.

The schema for a mutation for adding a new person looks as follows:

    type Mutation {
      addPerson(
        name: String!
        phone: String
        street: String!
        city: String!
      ): Person
    }

Mutations also require a resolver:

    const { v1: uuid } = require('uuid')

    // ...

    const resolvers = {
      // ...
      Mutation: {
        addPerson: (root, args) => {
          const person = { ...args, id: uuid() }
          persons = persons.concat(person)
          return person
        }
      }
    }
    
The mutation adds the object given to it as a parameter args to the array persons, and returns the object it added to the array.

A new person can be added with the following mutation

    mutation {
      addPerson(
        name: "Pekka Mikkola"
        phone: "045-2374321"
        street: "Vilppulantie 25"
        city: "Helsinki"
      ) {
        name
        phone
        address{
          city
          street
        }
        id
      }
    }

### Error handling

However GraphQL cannot handle everything automatically. For example stricter rules for data sent to a Mutation have to be added manually. The errors from those rules are handled by the error handling mechanism of Apollo Server.

Let's block adding the same name to the phonebook multiple times:

    const { ApolloServer, UserInputError, gql } = require('apollo-server')

    // ...

    const resolvers = {
      // ..
      Mutation: {
        addPerson: (root, args) => {
          if (persons.find(p => p.name === args.name)) {
            throw new UserInputError('Name must be unique', {
              invalidArgs: args.name,
            })
          }

          const person = { ...args, id: uuid() }
          persons = persons.concat(person)
          return person
        }
      }
    }
    
So if the name to be added already exists in the phonebook, throw UserInputError error.

## Enum

Let's add a possibility to filter the query returning all persons with the parameter phone so, that it returns only persons with a phone number

The schema changes like so:

    enum YesNo {
      YES
      NO
    }

    type Query {
      personCount: Int!
      allPersons(phone: YesNo): [Person!]!
      findPerson(name: String!): Person
    }
    
The type YesNo is GraphQL enum, or an enumerable, with two possible values YES or NO. In the query allPersons the parameter phone has the type YesNo, but is nullable.

The resolver changes like so:

    Query: {
      personCount: () => persons.length,
      allPersons: (root, args) => {
        if (!args.phone) {
          return persons
        }
        const byPhone = (person) =>
          args.phone === 'YES' ? person.phone : !person.phone
        return persons.filter(byPhone)
      },
      findPerson: (root, args) =>
        persons.find(p => p.name === args.name)
    },

## Apollo client (Postman for GraphQL)

Create a new React-app and install the dependencies required by Apollo client.

    npm install @apollo/client graphql

We'll start with the following code for our application.

    import React from 'react'
    import ReactDOM from 'react-dom'
    import App from './App'

    import { 
      ApolloClient, ApolloProvider, HttpLink, InMemoryCache
    } from '@apollo/client' 

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: 'http://localhost:4000',
      })
    })

    ReactDOM.render(
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>,
      document.getElementById('root')
    )
    
The beginning of the code creates a new client - object, which is then used to send a query to the server.

Apollo Client offers a few alternatives for making queries. Currently the use of the hook-function useQuery is the dominant practice.

The query is made by the App component, which's code is as follows:

    import React from 'react'
    import { gql, useQuery } from '@apollo/client';

    const ALL_PERSONS = gql`
    query {
      allPersons  {
        name
        phone
        id
      }
    }
    `

    const App = () => {
      const result = useQuery(ALL_PERSONS)

      if (result.loading)  {
        return <div>loading...</div>
      }

      return (
        <div>
          {result.data.allPersons.map(p => p.name).join(', ')}
        </div>
      )
    }

    export default App

When we do queries programmatically, we must be able to give them parameters dynamically.

GraphQL variables are well suited for this. To be able to use variables, we must also name our queries.

The useQuery hook is well suited for situations where the query is done when the component is rendered. However now we want to make the query only when a user wants to see the details of a specific person, so the query is done only as required.

For this this situation the hook-function useLazyQuery is a good choice. The Persons component becomes:

    const FIND_PERSON = gql`
      query findPersonByName($nameToSearch: String!) {
        findPerson(name: $nameToSearch) {
          name
          phone 
          id
          address {
            street
            city
          }
        }
      }
    `

    const Persons = ({ persons }) => {
      const [getPerson, result] = useLazyQuery(FIND_PERSON) 
      const [person, setPerson] = useState(null)

      const showPerson = (name) => {
        getPerson({ variables: { nameToSearch: name } })
      }

      useEffect(() => {
        if (result.data) {
          setPerson(result.data.findPerson)
        }
      }, [result])

      if (person) {
        return(
          <div>
            <h2>{person.name}</h2>
            <div>{person.address.street} {person.address.city}</div>
            <div>{person.phone}</div>
            <button onClick={() => setPerson(null)}>close</button>
          </div>
        )
      }

      return (
        <div>
          <h2>Persons</h2>
          {persons.map(p =>
            <div key={p.name}>
              {p.name} {p.phone}
              <button onClick={() => showPerson(p.name)} >
                show address
              </button> 
            </div>  
          )}
        </div>
      )
    }

    export default Persons

### Cache

Apollo client saves the responses of queries to cache. To optimize performance if the response to a query is already in the cache, the query is not sent to the server at all.

### Doing mutations

Now we need a version of the addPerson mutation which uses variables.

The hook-function useMutation provides the functionality for making mutations.

Let's create a new component for adding a new person to the directory:

    import React, { useState } from 'react'
    import { gql, useMutation } from '@apollo/client'

    const CREATE_PERSON = gql`
    mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
      addPerson(
        name: $name,
        street: $street,
        city: $city,
        phone: $phone
      ) {
        name
        phone
        id
        address {
          street
          city
        }
      }
    }
    `

    const PersonForm = () => {
      const [name, setName] = useState('')
      const [phone, setPhone] = useState('')
      const [street, setStreet] = useState('')
      const [city, setCity] = useState('')

      const [ createPerson ] = useMutation(CREATE_PERSON)

      const submit = (event) => {
        event.preventDefault()

        createPerson({  variables: { name, phone, street, city } })

        setName('')
        setPhone('')
        setStreet('')
        setCity('')
      }

      return (
        <div>
          <h2>create new</h2>
          <form onSubmit={submit}>
            <div>
              name <input value={name}
                onChange={({ target }) => setName(target.value)}
              />
            </div>
            <div>
              phone <input value={phone}
                onChange={({ target }) => setPhone(target.value)}
              />
            </div>
            <div>
              street <input value={street}
                onChange={({ target }) => setStreet(target.value)}
              />
            </div>
            <div>
              city <input value={city}
                onChange={({ target }) => setCity(target.value)}
              />
            </div>
            <button type='submit'>add!</button>
          </form>
        </div>
      )
    }

    export default PersonForm

#### Updating the cache

There are few different solutions for this. One way is to make the query for all persons poll the server, or make the query repeatedly.

The change is small. Let's set the query to poll every two seconds:

    const App = () => {
      const result = useQuery(ALL_PERSONS, {
        pollInterval: 2000
      })

      if (result.loading)  {
        return <div>loading...</div>
      }

      return (
        <div>
          <Persons persons = {result.data.allPersons}/>
          <PersonForm />
        </div>
      )
    }

    export default App

The solution is simple, and every time a user adds a new person, it appears immediately on the screens of all users.

The bad side of the solution is all the pointless web traffic.

Another easy way to keep the cache in sync is to use the useMutation-hook's refetchQueries parameter to define, that the query fetching all persons is done again whenever a new person is created.

    const ALL_PERSONS = gql`
      query  {
        allPersons  {
          name
          phone
          id
        }
      }
    `

    const PersonForm = (props) => {
      // ...

      const [ createPerson ] = useMutation(CREATE_PERSON, {
        refetchQueries: [ { query: ALL_PERSONS } ]
      })
      
The pros and cons of this solution are almost opposite of the previous one. There is no extra web traffic, because queries are not done just in case. However if one user now updates the state of the server, the changes do not show to other users immediately.

### Handling mutation errors

We can register an error handler function to the mutation using useMutation-hook's onError option.

Let's register the mutation an error handler, which uses the setError function it receives as a parameter to set an error message:

    const PersonForm = ({ setError }) => {
      // ... 

      const [ createPerson ] = useMutation(CREATE_PERSON, {
        refetchQueries: [  {query: ALL_PERSONS } ],
        onError: (error) => {
          setError(error.graphQLErrors[0].message)
        }
      })

      // ...
    }

### Updating a phone number

    export const EDIT_NUMBER = gql`
      mutation editNumber($name: String!, $phone: String!) {
        editNumber(name: $name, phone: $phone)  {
          name
          phone
          address {
            street
            city
          }
          id
        }
      }
    `
    
The function is done using the useMutation-hook.

    import React, { useState } from 'react'
    import { useMutation } from '@apollo/client'

    import { EDIT_NUMBER } from '../queries'

    const PhoneForm = () => {
      const [name, setName] = useState('')
      const [phone, setPhone] = useState('')

      const [ changeNumber ] = useMutation(EDIT_NUMBER)

      const submit = (event) => {
        event.preventDefault()

        changeNumber({ variables: { name, phone } })

        setName('')
        setPhone('')
      }

      return (
        <div>
          <h2>change number</h2>

          <form onSubmit={submit}>
            <div>
              name <input
                value={name}
                onChange={({ target }) => setName(target.value)}
              />
            </div>
            <div>
              phone <input
                value={phone}
                onChange={({ target }) => setPhone(target.value)}
              />
            </div>
            <button type='submit'>change number</button>
          </form>
        </div>
      )
    }

    export default PhoneForm

## Database and user administration

Install mongoose and mongoose-unique-validator:

    npm install mongoose mongoose-unique-validator

The person schema has been defined as follows:

    const mongoose = require('mongoose')
    const uniqueValidator = require('mongoose-unique-validator')

    const schema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
      },
      phone: {
        type: String,
        minlength: 5
      },
      street: {
        type: String,
        required: true,
        minlength: 5
      },
      city: {
        type: String,
        required: true,
        minlength: 3
      },
    })

    schema.plugin(uniqueValidator)
    module.exports = mongoose.model('Person', schema)

We also included a few validations. required: true, which ensures that value exists, is actually redundant as just using GraphQL ensures that the fields exist. However it is good to also keep validation in the database.










