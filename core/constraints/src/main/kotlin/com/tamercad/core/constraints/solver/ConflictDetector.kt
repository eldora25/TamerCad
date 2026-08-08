package com.tamercad.core.constraints.solver


import com.tamercad.core.constraints.*



/**
 * Detects invalid constraint states.
 *
 * Responsible for:
 *
 * - Over constrained sketches
 * - Invalid references
 * - Impossible relations
 */
class ConflictDetector {



    /**
     * Checks constraint collection.
     */
    fun detect(

        constraints:

            List<Constraint>,

        context:

            ConstraintContext

    ):

    SolverResult {



        val conflicts =
            mutableListOf<String>()





        constraints.forEach {


            val validation =

                it.validate(

                    context

                )




            when(validation){



                is ConstraintValidation.Conflict -> {


                    conflicts.add(

                        validation.message

                    )

                }



                is ConstraintValidation.InvalidReference -> {


                    conflicts.add(

                        validation.message

                    )

                }



                else -> {}

            }



        }





        return if(

            conflicts.isEmpty()

        ){


            SolverResult.Success(

                0,

                0.0

            )


        }

        else{


            SolverResult.Conflict(

                conflicts

            )


        }


    }



}