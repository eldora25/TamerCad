package com.tamercad.core.constraints.solver


/**
 * Base numerical solving utilities.
 *
 * Future versions may replace this
 * with C++ optimized solver.
 */
class NumericalSolver {



    /**
     * Maximum solving iterations.
     */
    var maxIterations = 50




    /**
     * Minimum acceptable error.
     */
    var tolerance = 0.00001





    /**
     * Checks convergence.
     */
    fun hasConverged(

        error:

            Double

    ):

    Boolean {



        return error <= tolerance

    }





    /**
     * Clamp numerical values.
     */
    fun stabilize(

        value:

            Double

    ):

    Double {



        return when{


            value.isNaN() -> 0.0


            value.isInfinite() -> 0.0


            else -> value


        }


    }


}