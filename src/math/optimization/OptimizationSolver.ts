import { OptimizationProblem }
from "./OptimizationProblem";

import { Optimizer }
from "./Optimizer";


import { SolverProfiler }
from "../performance/SolverProfiler";


export interface OptimizationResult {

    converged:boolean;

    iterations:number;

    objective:number;

    parameters:number[];

    profile:any;

}



export class OptimizationSolver {


    private constructor(){}



    static solve(

        problem:OptimizationProblem,

        optimizer:Optimizer

    ):OptimizationResult {


        const profiler =

        new SolverProfiler();



        profiler.start();



        const result =

        optimizer.optimize();



        profiler.stop();



        const parameters =

        this.extractParameters(
            optimizer
        );



        return {

            converged:

                result.converged,


            iterations:

                result.iterations,


            objective:

                problem.evaluate(
                    parameters
                ),


            parameters,


            profile:

                profiler.buildReport()

        };

    }



    private static extractParameters(

        optimizer:Optimizer

    ):number[]{


        const object =
        optimizer as any;


        if(
            object.getParameters
        ){

            return object.getParameters();

        }


        return [];

    }



    static info(){

        return {

            engine:

            "OptimizationSolver"

        };

    }

}