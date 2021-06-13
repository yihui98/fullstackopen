interface values{
    height: number,
    weight: number
}

interface bmiResults{
    weight: number,
    height: number;
    bmi: string
}


const parseArguments = (args: Array<string>): values => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');

    
  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }

};


export const calculateBmi = (height: number, weight: number): bmiResults =>{
    const bmi = weight/(Math.pow(height/100,2));
    if (isNaN(Number(bmi))){
        throw new Error ('INVALID weight/height given');
    }
    if (bmi < 25){
        return ({
            height: height,
            weight: weight,
            bmi: "Normal (healthy weight)" });
    } else if (bmi < 30){
        return ({
            height: height,
            weight: weight,
            bmi: "Overweight" });
    } else {
        return ({
            height: height,
            weight: weight,
            bmi: "Obese" });
    }
};

try {
    const {height, weight} = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
} catch (e){
    if (e instanceof Error){
    console.log("Something went wrong, error message: ", e.message);
    }
}