import {
    SketchNumericalSolver,
    NumericalSolveResult
} from "./SketchNumericalSolver";

export class GaussNewtonSolver
extends SketchNumericalSolver{

    damping:number=1.0;

    solve():NumericalSolveResult{

        let iteration=0;

        let residual=this.computeResidual();

        while(

            iteration<this.maxIterations &&

            residual>this.tolerance

        ){

            this.performIteration();

            residual=this.computeResidual();

            iteration++;

        }

        return{

            converged:

                residual<=this.tolerance,

            iterations:iteration,

            residual

        };

    }

    protected performIteration():void{

        const delta=this.solveLeastSquares();

        for(

            let i=0;

            i<this.variables.length;

            i++

        ){

            this.variables[i].value+=

                delta[i]*this.damping;

        }

    }

    protected solveLeastSquares():number[]{

        /*
            Placeholder

            Future implementation

            JᵀJ

            JᵀF

            QR

            Cholesky

            Sparse Solver

        */

        return new Array(

            this.variables.length

        ).fill(0);

    }

    info(){

        return{

            engine:

                "GaussNewtonSolver",

            variables:

                this.variables.length,

            constraints:

                this.constraints.length,

            damping:

                this.damping,

            tolerance:

                this.tolerance

        };

    }

}