/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewPatientEntry, Gender, HealthCheckRating, NewEntry, newBaseEntry, EntryType, SickLeave } from '../types/types';

const isString = (text: string): text is string => {
    return typeof text === 'string';
  };

const parseName = (name: string): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseString = (name: any, type: string): string => {
  if (!name || !isString(name)) {
    throw new Error(`Incorrect or missing ${type}`);
  }
  return name;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const parseDate = (date: any): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date;
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
    return Object.values(Gender).includes(param);
  };
  
const parseGender = (gender: any): Gender => {
    if (!gender || !isGender(gender)) {
        throw new Error('Incorrect Gender: ' + gender);
    }
    return gender;
  };

const parseOccupation = (occupation: any): string => {
    if (!occupation || !isString(occupation)) {
      throw new Error('Incorrect or missing occupation');
    }
    return occupation;
  };

const parseSSN= (occupation: any): string => {
    if (!occupation || !isString(occupation)) {
      throw new Error('Incorrect or missing ssn');
    }
    return occupation;
  };

const parseArray = (array: any): string[] => {
  if (Array.isArray(array)){
    let somethingIsNotString = false;
    array.forEach(function(item){
      if(typeof item !== 'string'){
        console.log(item, "NOT STRING");
         somethingIsNotString = true;
      }
   });
   if (somethingIsNotString && array.length > 0 ) {
    throw new Error('Incorrect or missing Array');
  }
  return array as string[];  
  }
  throw new Error('Incorrect or missing Array 2');
  };

  type discharge = {
    date: string;
    criteria: string;
  };
  const parseDischarge = (object: any): discharge => {
    if (!object) throw new Error("Missing discharge");
  
    return {
      date: parseDate(object.date),
      criteria: parseString(object.criteria, "discharge criteria"),
    };
  };

type Fields = { name: any, ssn: any, dateOfBirth: any, gender: any, occupation: any};

const toNewPatientEntry = ({ name, ssn, dateOfBirth, gender, occupation } : Fields): NewPatientEntry => {
    const newEntry: NewPatientEntry = {
        name: parseName(name),
        ssn: parseSSN(ssn),
        dateOfBirth: parseDate(dateOfBirth),
        gender: parseGender(gender),
        occupation: parseOccupation(occupation)
    };

  return newEntry;
};

export default toNewPatientEntry;

const parseEntryType = (entryType: any): EntryType => {
  if (!Object.values(EntryType).includes(entryType)) {
    throw new Error(`Incorrect or missing type: ${entryType || ""}`);
  }

  return entryType as EntryType;
};


const toNewBase = (object:any): newBaseEntry =>{
  const newBaseEntry: newBaseEntry = {
    type: parseEntryType(object.type),
    description: parseString(object.description, "description"),
    date: parseDate(object.date),
    specialist: parseString(object.specialist, "specialist"),
  };

  if (object.diagnosisCodes){
    newBaseEntry.diagnosisCodes = parseArray(object.diagnosisCodes);
  }
  return newBaseEntry;
};


const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};


const parseHealthCheckRating = (healthCheckRating: any): HealthCheckRating => {
  if (
    healthCheckRating === null ||
    healthCheckRating === undefined ||
    !isHealthCheckRating(healthCheckRating)
  ) {
    throw new Error(
      `Incorrect or missing health check rating: ${healthCheckRating || ""}`
    );
  }
  return healthCheckRating;
};

export const toNewEntry = (object: any): NewEntry =>{
  const newBaseEntry = toNewBase(object) as NewEntry;

  switch(newBaseEntry.type){
    case EntryType.Hospital:
      return{
        ...newBaseEntry,
        discharge: parseDischarge({
          date: object.DischargeDate as string,
          criteria: object.criteria as string,
        })
      };
    case EntryType.HealthCheck:
      return{
        ...newBaseEntry,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      };
    case EntryType.OccupationalHealthcare:
      const newEntry = {
        ...newBaseEntry,
        employerName: parseString(object.employerName, "Employer Name"),
      };
      if (object.startDate && object.endDate){
        newEntry.sickLeave = parseSickLeave({
          startDate: object.startDate as string,
          endDate: object.endDate as string,
        });
      }
      return newEntry;
    default:
      return assertNever(newBaseEntry);
  }
};

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const parseSickLeave = (object: any): SickLeave => {
  if (!object) throw new Error("Missing sick leave");

  return {
    startDate: parseDate(object.startDate),
    endDate: parseDate(object.endDate),
  };
};
