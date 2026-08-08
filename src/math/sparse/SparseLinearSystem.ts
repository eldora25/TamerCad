import { SparseMatrix } from "./SparseMatrix";
import { SparseVector } from "./SparseVector";

export class SparseLinearSystem {

    readonly A: SparseMatrix;

    readonly b: SparseVector;

    constructor(
        A: SparseMatrix,
        b: SparseVector
    ) {

        if (A.rows !== b.size) {

            throw new Error(
                "Sparse system dimension mismatch"
            );

        }

        this.A = A;
        this.b = b;

    }

    dimension(): number {

        return this.A.rows;

    }

    validate(): boolean {

        return this.A.rows === this.b.size;

    }

    clone(): SparseLinearSystem {

        return new SparseLinearSystem(
            this.A,
            this.b
        );

    }

    residual(
        x: SparseVector
    ): number {

        const Ax = this.A.multiply(
            x.toDense()
        );

        const denseB = this.b.toDense();

        let sum = 0;

        for (let i = 0; i < Ax.size; i++) {

            const r =
                Ax.get(i) -
                denseB.get(i);

            sum += r * r;

        }

        return Math.sqrt(sum);

    }

    nonZeroCount(): number {

        return this.A.nonZeroCount();

    }

    density(): number {

        return this.A.density();

    }

    serialize() {

        return {

            matrix: this.A.serialize(),

            vector: this.b.serialize()

        };

    }

    info() {

        return {

            engine: "SparseLinearSystem",

            rows: this.A.rows,

            cols: this.A.cols,

            nonZeros: this.nonZeroCount(),

            density: this.density()

        };

    }

}