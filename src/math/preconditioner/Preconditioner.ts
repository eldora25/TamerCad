import { SparseMatrix } from "../sparse/SparseMatrix";
import { SparseVector } from "../sparse/SparseVector";

export abstract class Preconditioner {

    protected matrix?: SparseMatrix;

    protected initialized = false;

    build(matrix: SparseMatrix): void {

        this.matrix = matrix;

        this.initialized = true;

        this.onBuild();

    }

    protected abstract onBuild(): void;

    abstract apply(
        vector: SparseVector
    ): SparseVector;

    update(): void {

        if (!this.initialized) {

            return;

        }

        this.onUpdate();

    }

    protected onUpdate(): void {
        // optional override
    }

    reset(): void {

        this.matrix = undefined;

        this.initialized = false;

    }

    isInitialized(): boolean {

        return this.initialized;

    }

    abstract info(): {

        engine: string;

        [key: string]: unknown;

    };

}