import { Optimizer } from "./Optimizer";


export interface GeometryOptimizationResult {

    converged:boolean;

    iterations:number;

    objective:number;

    parameters:number[];

}


export abstract class GeometryOptimizer {


    protected optimizer?:Optimizer;


    protected parameters:number[]=[];



    setOptimizer(
        optimizer:Optimizer
    ):void{

        this.optimizer=optimizer;

    }



    optimize():

    GeometryOptimizationResult {


        if(!this.optimizer){

            throw new Error(
                "Optimizer not assigned"
            );

        }


        const result=

        this.optimizer.optimize();



        return {

            converged:
                result.converged,

            iterations:
                result.iterations,

            objective:
                result.objective,

            parameters:
                this.parameters

        };

    }



    protected abstract

    evaluateGeometry():

    void;



    protected abstract

    objectiveFunction():

    number;



    protected abstract

    constraints():

    boolean;



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



    info(){

        return {

            engine:
            "GeometryOptimizer"

        };

    }


}