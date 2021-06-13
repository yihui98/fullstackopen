import { diagnosesEntry }  from '../types/types';
import diagnosesData from '../data/diagnoses.json';


const diagnoses: Array<diagnosesEntry> = diagnosesData;

const getEntries = (): Array<diagnosesEntry> => {
  return diagnoses;
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry
};