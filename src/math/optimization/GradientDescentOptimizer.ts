import { Optimizer } from "./Optimizer";

export abstract class GradientDescentOptimizer
extends Optimizer {

    learningRate = 0.01;

    protected parameters: number[] = [];

    protected initialize(): void {

        this.parameters = this.initialParameters();

    }

    protected iterate(): void {

        const gradient =
            this.computeGradient();

        for (
            let i = 0;
            i < this.parameters.length;
            i++
        ) {

            this.parameters[i] -=
                this.learningRate *
                gradient[i];

        }

    }

    protected stopCriterion(): boolean {

        return this.gradientNorm() <
            this.tolerance;

    }

    protected objective(): number {

        return this.evaluateObjective();

    }

    protected abstract initialParameters(): number[];

    protected abstract computeGradient(): number[];

    protected abstract evaluateObjective(): number;

    protected abstract gradientNorm(): number;

    getParameters(): number[] {

        return [...this.parameters];

    }

    info() {

        return {

            engine:
                "GradientDescentOptimizer",

            learningRate:
                this.learningRate,

            tolerance:
                this.tolerance

        };

    }

}