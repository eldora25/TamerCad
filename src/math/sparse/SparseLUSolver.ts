import { SparseLinearSystem } from "./SparseLinearSystem";
import { SparseVector } from "./SparseVector";

export class SparseLUSolver {

    solve(

        system: SparseLinearSystem

    ): SparseVector {

        this.symbolicFactorization(system);

        this.numericFactorization(system);

        const y = this.forwardSolve(system);

        return this.backwardSolve(system, y);

    }

    protected symbolicFactorization(

        system: SparseLinearSystem

    ): void {

        /*
            Placeholder

            Future

            Elimination Tree

            Fill Reduction

            AMD

            METIS

        */

    }

    protected numericFactorization(

        system: SparseLinearSystem

    ): void {

        /*
            Placeholder

            Sparse LU

        */

    }

    protected forwardSolve(

        system: SparseLinearSystem

    ): SparseVector {

        return new SparseVector(

            system.dimension()

        );

    }

    protected backwardSolve(

        system: SparseLinearSystem,

        y: SparseVector

    ): SparseVector {

        return y;

    }

    residual(

        system: SparseLinearSystem,

        x: SparseVector

    ): number {

        return system.residual(x);

    }

    info() {

        return {

            engine: "SparseLUSolver",

            direct: true,

            sparse: true

        };

    }

}