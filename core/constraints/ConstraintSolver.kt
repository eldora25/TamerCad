package com.tamercad.core.constraints


/**
 * Main constraint solving engine.
 *
 * Responsible for executing constraints
 * and updating geometric relationships.
 *
 * Rendering is completely isolated.
 */
class ConstraintSolver {



    private val conflictDetector =

        ConstraintConflictDetector()



    private val dependencyGraph =

        ConstraintDependencyGraph()





    /**
     * Solves all constraints.
     *
     * @param constraints active constraints
     */
    fun solve(

        constraints: List<Constraint>

    ):

            List<ConstraintResult> {



        val results =

            mutableListOf<ConstraintResult>()





        val conflicts =

            conflictDetector.detect(

                constraints

            )





        if (

            conflicts.isNotEmpty()

        ) {


            return conflicts

        }





        if (

            dependencyGraph.hasCycle()

        ) {



            return listOf(

                ConstraintResult(

                    status =

                        ConstraintStatus.CONFLICT,


                    message =

                        "Circular dependency detected."

                )

            )

        }





        for (

            constraint in constraints

        ) {



            val result =

                constraint.solve()





            constraint.status =

                result.status





            results.add(

                result

            )


        }





        return results

    }





    /**
     * Adds dependency relation.
     */
    fun addDependency(

        from:String,

        to:String

    ) {


        dependencyGraph.addDependency(

            from,

            to

        )

    }





    /**
     * Removes dependency relation.
     */
    fun removeDependency(

        from:String,

        to:String

    ) {


        dependencyGraph.removeDependency(

            from,

            to

        )

    }





    /**
     * Clears solver state.
     */
    fun reset(){

        dependencyGraph.clear()

    }





    /**
     * Returns solver diagnostics.
     */
    fun debugInfo():

            Map<String, Any> {



        return mapOf(

            "type" to

                "ConstraintSolver",


            "dependencies" to

                dependencyGraph.debugInfo()

        )

    }


}