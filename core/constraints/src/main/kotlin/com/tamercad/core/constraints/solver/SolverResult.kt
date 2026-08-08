package com.tamercad.core.constraints.solver



/**
 * Result returned by solver.
 */
sealed class SolverResult {



    /**
     * Successful solve.
     */
    data class Success(

        val iterations:

            Int,


        val error:

            Double


    ):
        SolverResult()





    /**
     * Failed solve.
     */
    data class Failure(

        val reason:

            String


    ):
        SolverResult()





    /**
     * Over constrained sketch.
     */
    data class Conflict(

        val constraints:

            List<String>


    ):
        SolverResult()


}