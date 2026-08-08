export interface SensitivityResult {

    objectiveGradient:number[];

    constraintGradients:number[][];

}



export abstract class SensitivityAnalyzer {


    protected variables:number[]=[];



    setVariables(

        variables:number[]

    ):void {


        this.variables =

        [...variables];

    }



    analyze():

    SensitivityResult {


        return {

            objectiveGradient:

            this.computeObjectiveGradient(),


            constraintGradients:

            this.computeConstraintGradients()

        };

    }



    protected abstract

    computeObjectiveGradient():

    number[];



    protected abstract

    computeConstraintGradients():

    number[][];



    protected abstract

    evaluateResponse():

    number;



    getVariables():

    number[]{


        return [

            ...this.variables

        ];

    }



    info(){

        return {

            engine:

            "SensitivityAnalyzer"

        };

    }

}