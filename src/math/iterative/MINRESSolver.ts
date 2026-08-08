import { SparseLinearSystem } from "../sparse/SparseLinearSystem";
import { SparseVector } from "../sparse/SparseVector";

export interface MINRESResult {

    converged: boolean;

    iterations: number;

    residual: number;

}

export class MINRESSolver {

    tolerance = 1e-8;

    maxIterations = 1000;

    solve(
        system: SparseLinearSystem
    ): MINRESResult {

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

            this.performIteration();

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

    protected performIteration(): void {

        /*
            Placeholder

            Future

            Lanczos

            Givens Rotation

            Residual Update

        */

    }

    info() {

        return {

            engine: "MINRESSolver",

            tolerance: this.tolerance,

            maxIterations: this.maxIterations

        };

    }

}