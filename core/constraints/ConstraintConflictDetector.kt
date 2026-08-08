package com.tamercad.core.constraints


/**
 * Detects invalid constraint states.
 *
 * The conflict detector does not solve geometry.
 * It only analyzes the constraint system and
 * reports possible problems.
 */
class ConstraintConflictDetector {



    /**
     * Checks all constraints for conflicts.
     *
     * @param constraints active constraints
     */
    fun detect(

        constraints: List<Constraint>

    ):

            List<ConstraintResult> {



        val results =

            mutableListOf<ConstraintResult>()



        for (

            constraint in constraints

        ) {



            if (

                !constraint.validate()

            ) {


                results.add(

                    ConstraintResult(

                        status =

                            ConstraintStatus.INVALID_REFERENCE,


                        message =

                            "Constraint ${constraint.id} has invalid references."

                    )

                )


                continue

            }





            if (

                constraint.status ==

                ConstraintStatus.CONFLICT

            ) {


                results.add(

                    ConstraintResult(

                        status =

                            ConstraintStatus.CONFLICT,


                        message =

                            "Constraint ${constraint.id} is conflicting."

                    )

                )

            }


        }





        return results

    }





    /**
     * Checks duplicate constraints.
     *
     * Example:
     * Same horizontal relation added twice.
     */
    fun detectDuplicate(

        constraints: List<Constraint>

    ):

            Boolean {



        val signatures =

            mutableSetOf<String>()



        for (

            constraint in constraints

        ) {



            val signature =

                buildString {


                    append(

                        constraint.type

                    )


                    append(

                        constraint.entityIds.sorted()

                    )

                }





            if (

                !signatures.add(signature)

            ) {


                return true

            }


        }





        return false

    }





    /**
     * Checks circular dependency state.
     */
    fun detectCircularDependency(

        graph:

            ConstraintDependencyGraph

    ):

            Boolean {



        return graph.hasCycle()

    }


}