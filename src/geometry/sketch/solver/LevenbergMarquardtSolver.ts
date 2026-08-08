import {
    SketchNumericalSolver,
    NumericalSolveResult
} from "./SketchNumericalSolver";

export class LevenbergMarquardtSolver
extends SketchNumericalSolver{

    lambda:number = 1e-3;

    lambdaIncrease:number = 10.0;

    lambdaDecrease:number = 0.1;

    solve():NumericalSolveResult{

        let iteration=0;

        let residual=this.computeResidual();

        while(

            iteration<this.maxIterations &&

            residual>this.tolerance

        ){

            const previousResidual=residual;

            this.performIteration();

            residual=this.computeResidual();

            if(residual<previousResidual){

                this.lambda*=this.lambdaDecrease;

            }else{

                this.lambda*=this.lambdaIncrease;

            }

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

        const delta=this.solveDampedSystem();

        for(

            let i=0;

            i<this.variables.length;

            i++

        ){

            this.variables[i].value+=delta[i];

        }

    }

    protected solveDampedSystem():number[]{

        /*
            Placeholder

            Future implementation

            (JᵀJ + λI)

            QR / Cholesky / Sparse

        */

        return new Array(

            this.variables.length

        ).fill(0);

    }

    info(){

        return{

            engine:"LevenbergMarquardtSolver",

            variables:this.variables.length,

            constraints:this.constraints.length,

            lambda:this.lambda,

            tolerance:this.tolerance,

            maxIterations:this.maxIterations

        };

    }

}