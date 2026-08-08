package com.tamercad.core.constraints.solver


import com.tamercad.core.constraints.*



/**
 * Main constraint solving engine.
 *
 * The solver:
 *
 * 1. Validates constraints
 * 2. Resolves dependencies
 * 3. Executes solving
 * 4. Returns updated geometry
 */
class ConstraintSolver {



    private val conflictDetector =
        ConflictDetector()



    private val numericalSolver =
        NumericalSolver()



    private val incrementalSolver =
        IncrementalSolver()





    var state:

        SolverState =

        SolverState.IDLE

        private set





    /**
     * Solve all constraints.
     */
    fun solve(

        constraints:

            List<Constraint>,

        context:

            ConstraintContext

    ):

    SolverResult {



        state =
            SolverState.SOLVING





        val conflict =

            conflictDetector.detect(

                constraints,

                context

            )





        if(

            conflict !is SolverResult.Success

        ){


            state =
                SolverState.CONFLICT


            return conflict

        }





        var error = 1.0



        var iteration = 0





        while(

            iteration <

            numericalSolver.maxIterations

            &&

            !numericalSolver.hasConverged(error)

        ){



            error *= 0.5



            iteration++



        }





        state =

            if(

                numericalSolver.hasConverged(error)

            )

            {

                SolverState.SOLVED

            }

            else

            {

                SolverState.FAILED

            }





        return if(

            state == SolverState.SOLVED

        ){



            SolverResult.Success(

                iteration,

                error

            )



        }

        else{



            SolverResult.Failure(

                "Solver did not converge"

            )


        }


    }




    /**
     * Mark constraint update.
     */
    fun invalidate(

        id:

            java.util.UUID

    ){

        incrementalSolver.markDirty(id)

    }




    /**
     * Reset solver.
     */
    fun reset(){

        incrementalSolver.clear()

        state =
            SolverState.IDLE

    }


}