package com.tamercad.core.constraints.solver



/**
 * Represents one solver iteration.
 *
 * Constraint systems are solved
 * through repeated refinement.
 */
data class SolverIteration(


    val iteration:

        Int,



    val error:

        Double,



    val solved:

        Boolean



)