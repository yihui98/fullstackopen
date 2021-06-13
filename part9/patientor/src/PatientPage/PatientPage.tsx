import React from "react";
import { Button, Container } from "semantic-ui-react";

import { useParams } from "react-router-dom";
import { UserParams, Entry, EntryType, Patient } from "../types";
import { addEntry, useStateValue } from "../state";
import { Icon } from 'semantic-ui-react';
import HospitalCareEntry from "./Hospital";
import OccupationalHealthcare from "./OccupationalHealthcare";
import HealthCheck from "./HealthCheck";
import AddEntryModal from "../AddEntryModal";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) =>{
  switch(entry.type){
    case EntryType.Hospital:
      return <HospitalCareEntry entry = {entry} />;
    case EntryType.OccupationalHealthcare:
      return <OccupationalHealthcare entry = {entry} />;
    case EntryType.HealthCheck:
      return <HealthCheck entry = {entry} />;
    default:
      return assertNever(entry);
  }
};

const EntryComponent: React.FC<{ entrylst: Entry[]}> = ({entrylst}) =>{
  if (entrylst.length === 0 ){
    return null;
  } else{
    return(
      <div>
        <h2>{entrylst.length === 1 ? "Entry" : "Entries"}</h2>
        {entrylst.map(entry => 
          <div key = {entry.id}>
          <EntryDetails entry = {entry} />
          </div>
        )}
      </div>
    );
  }
};

const PatientPage = () => {
    const {id} = useParams<UserParams>();
    const [{ patients }, dispatch] = useStateValue();
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | undefined>();
  
    const openModal = (): void => setModalOpen(true);
  
    const closeModal = (): void => {
      setModalOpen(false);
      setError(undefined);
    };

    const patient = patients[id];

    const submitNewEntry = async (values: EntryFormValues) => {
      try {
        const { data: newEntry } = await axios.post<Patient>(
          `${apiBaseUrl}/patients/${id}/entries`,
          values
        );
        dispatch(addEntry(newEntry));
        closeModal();
      } catch (e) {
        console.error(e.response?.data || 'Unknown Error');
        setError(e.response?.data?.error || 'Unknown error');
      }
    };

    let genderIcon: 'man' | 'woman' | 'genderless';
    genderIcon = "genderless";
    if(patient){
      switch(patient.gender){
        case "male":
          genderIcon = 'man';
          break;
        case "female":
          genderIcon = "woman";
          break;
        case "other":
          genderIcon = "genderless";
          break;
      default:
        genderIcon = "genderless";
    }
  }

  return (
      <Container textAlign="left">
        <h3> {patient.name} <Icon name = {genderIcon} /> </h3>
        <div>ssn: {patient.ssn}</div>
        <div>occupation: {patient.occupation}</div>
        <div>gender: {patient.gender}</div>
        <div>dateOfBirth: {patient.dateOfBirth}</div>
        <EntryComponent entrylst = {patient.entries} />
        <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
        type = "Hospital"
      />
      <Button onClick={() => openModal()}>Add New Patient</Button>
      </Container>
      
  );
  };

export default PatientPage;
