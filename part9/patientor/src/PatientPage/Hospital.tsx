import React from "react";
import { Header, Icon, Segment } from "semantic-ui-react";
import { HospitalEntry} from "../types";
import DiagnosisList from "./DiagnosisList";

interface HospitalProps {
    entry: HospitalEntry | undefined;
  }
  
const HospitalCareEntry: React.FC<HospitalProps> = ({ entry }) => {
if (entry === undefined){
    return null;
}
return(
    <Segment>
        <Header>
            {entry.discharge.date} Hospital <Icon name = "doctor" />
        </Header>
        {entry.description}
        <DiagnosisList codes = {entry.diagnosisCodes} />
    </Segment>);
};

  export default HospitalCareEntry;