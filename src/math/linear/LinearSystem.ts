import { Matrix } from "../core/Matrix";
import { Vector } from "../core/Vector";

export class LinearSystem {

    readonly A: Matrix;

    readonly b: Vector;

    constructor(A: Matrix, b: Vector) {

        if (A.rows !== b.size) {

            throw new Error(
                "Linear system dimension mismatch"
            );

        }

        this.A = A;
        this.b = b;

    }

    dimension(): number {

        return this.A.rows;

    }

    clone(): LinearSystem {

        return new LinearSystem(

            this.A.clone(),

            this.b.clone()

        );

    }

    residual(x: Vector): number {

        if (x.size !== this.A.cols) {

            throw new Error(
                "Solution vector dimension mismatch"
            );

        }

        let sum = 0;

        for (let i = 0; i < this.A.rows; i++) {

            let value = 0;

            for (let j = 0; j < this.A.cols; j++) {

                value +=

                    this.A.get(i, j) *

                    x.get(j);

            }

            const r = value - this.b.get(i);

            sum += r * r;

        }

        return Math.sqrt(sum);

    }

    validate(): boolean {

        return this.A.rows === this.b.size;

    }

    serialize() {

        return {

            matrix: this.A.serialize(),

            vector: this.b.serialize()

        };

    }

    info() {

        return {

            engine: "LinearSystem",

            rows: this.A.rows,

            cols: this.A.cols

        };

    }

}