import { SparseLinearSystem } from "../sparse/SparseLinearSystem";
import { SparseVector } from "../sparse/SparseVector";

export interface GMRESResult {

    converged: boolean;

    iterations: number;

    residual: number;

}

export class GMRESSolver {

    tolerance = 1e-8;

    maxIterations = 1000;

    restart = 50;

    solve(
        system: SparseLinearSystem
    ): GMRESResult {

        const x = new SparseVector(
            system.dimension()
        );

        let residual =
            system.residual(x);

        let iteration = 0;

        while (
            iteration < this.maxIterations &&
            residual > this.tolerance
        ) {

            this.performRestartCycle();

            residual =
                system.residual(x);

            iteration++;

        }

        return {

            converged:
                residual <= this.tolerance,

            iterations: iteration,

            residual

        };

    }

    protected performRestartCycle(): void {

        /*
            Placeholder

            Future

            Arnoldi

            Hessenberg

            Givens Rotations

            Least Squares

        */

    }

    info() {

        return {

            engine: "GMRESSolver",

            tolerance: this.tolerance,

            restart: this.restart,

            maxIterations: this.maxIterations

        };

    }

}