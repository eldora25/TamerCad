import { SparseVector } from "../sparse/SparseVector";
import { Preconditioner } from "./Preconditioner";

export class ICPreconditioner
extends Preconditioner {

    private factorized = false;

    protected onBuild(): void {

        if (!this.matrix) {

            return;

        }

        this.validateSPD();

        this.symbolicFactorization();

        this.numericFactorization();

        this.factorized = true;

    }

    protected validateSPD(): void {

        /*
            Placeholder

            Future

            Symmetry check

            Positive diagonal

        */

    }

    protected symbolicFactorization(): void {

        /*
            Placeholder

            Future

            Sparsity pattern

        */

    }

    protected numericFactorization(): void {

        /*
            Placeholder

            Future

            IC(0)

            ICT

        */

    }

    apply(
        vector: SparseVector
    ): SparseVector {

        if (!this.factorized) {

            return vector;

        }

        const y =
            this.forwardSolve(vector);

        return this.backwardSolve(y);

    }

    protected forwardSolve(
        vector: SparseVector
    ): SparseVector {

        return vector;

    }

    protected backwardSolve(
        vector: SparseVector
    ): SparseVector {

        return vector;

    }

    info() {

        return {

            engine: "ICPreconditioner",

            initialized:
                this.isInitialized(),

            factorized:
                this.factorized

        };

    }

}