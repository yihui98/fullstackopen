import React from 'react';
import { isPropertySignature } from 'typescript';


const Header = (props: HeaderProps) =>{
  return(
    <h1>{props.courseName}</h1>
  )
}

interface HeaderProps {
  courseName: string
}

interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseDescriptionBase extends CoursePartBase{
  description: string;
}

interface CourseNormalPart extends CourseDescriptionBase {
  type: "normal";
}
interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CourseDescriptionBase {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CourseDescriptionBase{
  type: "special";
  requirements: Array<string>
}

type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseSpecialPart;

interface ContentProps{
  courseParts:CoursePart[]
}

interface PartProps{
  part: CoursePart;
}

const Content = (props: ContentProps ) =>{
    return(
      <div>
        {props.courseParts.map((part, i) => 
          <Part key = {i} part = {part} />
        )}
      </div>
    )
}

const Part = (props : PartProps) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch(props.part.type){
    case "normal":
      return(
        <p>
          <h3> {props.part.name} {props.part.exerciseCount} </h3> {props.part.description}
        </p>
      )
    case "groupProject":
      return(
        <p>
          <h3>{props.part.name} {props.part.exerciseCount}  </h3>
          project exercises: {props.part.groupProjectCount}
        </p>
      )
    case "submission":
      return(
        <p>
          <h3>{props.part.name} {props.part.exerciseCount} </h3>
          <div>{props.part.description}</div>
          <div> {props.part.exerciseSubmissionLink} </div>
        </p>
      )
    case "special":
      return(
        <p>
          <h3>{props.part.name} {props.part.exerciseCount} </h3>
          <div>{props.part.description}</div>
          <div>required skills: {props.part.requirements.toString()}</div>
        </p>
      )

    default:
      return assertNever(props.part)
}
}

const Total = (props: ContentProps) => {
  return(
    <div>
      <p>
        Number of exercises{" "}
        {props.courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    </div>
  )
}

const App = () => {
  const courseName =  "Half Stack application development";
  const courseParts: CoursePart[] =  [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the leisured course part",
      type: "normal"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the harded course part",
      type: "normal"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      type: "groupProject"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      type: "submission"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      type: "special"
    }
  ]

  return (
    <div>
      <Header courseName = {courseName}/>
      <Content courseParts = {courseParts} />
      <Total courseParts = {courseParts} />
    </div>
  );
};

export default App;