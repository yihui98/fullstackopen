# [Part 9 - TypeScript](https://fullstackopen.com/en/part9) 

TypeScript is a programming language designed for large-scale JavaScript development created by Microsoft. For example Microsoft's Azure Management Portal (1,2 million lines of code) and Visual Studio Code (300 000 lines of code) have both been written in TypeScript. To support building large-scale JavaScript applications, TypeScript offers features such as better development-time tooling, static code analysis, compile-time type checking and code level documentation.

## Type annotations

Type annotations in TypeScript are a lightweight way to record the intended contract of a function or a variable. In the example below we have defined a function birthdayGreeter which accepts two arguments, one of type string and one of type number. The function will return a string.

    const birthdayGreeter = (name: string, age: number): string => {
      return `Happy birthday ${name}, you are now ${age} years old!`;
    };

    const birthdayHero = "Jane User";
    const age = 22;

    console.log(birthdayGreeter(birthdayHero, 22));

Let's start writing our first TypeScript-app. To keep things simple, let's start by using the npm package ts-node. It compiles and executes the specified TypeScript file immediately, so that there is no need for a separate compilation step.

You can install both ts-node and the official typescript package globally by running

    npm install -g ts-node typescript

and set up scripts within the package.json:

    {
      // ..
      "scripts": {
        "ts-node": "ts-node"
      },
      // ..
    }

Now within this directory you can use ts-node by running npm run ts-node. Note that if you are using ts-node through package.json, all command line arguments for the script need to be prefixed with --. So if you want to run file.ts with ts-node, the whole command is:

    npm run ts-node -- file.ts

TypeScript natively supports multiple types including number, string and Array. See the comprehensive list [here](https://www.typescriptlang.org/docs/handbook/basic-types.html). More complex custom types can also be created.

## Creating your own types

We can create a type using the TypeScript native keyword type. Let's describe our type Operation:

    type Operation = 'multiply' | 'add' | 'divide';

Now the Operation type accepts only three kinds of input; exactly the three strings we wanted.

The type keyword defines a new name for a type, a type alias. Since the defined type is a union of three possible values, it is handy to give it an alias that has a representative name.

Let's look at our calculator now:

    type Operation = 'multiply' | 'add' | 'divide';

    type Result = number;

    const calculator = (a: number, b: number, op : Operation) : Result => {
      switch(op) {
        case 'multiply':
          return a * b;
        case 'divide':
          if( b === 0) throw new Error('Can\'t divide by 0!');
          return a / b;
        case 'add':
          return a + b;
        default:
          throw new Error('Operation is not multiply, add or divide!');
      }
    }

Usually types for existing packages can be found from the @types-organization within npm, and you can add the relevant types to your project by installing an npm package with the name of your package with @types/ - prefix. For example: npm install --save-dev @types/react @types/express @types/lodash @types/jest @types/mongoose and so on and so on. The @types/* are maintained by Definitely typed, a community project with the goal to maintaining types of everything in one place.

Since the global variable process is defined by Node itself, we get its typings by installing the package @types/node:

    npm install --save-dev @types/node

## tsconfig

The tsconfig.json file contains all your core configurations on how you want TypeScript to work in your project. You can define how strictly you want the code to be inspected, what files to include and exclude (node_modules is excluded by default), and where compiled files should be placed (more on this later).

Let's specify the following configurations in our tsconfig.json file:

{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}

## Using express with typescript

Let us start by installing express:

    npm install express

add then add the start script to package.json:

    {
      // ..
      "scripts": {
        "ts-node": "ts-node",
        "multiply": "ts-node multiplier.ts",
        "calculate": "ts-node calculator.ts",
        "start": "ts-node index.ts"
      },
      // ..
    }
    
Now we can create the file index.ts, and write the HTTP GET ping endpoint to it:

    const express = require('express');
    const app = express();

    app.get('/ping', (req, res) => {
      res.send('pong');
    });

    const PORT = 3003;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

The complaint is that the 'require' call may be converted to an import. Let us follow the advice and write the import as follows

    import express from 'express';


We haven't installed types for express. Let's do what the suggestion says and run:

    npm install --save-dev @types/express

To simplify the development we should enable auto reloading to improve our workflow. In this course you have already used nodemon, but ts-node has an alternative called ts-node-dev. It is meant to be used only with a development environment which takes care of recompilation on every change, so restarting the application won't be necessary.

Let's install ts-node-dev to our development dependencies

    npm install --save-dev ts-node-dev
    
add a script to package.json

    {
      // ...
      "scripts": {
          // ...
          "dev": "ts-node-dev index.ts",
      },
      // ...
    }

And now by running npm run dev we have a working, auto-reloading development environment for our project!

## The horros of any

What if we would like to prevent developers from using any type at all? Fortunately we have other methods than tsconfig.json to enforce coding style. What we can do is use eslint to manage our code. Let's install eslint and its TypeScript extensions:

    npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser

We will configure eslint to disallow explicit any. Write the following rules to .eslintrc:

    {
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
      },
      "plugins": ["@typescript-eslint"],
      "rules": {
        "@typescript-eslint/no-explicit-any": 2
      }
    }
    
(Newer versions of eslint has this rule on by default, so you don't necessarily need to add it separately.)

Let us also set up a lint npm script to inspect the files with .ts extension by modifying the package.json file:

    {
      // ...
      "scripts": {
          "start": "ts-node index.ts",
          "dev": "ts-node-dev index.ts",
          "lint": "eslint --ext .ts ."
          //  ...
      },
      // ...
    }
    
Now lint will complain if we try to define a variable of type any:

The @typescript-eslint has a lot of TypeScript specific eslint rules, but you can also use all basic eslint rules in TypeScript projects. For now we should probably go with the recommended settings and modify the rules as we go along whenever we find something we want to behave differently.

On top of the recommended settings, we should try to get familiar with the coding style required in this part and set the semicolon at the end of each line of code to required.

So we will use the following .eslintrc

    {
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
      ],
      "plugins": ["@typescript-eslint"],
      "env": {
        "node": true,
        "es6": true
      },
      "rules": {
        "@typescript-eslint/semi": ["error"],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { "argsIgnorePattern": "^_" }
        ],
        "no-case-declarations": "off"
      },
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
        "project": "./tsconfig.json"
      }
    }

## Setting up the project

Let's start by creating our first real project: Ilari's flight diaries. As usual run npm init and install the typescript package as a dev dependency.

     npm install typescript --save-dev
 
TypeScript's Native Compiler (tsc) can help us to initialize our project, generating our tsconfig.json file. First, we need to add the tsc command to the list of executable scripts in package.json (unless you have installed typescript globally). Even if you installed TypeScript globally, you should always add it as a dev-dependency to your project.

The npm script for running tsc is set as follows:

    {
      // ..
      "scripts": {
        "tsc": "tsc"
      },
      // ..
    }
    
The bare tsc command is often added to the scripts so that other scripts can use it, hence don't be surprised to find it set up within the project like this.

We can now initialise our tsconfig.json settings by running:

     npm run tsc -- --init

At the moment, we want the following to be active:

    {
      "compilerOptions": {
        "target": "ES6",
        "outDir": "./build/",
        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        "esModuleInterop": true
      }
    }
Now that we have set our configuration, we can continue by installing express and, of course, also @types/express. Also, since this is a real project, which is intended to be grown over time, we will use eslint from the very beginning:

    npm install express
    npm install --save-dev eslint @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser

We also create an .eslintrc file with the following content:

    {
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
      ],
      "plugins": ["@typescript-eslint"],
      "env": {
        "browser": true,
        "es6": true,
        "node": true
      },
      "rules": {
        "@typescript-eslint/semi": ["error"],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { "argsIgnorePattern": "^_" }
        ],
        "no-case-declarations": "off"
      },
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
        "project": "./tsconfig.json"
      }
    }

 let's install ts-node-dev

    npm install --save-dev ts-node-dev
    
We finally define a few more npm script, and voilà, we are ready to begin:

    {
      // ...
      "scripts": {
        "tsc": "tsc",
        "dev": "ts-node-dev index.ts",
        "lint": "eslint --ext .ts ."
      },
      // ...
    }

Now we can finally start coding! As always, we start by creating a ping-endpoint, just to make sure everything is working.

The contents of the index.ts file:

    import express from 'express';
    const app = express();
    app.use(express.json());

    const PORT = 3000;

    app.get('/ping', (_req, res) => {
      console.log('someone pinged here');
      res.send('pong');
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
Now if we run the app with npm run dev we can verify that a request to http://localhost:3000/ping gives a response pong, so our configuration is set!

When starting the app with npm run dev, it runs in development mode. The development mode is not suitable at all when we later operate the app in production.

Let's try to create a production build by running the TypeScript compiler. Since we have defined the outdir in our tsconfig.json, there's really nothing else to do but run the script npm run tsc.

Just like magic a native runnable JavaScript production build of the express backend is created into the directory build.

Currently, if we run eslint it will also interpret the files in the build directory. We don't want that, since the code there is compiler generated. We can prevent this by creating a .eslintignore file which lists the content we want eslint to ignore, just like we do with git and gitignore.

Let's add an npm script for running the application in production mode:

    {
      // ...
      "scripts": {
        "tsc": "tsc",
        "dev": "ts-node-dev index.ts",
        "lint": "eslint --ext .ts .",
        "start": "node build/index.js"
      },
      // ...
    }

## Code structure

First we need to make some decisions on how to structure our source code. It is better to place all source code under src directory, so source code is not mixed with configuration files. We will move index.ts there and make the necessary changes to the npm scripts.

We will place all routers, modules which are responsible for handling a set of specific resources such as diaries, under the directory src/routes. This is a bit different than what we did in part 4, where we used directory src/controllers.

The router taking care of all diary endpoints is in src/routes/diaries.ts and looks like this:

    import express from 'express';

    const router = express.Router();

    router.get('/', (_req, res) => {
      res.send('Fetching all diaries!');
    });

    router.post('/', (_req, res) => {
      res.send('Saving a diary!');
    });

    export default router;

We'll route all requests to prefix /api/diaries to that specific router in index.ts

    import express from 'express';
    import diaryRouter from './routes/diaries';
    const app = express();
    app.use(express.json());

    const PORT = 3000;

    app.get('/ping', (_req, res) => {
      console.log('someone pinged here');
      res.send('pong');
    });

    app.use('/api/diaries', diaryRouter);


    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

And now if we make a HTTP GET request to http://localhost:3000/api/diaries we should see the message Fetching all diaries!.

Next we need to start serving the seed data (found here) from the app. We will fetch the data and save it to data/diaries.json.

We won't be writing the code for the actual data manipulations on the router. We will create a service which takes care of the data manipulation instead. It is quite common practice to separate the "business logic" from the router code into its own modules, which are quite often called services. The name service originates from Domain driven design and was made popular by the Spring framework.

Let's create a src/services directory and place the diaryService.ts file in it. The file contains two functions for fetching and saving diary entries:

    import diaryData from '../../data/diaries.json';

    const getEntries = () => {
      return diaryData;
    };

    const addEntry = () => {
      return null;
    };

    export default {
      getEntries,
      addEntry
    };

Currently we have a basic working TypeScript express app, but there are barely any actual typings in the code. Since we know what type of data should be accepted for the weather and visibility fields, there is no reason for us not to include their types to the code.

Let's create a file for our types, types.ts, where we'll define all our types for this project.

First, let's type the Weather and Visibility values using a union type of the allowed strings:

    export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

    export type Visibility = 'great' | 'good' | 'ok' | 'poor';


Since we cannot use typings in a JSON-file, we should convert the json-file to a ts-file which exports the typed data like so:

    import { DiaryEntry } from "../src/types";

    const diaryEntries: Array<DiaryEntry> = [
      {
          "id": 1,
          "date": "2017-01-01",
          "weather": "rainy",
          "visibility": "poor",
          "comment": "Pretty scary flight, I'm glad I'm alive"
      },
      // ...
    ];

    export default diaryEntries;
  
And from there we can continue by creating a DiaryEntry type, which will be an interface:

    export interface DiaryEntry {
      id: number;
      date: string;
      weather: Weather;
      visibility: Visibility;
      comment: string;
    }
    We can now try to type our imported json:

    import diaryData from '../../data/diaries';

    import { DiaryEntry } from '../types';

    const getEntries = (): Array<DiaryEntry> => {
      return diaries;
    };

    const addEntry = () => {
      return null;
    };

    export default {
      getEntries,
      addEntry
    };

We should never use type assertion unless there is no other way to proceed, as there is always the danger we assert an unfit type to an object and cause a nasty runtime error. While the compiler trusts you to know what you are doing when using as, doing this we are not using the full power of TypeScript but relying on the coder to secure the code.

## Node and JSON modules

It is important to take note of a problem that may arise when using the tsconfig resolveJsonModule option:

According to the node documentation for file modules, node will try to resolve modules in order of extensions:

     ["js", "json", "node"]
     
In addition to that, by default, ts-node and ts-node-dev extend the list of possible node module extensions to:

     ["js", "json", "node", "ts", "tsx"]

In TypeScript, with the resolveJsonModule option set to true, the file myModule.json becomes a valid node module.

We notice that the .json file extension takes precedence over .ts and so myModule.json will be imported and not myModule.ts.

In order to avoid time eating bugs, it is recommended that within a flat directory, each file with a valid node module extension has a unique filename.

## Utility Types

The Pick utility type allows us to choose which fields of an existing type we want to use. Pick can be used to either construct a completely new type, or to inform a function what it should return on runtime. Utility types are a special kinds of type tools, but they can be used just like regular types.

In our case, in order to create a "censored" version of the DiaryEntry for public displays, we can use Pick in the function declaration:

    const getNonSensitiveEntries =
      (): Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>[] => {
        // ...
      }
  
and the compiler would expect the function to return an array of values of the modified DiaryEntry type, which include only the four selected fields.

In this case we want to exclude only one field, so even better would be to use the Omit utility type, which we can use to declare which fields to exclude:

    const getNonSensitiveEntries = (): Omit<DiaryEntry, 'comment'>[] => {
      // ...
    }

Another way would be to declare a completely new type for the NonSensitiveDiaryEntry:

    export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;

One thing in our application is a cause for concern. In the getNonSensitiveEntries we are returning the complete diary entries, and no error is given despite typing!

This happens because TypeScript only checks whether we have all of the required fields or not, but excess fields are not prohibited. In our case this means that it is not prohibited to return an object of type DiaryEntry[], but if we were to try to access the comment field, it would not be possible because we would be accessing a field that TypeScript is unaware of even though it exists.

Because TypeScript doesn't modify the actual data but only its type, we need to exclude the fields ourselves:

    import diaries from '../../data/entries.js'

    import { NonSensitiveDiaryEntry, DiaryEntry } from '../types'

    const getEntries = () : DiaryEntry[] => {
      return diaries
    }

    const getNonSensitiveEntries = (): NonSensitiveDiaryEntry [] => {
      return diaries.map(({ id, date, weather, visibility }) => ({
        id,
        date,
        weather,
        visibility,
      }));
    };

    const addDiary = () => {
      return []
    }

    export default {
      getEntries,
      getNonSensitiveEntries,
      addDiary
    }

Finally, we can complete the route which returns all diary entries:

    import express from 'express';
    import diaryService from '../services/diaryService';

    const router = express.Router();

    router.get('/', (_req, res) => {
      res.send(diaryService.getNonSensitiveEntries());
    });

    router.post('/', (_req, res) => {
        res.send('Saving a diary!');
    });

    export default router;

## Preventing an accidental undefined result

Let's extend the backend to support fetching one specific entry with a HTTP GET request to route api/diaries/:id.

The DiaryService needs to be extended with findById-function:

    // ...

    const findById = (id: number): DiaryEntry => {
      const entry = diaries.find(d => d.id === id);
      return entry;
    };

    export default {
      getEntries,
      getNonSensitiveEntries,
      addDiary,
      findById
    }

he issue is, that there is no guarantee that an entry with the specified id can be found. It is good that we are made aware of this potential problem already at compile phase. Without TypeScript we would not be warned about this problem, and in the worst case scenario we could have ended up returning an undefined object instead of informing the user about the specified entry not being found.

First of all in cases like this we need to decide what the return value should be if an object is not found, and how the case should be handled. The find method of an array returns undefined if the object is not found, and this is actually fine with us. We can solve our problem by typing the return value as follows

    const findById = (id: number): DiaryEntry | undefined => {
      const entry = diaries.find(d => d.id === id);
      return entry;
    }
    The route handler is the following

    import express from 'express';
    import diaryService from '../services/diaryService'

    router.get('/:id', (req, res) => {
      const diary = diaryService.findById(Number(req.params.id));

      if (diary) {
        res.send(diary);
      } else {
        res.sendStatus(404);
      }
    });

    // ...

    export default router;

## Adding a new diary

Let's start building the HTTP POST endpoint for adding new flight diary entries. The new entries should have the same type as the existing data.

The code handling of the response looks as follows

    router.post('/', (req, res) => {
      const { date, weather, visibility, comment } = req.body;
      const newDiaryEntry = diaryService.addDiary(
        date,
        weather,
        visibility,
        comment,
      );
      res.json(newDiaryEntry);
    });
    
Let's create that in types.ts using the existing DiaryEntry type and the Omit utility type:

    export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;    

corresponding method in diaryService looks like this

    import { NewDiaryEntry, NonSensitiveDiaryEntry, DiaryEntry } from '../types';

    // ...

    const addDiary = ( entry: NewDiaryEntry ): DiaryEntry => {
      const newDiaryEntry = {
        id: Math.max(...diaries.map(d => d.id)) + 1,
        ...entry
      };

      diaries.push(newDiaryEntry);
      return newDiaryEntry;
    };

In order to parse the incoming data we must have the json middleware configured:

    import express from 'express';
    import diaryRouter from './routes/diaries';
    const app = express();
    app.use(express.json());

    const PORT = 3000;

    app.use('/api/diaries', diaryRouter);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

Now the application is ready to receive HTTP POST requests for new diary entries of the correct type!

## Proofing requests

We certainly would like to have a certainty that the object in a post request is of a right type so let us define a function toNewDiaryEntry that receives the request body as a parameter and returns a properly typed NewDiaryEntry object. The function shall be defined in the file utils.ts.

The route definition uses the function as follows

    import toNewDiaryEntry from '../utils';

    // ...

    router.post('/', (req, res) => {
      try {
        const newDiaryEntry = toNewDiaryEntry(req.body);

        const addedEntry = diaryService.addDiary(newDiaryEntry);
        res.json(addedEntry);
      } catch (e) {
        res.status(400).send(e.message);
      }
    })

Since we are now making secure code and trying to ensure that we are getting exactly the data we want from the requests, we should get started with parsing and validating each field we are expecting to receive.

The skeleton of the function toNewDiaryEntry looks like the following:

    import { NewDiaryEntry } from './types';

    const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
      const newEntry: NewDiaryEntry = {
        // ...
      }

      return newEntry;
    }

    export default toNewDiaryEntry;

unknown is a new kind of top type that was introduced in TypeScript version 3 to be the type-safe counterpart of any. Anything is assignable to unknown, but unknown isn’t assignable to anything but itself and any without a type assertion or a control flow based narrowing. Likewise, no operations are permitted on an unknown without first asserting or narrowing to a more specific type.

To validate the comment field we need to check that it exists, and to ensure that it is of the type string.

The function should look something like this:

    const parseComment = (comment: unknown): string => {
      if (!comment || !isString(comment)) {
        throw new Error('Incorrect or missing comment');
      }

      return comment;
    }

The string validation function looks like this

    const isString = (text: unknown): text is string => {
      return typeof text === 'string' || text instanceof String;
    };

The date validation function looks like this

    const isDate = (date: string): boolean => {
      return Boolean(Date.parse(date));
    };

    const parseDate = (date: unknown): string => {
      if (!date || !isString(date) || !isDate(date)) {
          throw new Error('Incorrect or missing date: ' + date);
      }
      return date;
    };

Let us redefine the type Weather as follows:

    export enum Weather {
      Sunny = 'sunny',
      Rainy = 'rainy',
      Cloudy = 'cloudy',
      Stormy = 'stormy',
      Windy = 'windy',
    }
    
Now we can check that a string is one of the accepted values, and the type guard can be written like this:

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isWeather = (param: any): param is Weather => {
      return Object.values(Weather).includes(param);
    };

    const parseWeather = (weather: unknown): Weather => {
      if (!weather || !isWeather(weather)) {
          throw new Error('Incorrect or missing weather: ' + weather);
      }
      return weather;
    };

We can fix this by destructuring the fields to variables of the type unknown as follows:

    type Fields = { comment : unknown, date: unknown, weather: unknown, visibility: unknown };

    const toNewDiaryEntry = ({ comment, date, weather, visibility } : Fields): NewDiaryEntry => {
      const newEntry: NewDiaryEntry = {
        comment: parseComment(comment),
        date: parseDate(date),
        weather: parseWeather(weather),
        visibility: parseVisibility(visibility)
      };

      return newEntry;
    };
    
## React with TypeScript

We can use create-react-app to create a TypeScript app by adding a template argument to the initialisation script. So in order to create a TypeScript Create React App, run the following command:

    npx create-react-app my-app --template typescript

We need to get our linting script to parse *.tsx files, which are the TypeScript equivalent of react's JSX files. We can do that by altering our lint command in .package.json to the following:

    {
      // ...
        "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject",
        "lint": "eslint './src/**/*.{ts,tsx}'"
      },
      // ...
    }
    
If you are using Windows, you may need to use double quotes for the linting path: "lint": "eslint \"./src/**/*.{ts,tsx}\"".

Let's consider the following example:

    const courseParts = [
      {
        name: "Fundamentals",
        exerciseCount: 10,
        description: "This is an awesome course part"
      },
      {
        name: "Using props to pass data",
        exerciseCount: 7,
        groupProjectCount: 3
      },
      {
        name: "Deeper type usage",
        exerciseCount: 14,
        description: "Confusing description",
        exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev"
      }
    ];

There is still a lot of duplication in our types, and we want to avoid that. We start off by identifying the attributes all course parts have in common, and defining a base type which contains them. Then we will extend that base type to create our part specific types:

    interface CoursePartBase {
      name: string;
      exerciseCount: number;
    }

    interface CoursePartOne extends CoursePartBase {
      name: "Fundamentals";
      description: string;
    }

    interface CoursePartTwo extends CoursePartBase {
      name: "Using props to pass data";
      groupProjectCount: number;
    }

    interface CoursePartThree extends CoursePartBase {
      name: "Deeper type usage";
      description: string;
      exerciseSubmissionLink: string;
    }

How should we now use these types in our components?

One handy way to use these kind of types in TypeScript is by using switch case expressions. Once you have either explicitly declared or TypeScript has inferred that a variable is of type union and each type in the type union contains a certain attribute, we can use that as a type identifier. We can then build a switch case around that attribute and TypeScript will know which attributes are available within each case block.

![image](https://user-images.githubusercontent.com/67811876/123739445-40b46880-d8d9-11eb-85fb-8035317a9b82.png)

In the above example TypeScript knows that a coursePart has the type CoursePart. It can then infer that part is of either type CoursePartOne, CoursePartTwo or CoursePartThree. The name is distinct for each type, so we can use it to identify each type and TypeScript can let us know which attributes are available in each case block. TypeScript will then produce an error if you e.g. try to use the part.description within the "Using props to pass data" block.


With TypeScript we can use a method called exhaustive type checking. Its basic principle is that if we encounter an unexpected value, we call a function that accepts a value with the type never and also has the return type never.

A straight forward version of the function could look like this:

    /**
     * Helper function for exhaustive type checking
     */
    const assertNever = (value: never): never => {
      throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
      );
    };

We now were to replace the contents of our default block to:

    default:
      return assertNever(part);

We actually could have had the same effect by using a type alias

    type DiaryEntry = {
      id: number;
      date: string;
      weather: Weather;
      visibility: Visibility;
      comment?: string;
    } 

In most cases you can use either type or interface, whichever syntax you prefer. However there are a few things to keep in mind. For example if you define multiple interfaces with the same name, they will result in a merged interface, whereas if you try to define multiple types with the same name, it will result in an error stating that a type with the same name is already declared.

## Handling states

The context of our application has a tuple containing the app state and the dispatcher for changing the state. The application state is typed as follows:

    export type State = {
      patients: { [id: string]: Patient };
    };

But be aware of one thing! When a type is declared like the type for patients, TypeScript does not actually have any way of knowing if the key you are trying to access actually exists or not. So if we were to try to access a patient by a non-existing id, the compiler would think that the returned value is of type Patient and no error would be thrown when trying to access its properties:

    const myPatient = state.patients['non-existing-id'];
    console.log(myPatient.name); // no error, TypeScript believes that myPatient is of type Patient

To fix this, we could define the type for patient values to be a union of Patient and undefined in the following way:

    export type State = {
      patients: { [id: string]: Patient | undefined };
    };
    
That would cause the compiler to give the following warning:

    const myPatient = state.patients['non-existing-id'];
    console.log(myPatient.name); // error, Object is possibly 'undefined'

This type of additional type security is always good to implement if you e.g. use data from external sources or use the value of a user input to access data in your code. But if you are sure that you only handle data that actually exists, then there is no one stopping you from using the first presented solution.

Just like with redux, all state manipulation is done by a reducer. It is defined in the file reducer.ts along with the type Action that looks as follows

    export type Action =
      | {
          type: "SET_PATIENT_LIST";
          payload: Patient[];
        }
      | {
          type: "ADD_PATIENT";
          payload: Patient;
        };

The reducer looks quite similiar to the ones we wrote in part 6. It changes the state for each type of action:

    export const reducer = (state: State, action: Action): State => {
      switch (action.type) {
        case "SET_PATIENT_LIST":
          return {
            ...state,
            patients: {
              ...action.payload.reduce(
                (memo, patient) => ({ ...memo, [patient.id]: patient }),
                {}
              ),
              ...state.patients
            }
          };
        case "ADD_PATIENT":
          return {
            ...state,
            patients: {
              ...state.patients,
              [action.payload.id]: action.payload
            }
          };
        default:
          return state;
      }
    };

There are a lot of things happening in the file state.ts, which takes care of setting up the context. The main ingredient is the useReducer hook used to create the state and the dispatch-function, and pass them on to the context provider:

    export const StateProvider = ({
      reducer,
      children
    }: StateProviderProps) => {
      const [state, dispatch] = useReducer(reducer, initialState);
      return (
        <StateContext.Provider value={[state, dispatch]}>
          {children}
        </StateContext.Provider>
      );
    };

The provider makes the state and the dispatch functions available in all of the components, thanks to the setup in index.ts:

    import { reducer, StateProvider } from "./state";

    ReactDOM.render(
      <StateProvider reducer={reducer}>
        <App />
      </StateProvider>, 
      document.getElementById('root')
    );
It also defines the useStateValue hook

    export const useStateValue = () => useContext(StateContext);
    
and the components that need to access the state or dispatcher use it to get hold of those:

    import { useStateValue } from "../state";

    // ...

    const PatientListPage = () => {
      const [{ patients }, dispatch] = useStateValue();
      // ...
    }

## Fetching data from the backend

Let's go through the PatientListPage/index.ts as you can take inspiration from there to help you fetch data from the backend and update the application's state. PatientListPage uses our custom hook to inject the state, and the dispatcher for updating it. When we list the patients, we only need to destructure the patients property from the state:

    import { useStateValue } from "../state";

    const PatientListPage = () => {
      const [{ patients }, dispatch] = useStateValue();
      // ...
    }
    
We also use the app state created with the useState hook for managing modal visibility and form error handling:

    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | undefined>();


We also have openModal and closeModal helper functions for better readability and convenience:

    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
      setModalOpen(false);
      setError(undefined);
    };

When the component App mounts, it fetches patients from the backend using axios. Note how we are giving the axios.get function a type parameter to describe the type of the response data:

    React.useEffect(() => {
      axios.get<void>(`${apiBaseUrl}/ping`);

      const fetchPatientList = async () => {
        try {
          const { data: patients } = await axios.get<Patient[]>(
            `${apiBaseUrl}/patients`
          );
          dispatch({ type: "SET_PATIENT_LIST", payload: patients });
        } catch (e) {
          console.error(e);
        }
      };
      fetchPatientList();
    }, [dispatch]);

As our app is quite small, we will update the state by simply calling the dispatch function provided to us by the useStateValue hook. The compiler helps by making sure that we dispatch actions according to our Action type with predefined type string and payload:

## Form handling using Formik

ooking at the top of the AddPatientForm.tsx you can see we have created a type for our form values, called simply PatientFormValues. The type is a modified version of the Patient type, with the id and entries properties omitted. We don't want the user to be able to submit those when creating a new patient. The id is created by the backend and entries can only be added for existing patients.

    export type PatientFormValues = Omit<Patient, "id" | "entries">;
    
Next we declare the props for our form component:

    interface Props {
      onSubmit: (values: PatientFormValues) => void;
      onCancel: () => void;
    }
    
As you can see, the component requires two props: onSubmit and onCancel. Both are callback functions that return void. The onSubmit function should receive an object of type PatientFormValues as an argument, so that the callback can handle our form values.

Looking at the AddPatientForm function component, you can see we have bound the Props as our component's props, and we destructure onSubmit and onCancel from those props.

    export const AddPatientForm = ({ onSubmit, onCancel }: Props) => {
      // ...
    }

Since the only options we want to allow are different genders, we set that the value should be of type Gender.

    export type GenderOption = {
      value: Gender;
      label: string;
    };
    
In AddPatientForm.tsx we use the GenderOption type for the genderOptions variable, declaring it to be an array containing objects of type GenderOption:

    const genderOptions: GenderOption[] = [
      { value: Gender.Male, label: "Male" },
      { value: Gender.Female, label: "Female" },
      { value: Gender.Other, label: "Other" }
    ];
    
Next look at the type SelectFieldProps. It defines the type for the props for our SelectField component. There you can see that options is an array of GenderOption types.

    type SelectFieldProps = {
      name: string;
      label: string;
      options: GenderOption[];
    };
    
The function component SelectField in itself is pretty straight forward. It renders the label, a select element, and all given option elements (or actually their labels and values).

    export const SelectField = ({
      name,
      label,
      options
    }: SelectFieldProps) => (
      <Form.Field>
        <label>{label}</label>
        <Field as="select" name={name} className="ui dropdown">
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label || option.value}
            </option>
          ))}
        </Field>
      </Form.Field>
    );
    
Now let's move on to the TextField component. The component renders a SemanticUI Form.Field with a label and a Formik Field. The Formik Field receives a name and a placeholder as props.

    interface TextProps extends FieldProps {
      label: string;
      placeholder: string;
    }

    export const TextField = ({ field, label, placeholder }: TextProps) => (
      <Form.Field>
        <label>{label}</label>
        <Field placeholder={placeholder} {...field} />
        <div style={{ color:'red' }}>
          <ErrorMessage name={field.name} />
        </div>
      </Form.Field>
    );
    
Note, that we use the Formik ErrorMessage component to render an error message for the input when needed. The component does everything under the hood, and we don't need to specify what it should do.

It would also be possible to get hold of the error messages within the component by using the prop form:

    export const TextField = ({ field, label, placeholder, form }: TextProps) => {
      console.log(form.errors); 
      // ...
    }

Now, back to the actual form component in AddPatientForm.tsx. The function component AddPatientForm renders a Formik component. The Formik component is a wrapper, which requires two props: initialValues and onSubmit. The function of the props is quite self explanatory. The Formik wrapper keeps a track of your form's state, and then exposes it and a few resuable methods and event handlers to your form via props.

We are also using an optional validate prop, that expects a validation function and returns an object containing possible errors. Here we only check that our text fields are not falsy, but it could easily contain e.g. some validation for the social security number format or something like that. The error messages defined by this function can then be displayed on the corresponding field's ErrorMessage component.

First have a look at the entire component. We will later discuss the different parts in detail.

    interface Props {
      onSubmit: (values: PatientFormValues) => void;
      onCancel: () => void;
    }

    export const AddPatientForm = ({ onSubmit, onCancel }: Props) => {
      return (
        <Formik
          initialValues={{
            name: "",
            ssn: "",
            dateOfBirth: "",
            occupation: "",
            gender: Gender.Other
          }}
          onSubmit={onSubmit}
          validate={values => {
            const requiredError = "Field is required";
            const errors: { [field: string]: string } = {};
            if (!values.name) {
              errors.name = requiredError;
            }
            if (!values.ssn) {
              errors.ssn = requiredError;
            }
            if (!values.dateOfBirth) {
              errors.dateOfBirth = requiredError;
            }
            if (!values.occupation) {
              errors.occupation = requiredError;
            }
            return errors;
          }}
        >
          {({ isValid, dirty }) => {
            return (
              <Form className="form ui">
                <Field
                  label="Name"
                  placeholder="Name"
                  name="name"
                  component={TextField}
                />
                <Field
                  label="Social Security Number"
                  placeholder="SSN"
                  name="ssn"
                  component={TextField}
                />
                <Field
                  label="Date Of Birth"
                  placeholder="YYYY-MM-DD"
                  name="dateOfBirth"
                  component={TextField}
                />
                <Field
                  label="Occupation"
                  placeholder="Occupation"
                  name="occupation"
                  component={TextField}
                />
                <SelectField
                  label="Gender"
                  name="gender"
                  options={genderOptions}
                />
                <Grid>
                  <Grid.Column floated="left" width={5}>
                    <Button type="button" onClick={onCancel} color="red">
                      Cancel
                    </Button>
                  </Grid.Column>
                  <Grid.Column floated="right" width={5}>
                    <Button
                      type="submit"
                      floated="right"
                      color="green"
                      disabled={!dirty || !isValid}
                    >
                      Add
                    </Button>
                  </Grid.Column>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      );
    };

    export default AddPatientForm;

As a child of our Formik wrapper, we have a function which returns the form contents. We use Formik's Form to render the actual form element. Inside of the Form element we use our TextField and SelectField components, that we created in FormField.tsx.

Lastly we create two buttons: one for cancelling the form submission and one for submitting the form. The cancel button calls the onCancel callback straight away when clicked. The submit button triggers Formik's onSubmit event, which in turn uses the onSubmit callback from the component's props. The submit button is enabled only if the form is valid and dirty, which means that user has edited some of the fields.

We handle form submission through Formik, because it allows us to call the validation function before performing the actual submission. If the validation function returns any errors, the submission is cancelled.

The buttons are set inside a SemanticUI Grid to set them next to each other easily.

    <Grid>
      <Grid.Column floated="left" width={5}>
        <Button type="button" onClick={onCancel} color="red">
          Cancel
        </Button>
      </Grid.Column>
      <Grid.Column floated="right" width={5}>
        <Button type="submit" floated="right" color="green">
          Add
        </Button>
      </Grid.Column>
    </Grid>
    The onSubmit callback has been passed down all the way from our patient list page. Basically it sends a HTTP POST request to our backend, adds the patient returned from the backend to our app's state and closes the modal. If the backend returns an error, the error is displayed on the form.

Here is our submit function:

    const submitNewPatient = async (values: FormValues) => {
      try {
        const { data: newPatient } = await axios.post<Patient>(
          `${apiBaseUrl}/patients`,
          values
        );
        dispatch({ type: "ADD_PATIENT", payload: newPatient });
        closeModal();
      } catch (e) {
        console.error(e.response.data);
        setError(e.response.data.error);
      }
    };











































































