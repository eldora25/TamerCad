import { Matrix } from "../core/Matrix";
import { Vector } from "../core/Vector";
import { LinearSystem } from "./LinearSystem";

export class SVDSolver {

    tolerance = 1e-10;

    solve(system: LinearSystem): Vector {

        const {
            U,
            S,
            V
        } = this.factorize(system.A);

        const pinv = this.computePseudoInverse(
            U,
            S,
            V
        );

        return this.multiply(
            pinv,
            system.b
        );

    }

    protected factorize(A: Matrix): {

        U: Matrix;

        S: Vector;

        V: Matrix;

    } {

        /*
            Placeholder

            Future

            Golub-Reinsch

            Jacobi SVD

            Divide & Conquer

        */

        return {

            U: Matrix.identity(A.rows),

            S: Vector.zeros(
                Math.min(
                    A.rows,
                    A.cols
                )
            ),

            V: Matrix.identity(A.cols)

        };

    }

    protected computePseudoInverse(

        U: Matrix,

        S: Vector,

        V: Matrix

    ): Matrix {

        /*
            Placeholder

            Future

            V Σ⁻¹ Uᵀ

        */

        return Matrix.identity(
            V.rows
        );

    }

    protected multiply(

        A: Matrix,

        b: Vector

    ): Vector {

        const x = Vector.zeros(A.rows);

        for (let i = 0; i < A.rows; i++) {

            let value = 0;

            for (let j = 0; j < A.cols; j++) {

                value +=
                    A.get(i, j) *
                    b.get(j);

            }

            x.set(i, value);

        }

        return x;

    }

    rank(S: Vector): number {

        let r = 0;

        for (let i = 0; i < S.size; i++) {

            if (
                Math.abs(S.get(i)) >
                this.tolerance
            ) {

                r++;

            }

        }

        return r;

    }

    conditionNumber(S: Vector): number {

        let max = 0;
        let min = Number.MAX_VALUE;

        for (let i = 0; i < S.size; i++) {

            const s = Math.abs(S.get(i));

            if (s > max) max = s;

            if (
                s > this.tolerance &&
                s < min
            ) {

                min = s;

            }

        }

        return max / min;

    }

    residual(
        system: LinearSystem,
        x: Vector
    ): number {

        return system.residual(x);

    }

    info() {

        return {

            engine: "SVDSolver",

            tolerance: this.tolerance

        };

    }

}