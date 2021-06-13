interface result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

interface valuesExercise{
    week: Array<number>,
    target: number
}

const parseArgumentsExercise = (args: Array<string>): valuesExercise => {
    if (args.length < 4) throw new Error('Not enough arguments');

    const week = [];
    let target = 0;
    if (!isNaN(Number(args[2]))){
        target = Number(args[2]);
    }  else {
        throw new Error('Provided values were not numbers!');
    }
    
    if (args.length >=4){
        let i;
        for (i = 3; i < args.length; i++){
            if (!isNaN(Number(args[i]))){
                week.push(Number(args[i]));
            } else {
                throw new Error('Provided values were not numbers!');
            }
        }
    }
    else {
        throw new Error('Provided values were not numbers!');
    }
    console.log("week", week);
    return({
        week : week,
        target: target
    });
};


export const calculateExercises = (week: Array<number>, target: number): result =>{
    let numDays = 0;
    let numTrainingDays = 0;
    let numHours = 0;

    week.forEach(day =>{
        numDays += 1;
        if (day !== 0){
            numTrainingDays += 1;
            numHours += day;
        }
    });

    const calculatedAverage = numHours / numDays;
    let success = false;
    let ratingDescription = "";
    let rating = 0;
    if (calculatedAverage < target){
        rating = 1;
        ratingDescription = "You did not hit the target";
    } else if (calculatedAverage < 2 * target){
        rating = 2;
        ratingDescription = "not too bad but could be better";
        success = true;
    } else{
        rating = 3;
        ratingDescription = "Good job, target exceeded";
        success = true;
    }

    return({
        periodLength: numDays,
        trainingDays: numTrainingDays,
        success: success,
        rating: rating,
        ratingDescription: ratingDescription,
        target: target,
        average: calculatedAverage
    });

};

try {
    const{week, target} = parseArgumentsExercise(process.argv);
    console.log(calculateExercises(week, target));
} catch (e){
    if (e instanceof Error){
    console.log("Something went wrong, error message: ", e.message);
    }
}