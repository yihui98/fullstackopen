import express from 'express';
import patientsService from '../services/patientsService';
import toNewPatientEntry, { toNewEntry } from '../utils/utils';


const router = express.Router();

router.get('/', (_req, res) => {
  //res.send('Fetching all diagnoses!');
  res.send(patientsService.getEntries());
});

router.get('/:id', (req, res) => {
    const patient = patientsService.findByID(req.params.id);
    if (patient){
        res.send(patient);
    }else{
        res.sendStatus(404);
    }
  });

router.get('/:id/entries', (req, res) => {
    const patient = patientsService.findByID(req.params.id);
    if (patient){
        res.send(patient.entries);
    }else{
        res.sendStatus(404);
    }
  });

router.post('/:id/entries', (req, res) => {
    const patient = patientsService.findByID(req.params.id);

    if (patient){
        try{
            const newEntry = toNewEntry(req.body);
            const addedEntry = patientsService.addEntry(patient, newEntry);
            res.json(addedEntry);
        } catch(e){
            res.status(400).send(e.message);
        }
    } else {
        res.status(404).send({ error: "Sorry, this patient does not exist" });
    }

  });

router.post('/', (req, res) => {
    try{
        const newPatientEntry = toNewPatientEntry(req.body);
        const addedEntry = patientsService.addPatient(newPatientEntry);
        res.json(addedEntry);
    } catch(e){
        res.status(400).send(e.message);
    }
});

export default router;