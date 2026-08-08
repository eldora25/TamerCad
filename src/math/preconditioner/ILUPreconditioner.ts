import { SparseVector } from "../sparse/SparseVector";
import { Preconditioner } from "./Preconditioner";

export class ILUPreconditioner
extends Preconditioner {

    private factorized = false;

    protected onBuild(): void {

        if (!this.matrix) {

            return;

        }

        this.symbolicFactorization();

        this.numericFactorization();

        this.factorized = true;

    }

    protected symbolicFactorization(): void {

        /*
            Placeholder

            Future

            Elimination graph

            Pattern analysis

        */

    }

    protected numericFactorization(): void {

        /*
            Placeholder

            Future

            ILU(0)

            ILUT

            ILUC

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

        /*
            Placeholder

        */

        return vector;

    }

    protected backwardSolve(
        vector: SparseVector
    ): SparseVector {

        /*
            Placeholder

        */

        return vector;

    }

    info() {

        return {

            engine: "ILUPreconditioner",

            initialized:
                this.isInitialized(),

            factorized:
                this.factorized

        };

    }

}