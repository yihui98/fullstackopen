import { patientsEntry, nonSensitivePatientsEntry, NewPatientEntry, Patient, NewEntry }  from '../types/types';
import patientsData from '../data/patients';
import {v1 as uuid} from 'uuid';

let patients: Array<Patient> = patientsData ; 

const getEntries = (): patientsEntry[] => {
  return patients;
};

const findByID = (id: string): Patient | undefined => {
  const entry = patients.find(p => p.id === id);
  return (entry);

};

const getNonSensitiveEntries = (): nonSensitivePatientsEntry [] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    }));
  };

const addPatient = (entry: NewPatientEntry): Patient => {
    
  const newPatientEntry = {
      id: uuid(),
      entries: [],
      ...entry
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patient: Patient, entry: NewEntry): Patient =>{
  const newEntry = {
    id: uuid(),
    ...entry
  }
  const savedPatient = {...patient, entries: patient.entries.concat(newEntry)}
  patients = patients.map((p) =>
  p.id === savedPatient.id ? savedPatient : p
);
  return savedPatient;
}

export default {
  getEntries,
  addPatient,
  getNonSensitiveEntries,
  findByID,
  addEntry
};