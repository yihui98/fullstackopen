import express from 'express';
import {calculateBmi} from './bmiCalculator';
import {calculateExercises} from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  if (Object.keys(req.query).length !== 2){
    console.log(req.query, "REQ");
    res.send("error: malformatted parameters");
  } else{
    if (!isNaN(Number(req.query.height)) && !isNaN(Number(req.query.weight))) {
    const height = Number(req.query.height);
        const weight = Number(req.query.weight);
    const result = calculateBmi(height, weight);
    res.send(result);
  }}
});

app.post('/exercises', (req, res) => {
  if (Object.keys(req.body).length !== 2){
    res.send("error: parameters missing");
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target} = req.body;
  const result = calculateExercises(daily_exercises, target);
  res.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});