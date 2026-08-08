import { LevenbergMarquardtOptimizer } 
from "./LevenbergMarquardtOptimizer";


export interface ConstraintResult {

    satisfied:boolean;

    residual:number;

    iterations:number;

}


export abstract class ConstraintOptimizer {


    protected optimizer:
    LevenbergMarquardtOptimizer;


    protected parameters:number[]=[];


    constructor(

        optimizer:
        LevenbergMarquardtOptimizer

    ){

        this.optimizer=optimizer;

    }



    solve():

    ConstraintResult {


        const result=

        this.optimizer.optimize();



        return {

            satisfied:

            this.residualNorm()

            <

            this.optimizer.tolerance,


            residual:

            this.residualNorm(),


            iterations:

            result.iterations

        };

    }



    setParameters(

        parameters:number[]

    ):void{


        this.parameters=

        [...parameters];

    }



    getParameters():

    number[]{


        return [

            ...this.parameters

        ];

    }



    protected abstract

    evaluateResiduals():

    number[];



    protected abstract

    computeJacobian():

    number[][];



    protected abstract

    residualNorm():

    number;



    info(){

        return {

            engine:
            "ConstraintOptimizer"

        };

    }


}