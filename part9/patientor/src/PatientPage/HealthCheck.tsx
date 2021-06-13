import React from "react";
import { Header, Icon, Segment } from "semantic-ui-react";
import { HealthCheckEntry } from "../types";
import DiagnosisList from "./DiagnosisList";

interface HealthProps {
    entry: HealthCheckEntry| undefined;
  }
  


const HealthCheck: React.FC<HealthProps> = ({ entry }) => {
if (entry === undefined){
    return null;
}

let colour : "red" | "orange" | "yellow" | "green";

switch (entry.healthCheckRating) {
    case 0:
        colour = "green";
        break;
    case 1:
        colour = "yellow";
        break;
    case 2:
        colour = "orange";
        break;
    case 3:
        colour = "red";
        break;
    default:
        colour = "green";
        break;
}



return(
    <Segment>
        <Header>
            {entry.date} Health Check <Icon name = "heart" color = "red" />
        </Header>
        {entry.description}
        <DiagnosisList codes = {entry.diagnosisCodes} />
        <div>
            Health Check Rating: {entry.healthCheckRating} <Icon name = "heart" color = {colour} />
        </div>
    </Segment>
);
};

  export default HealthCheck;