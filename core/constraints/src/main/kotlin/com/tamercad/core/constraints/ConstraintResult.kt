package com.tamercad.core.constraints



/**
 * Result returned by solver.
 */
sealed class ConstraintResult {



    /**
     * Constraint solved successfully.
     */
    data object Solved :
        ConstraintResult()



    /**
     * Constraint failed.
     */
    data class Failed(

        val message:String

    ):
        ConstraintResult()



    /**
     * Constraint requires another iteration.
     */
    data object Pending :
        ConstraintResult()

}