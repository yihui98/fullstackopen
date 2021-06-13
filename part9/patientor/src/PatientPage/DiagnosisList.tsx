import React from "react";
import { useStateValue } from "../state";
import { Diagnosis } from "../types";

interface DiagnosesDetailsProps {
    codes: Array<Diagnosis["code"]> | undefined;
  }
  
const DiagnosisList: React.FC<DiagnosesDetailsProps> = ({ codes }) => {
const [{ diagnoses }] = useStateValue();
console.log(codes);
if (codes === undefined){
    return null;
}
return(
    <div>
    <ul>
    {codes.map((code, i) =>
    <li key = {i}>{code} {diagnoses[code].name} </li>
    )}
    </ul>
    </div>
);
};

  export default DiagnosisList;