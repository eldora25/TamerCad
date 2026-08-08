export interface NumericalVariable {

    id: string;

    value: number;

}

export interface NumericalConstraint {

    id: string;

    evaluate(): number;

    gradient(): number[];

}

export interface NumericalSolveResult {

    converged: boolean;

    iterations: number;

    residual: number;

}

export abstract class SketchNumericalSolver {

    protected variables: NumericalVariable[] = [];

    protected constraints: NumericalConstraint[] = [];

    tolerance = 1e-8;

    maxIterations = 50;

    addVariable(variable: NumericalVariable): void {
        this.variables.push(variable);
    }

    addConstraint(constraint: NumericalConstraint): void {
        this.constraints.push(constraint);
    }

    clear(): void {
        this.variables = [];
        this.constraints = [];
    }

    abstract solve(): NumericalSolveResult;

    protected computeResidual(): number {

        let sum = 0;

        for (const constraint of this.constraints) {

            const r = constraint.evaluate();

            sum += r * r;

        }

        return Math.sqrt(sum);

    }

    protected hasConverged(): boolean {

        return this.computeResidual() < this.tolerance;

    }

    info() {

        return {

            engine: "SketchNumericalSolver",

            variables: this.variables.length,

            constraints: this.constraints.length,

            tolerance: this.tolerance,

            maxIterations: this.maxIterations

        };

    }

}