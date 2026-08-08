import { OptimizationProblem }
from "../../math/optimization/OptimizationProblem";

import { OptimizationSolver }
from "../../math/optimization/OptimizationSolver";


import { FEMResponseEvaluator }
from "./FEMResponseEvaluator";

import { FEMConstraintEvaluator }
from "./FEMConstraintEvaluator";

import { FEMObjectiveFunction }
from "./FEMObjectiveFunction";


export interface FEMOptimizationConfig {


    maxIterations:number;


    tolerance:number;


}



export interface FEMOptimizationResult {


    converged:boolean;


    iterations:number;


    objective:number;


    parameters:number[];

}



export abstract class FEMOptimizationManager {



    protected config:
    FEMOptimizationConfig;


    protected problem:
    OptimizationProblem;



    protected responseEvaluator:
    FEMResponseEvaluator;


    protected constraintEvaluator:
    FEMConstraintEvaluator;


    protected objectiveFunction:
    FEMObjectiveFunction;



    constructor(

        config:FEMOptimizationConfig,

        problem:OptimizationProblem,

        responseEvaluator:FEMResponseEvaluator,

        constraintEvaluator:FEMConstraintEvaluator,

        objectiveFunction:FEMObjectiveFunction

    ){


        this.config=config;

        this.problem=problem;

        this.responseEvaluator=
            responseEvaluator;

        this.constraintEvaluator=
            constraintEvaluator;

        this.objectiveFunction=
            objectiveFunction;

    }




    optimize():

    FEMOptimizationResult {



        this.prepareProblem();



        const optimizer=

        this.createOptimizer();



        const result=

        OptimizationSolver.solve(

            this.problem,

            optimizer

        );



        this.applyResult(
            result
        );



        return {


            converged:

            result.converged,


            iterations:

            result.iterations,


            objective:

            result.objective,


            parameters:

            result.parameters


        };


    }




    protected abstract

    prepareProblem():

    void;



    protected abstract

    createOptimizer():

    any;



    protected abstract

    applyResult(

        result:any

    ):

    void;



    info(){


        return {


            engine:

            "FEMOptimizationManager",


            maxIterations:

            this.config.maxIterations

        };


    }


}