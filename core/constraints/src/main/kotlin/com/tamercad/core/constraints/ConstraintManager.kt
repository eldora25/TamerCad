package com.tamercad.core.constraints


import java.util.UUID



/**
 * High level constraint management service.
 *
 * Coordinates:
 *
 * - Registry
 * - Solver
 * - Diagnostics
 */
class ConstraintManager {



    private val registry =

        ConstraintRegistry()



    private val diagnostics =

        ConstraintDiagnostics()



    private val solver =

        solver.ConstraintSolver()





    /**
     * Adds constraint.
     */
    fun add(

        constraint: Constraint

    ){


        registry.register(

            constraint

        )

    }





    /**
     * Removes constraint.
     */
    fun remove(

        id: UUID

    ){


        registry.remove(

            id

        )


        diagnostics.clear(

            id

        )

    }





    /**
     * Solve all constraints.
     */
    fun solve(

        context:

            ConstraintContext

    ):

    SolverResult {



        val result =

            solver.solve(

                registry.all(),

                context

            )





        if(

            result is SolverResult.Conflict

        ){


            result.constraints.forEachIndexed{


                index,

                message ->



                diagnostics.report(

                    UUID.randomUUID(),

                    message

                )


            }

        }





        return result

    }





    /**
     * Returns registry.
     */
    fun getRegistry():

            ConstraintRegistry {


        return registry

    }





    /**
     * Returns diagnostics.
     */
    fun getDiagnostics():

            ConstraintDiagnostics {


        return diagnostics

    }





    /**
     * Clears system.
     */
    fun clear(){


        registry.clear()

        diagnostics.clearAll()

        solver.reset()


    }


}