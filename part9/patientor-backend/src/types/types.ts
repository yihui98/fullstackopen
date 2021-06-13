export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export interface diagnosesEntry {
  code: string;
  name: string;
  latin?: string;
}

export interface patientsEntry {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string
  }

export interface nonSensitivePatientsEntry {
    id: string;
    name: string;
    dateOfBirth: string;
    gender: Gender;
    occupation: string
  }

export type NewPatientEntry = Omit<patientsEntry, 'id'>;

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[]
}

export type PublicPatient = Omit<Patient, 'ssn' | 'entries' >;

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export enum EntryType {
  HealthCheck = "HealthCheck",
  OccupationalHealthcare = "OccupationalHealthcare",
  Hospital = "Hospital",
}


/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export type NewEntry = DistributiveOmit<Entry, "id">;
export type newBaseEntry = DistributiveOmit<BaseEntry, "id">;

interface BaseEntry {
  id: string;
  type: EntryType;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<diagnosesEntry['code']>;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

export interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

export interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital;
  discharge: {
    date: string,
    criteria: string,
  };
}

export interface OccupationalHealthcareEntry extends BaseEntry{
  type: EntryType.OccupationalHealthcare;
  employerName: string;
  sickLeave?: SickLeave;
}

export interface SickLeave {
  startDate: string;
  endDate: string;
}
