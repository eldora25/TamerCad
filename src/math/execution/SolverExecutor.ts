import { LinearSystem } from "../linear/LinearSystem";
import { SparseLinearSystem } from "../sparse/SparseLinearSystem";

import { SolverAnalyzer } from "../solver/SolverAnalyzer";
import { SolverFactory } from "../solver/SolverFactory";

import { SolverProfiler } from "../performance/SolverProfiler";

export interface SolverExecutionResult {

    analysis: unknown;

    profile: unknown;

    solution: unknown;

}

export class SolverExecutor {

    static solve(

        system:

        LinearSystem |

        SparseLinearSystem

    ): SolverExecutionResult {

        const analysis =

            SolverAnalyzer.analyze(system);

        const configuration =

            SolverFactory.create(system);

        const profiler =

            new SolverProfiler();

        profiler.start();

        let solution: unknown = null;

        if (

            "solver" in (configuration as object)

        ) {

            const config = configuration as {

                solver: {

                    solve(system: SparseLinearSystem): unknown;

                };

                preconditioner?: {

                    build(matrix: unknown): void;

                };

            };

            if (

                config.preconditioner

            ) {

                config.preconditioner.build(system);

            }

            solution =

                config.solver.solve(

                    system as SparseLinearSystem

                );

        } else {

            const solver = configuration as {

                solve(system: LinearSystem): unknown;

            };

            solution =

                solver.solve(

                    system as LinearSystem

                );

        }

        profiler.stop();

        return {

            analysis,

            profile:

                profiler.buildReport(),

            solution

        };

    }

}