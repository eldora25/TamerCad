export interface SolverProfile {

    elapsedMilliseconds: number;

    iterations: number;

    finalResidual: number;

    residualHistory: number[];

}

export class SolverProfiler {

    private startTime = 0;

    private endTime = 0;

    private iterations = 0;

    private residualHistory: number[] = [];

    start(): void {

        this.startTime = performance.now();

        this.endTime = 0;

        this.iterations = 0;

        this.residualHistory = [];

    }

    stop(): void {

        this.endTime = performance.now();

    }

    recordIteration(
        residual: number
    ): void {

        this.iterations++;

        this.residualHistory.push(
            residual
        );

    }

    buildReport(): SolverProfile {

        return {

            elapsedMilliseconds:
                this.endTime - this.startTime,

            iterations:
                this.iterations,

            finalResidual:
                this.residualHistory.length > 0
                    ? this.residualHistory[this.residualHistory.length - 1]
                    : 0,

            residualHistory:
                [...this.residualHistory]

        };

    }

    reset(): void {

        this.startTime = 0;

        this.endTime = 0;

        this.iterations = 0;

        this.residualHistory = [];

    }

}