import { OptimizationProblem }
from "../../math/optimization/OptimizationProblem";

import { OptimizationSolver }
from "../../math/optimization/OptimizationSolver";


export interface FEMOptimizationResult {

    objective:number;

    constraints:number[];

    displacement:number[];

    stress:number[];

}


export abstract class FEMOptimizationBridge {


    protected problem:
    OptimizationProblem;



    constructor(

        problem:OptimizationProblem

    ){

        this.problem=problem;

    }



    solve():

    FEMOptimizationResult {


        this.updateGeometry();



        this.rebuildMesh();



        const femResult =

        this.solveFEM();



        const objective =

        this.evaluateObjective(
            femResult
        );



        const constraints =

        this.evaluateConstraints(
            femResult
        );


        return {

            objective,

            constraints,

            displacement:
                femResult.displacement,

            stress:
                femResult.stress

        };

    }



    optimize(){

        return

        OptimizationSolver.solve(

            this.problem,

            this.createOptimizer()

        );

    }



    protected abstract

    updateGeometry():

    void;



    protected abstract

    rebuildMesh():

    void;



    protected abstract

    solveFEM():

    {

        displacement:number[];

        stress:number[];

    };



    protected abstract

    evaluateObjective(

        result:any

    ):

    number;



    protected abstract

    evaluateConstraints(

        result:any

    ):

    number[];



    protected abstract

    createOptimizer():

    any;



    info(){

        return {

            engine:

            "FEMOptimizationBridge"

        };

    }

}