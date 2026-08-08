import { SparseVector } from "../sparse/SparseVector";
import { Preconditioner } from "./Preconditioner";

export class SSORPreconditioner
extends Preconditioner {

    relaxation = 1.0;

    protected onBuild(): void {

        /*
            Placeholder

            Future

            Extract D

            Extract L

            Extract U

        */

    }

    apply(
        vector: SparseVector
    ): SparseVector {

        const y =
            this.forwardSweep(vector);

        return this.backwardSweep(y);

    }

    protected forwardSweep(
        vector: SparseVector
    ): SparseVector {

        /*
            Placeholder

        */

        return vector;

    }

    protected backwardSweep(
        vector: SparseVector
    ): SparseVector {

        /*
            Placeholder

        */

        return vector;

    }

    info() {

        return {

            engine: "SSORPreconditioner",

            omega: this.relaxation,

            initialized:
                this.isInitialized()

        };

    }

}