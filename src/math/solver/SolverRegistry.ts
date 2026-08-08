export interface SolverDescriptor {

    id: string;

    category: "direct" | "iterative";

    create(): unknown;

}

export interface PreconditionerDescriptor {

    id: string;

    create(): unknown;

}

export class SolverRegistry {

    private static solvers =
        new Map<string, SolverDescriptor>();

    private static preconditioners =
        new Map<string, PreconditionerDescriptor>();

    static registerSolver(
        descriptor: SolverDescriptor
    ): void {

        this.solvers.set(
            descriptor.id,
            descriptor
        );

    }

    static registerPreconditioner(
        descriptor: PreconditionerDescriptor
    ): void {

        this.preconditioners.set(
            descriptor.id,
            descriptor
        );

    }

    static getSolver(
        id: string
    ): SolverDescriptor | undefined {

        return this.solvers.get(id);

    }

    static getPreconditioner(
        id: string
    ): PreconditionerDescriptor | undefined {

        return this.preconditioners.get(id);

    }

    static listSolvers(): string[] {

        return [...this.solvers.keys()];

    }

    static listPreconditioners(): string[] {

        return [...this.preconditioners.keys()];

    }

    static clear(): void {

        this.solvers.clear();

        this.preconditioners.clear();

    }

    static info() {

        return {

            engine: "SolverRegistry",

            solvers:
                this.solvers.size,

            preconditioners:
                this.preconditioners.size

        };

    }

}