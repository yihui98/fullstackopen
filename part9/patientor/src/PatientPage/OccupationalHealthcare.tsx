import React from "react";
import {  Header, Icon, Segment } from "semantic-ui-react";
import { OccupationalHealthcareEntry} from "../types";
import DiagnosisList from "./DiagnosisList";

interface leavesProps {
    dates: {
        startDate: string,
        endDate: string;
      } | undefined;
  }

const Leaves: React.FC<leavesProps> = ({ dates }) =>{
    if (dates === undefined){
        return null;
    }
    return(
        <div>
            Sick Leave: {dates.startDate} - {dates.endDate}
        </div>
    );
};

interface OccupationalProps {
    entry: OccupationalHealthcareEntry | undefined;
  }
  
const OccupationalHealthcare: React.FC<OccupationalProps> = ({ entry }) => {
if (entry === undefined){
    return null;
}
return(
    <Segment>
        <Header>
            {entry.date} Occupational Healthcare <Icon name = "hospital" />
        </Header>
        {entry.description}
        <DiagnosisList codes = {entry.diagnosisCodes} />
        <Leaves dates = {entry.sickLeave} />
    </Segment>
);
};

  export default OccupationalHealthcare;