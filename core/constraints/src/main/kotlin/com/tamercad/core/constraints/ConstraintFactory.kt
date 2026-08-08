package com.tamercad.core.constraints


import com.tamercad.core.constraints.type.*

import java.util.UUID



/**
 * Creates constraints dynamically.
 *
 * Used by UI commands and
 * serialized project loading.
 */
object ConstraintFactory {



    /**
     * Creates constraint by type.
     */
    fun create(

        type:

            ConstraintType,

        references:

            List<UUID>

    ):
    Constraint {



        return when(type){



            ConstraintType.COINCIDENT ->


                CoincidentConstraint(

                    references[0],

                    references[1]

                )





            ConstraintType.HORIZONTAL ->


                HorizontalConstraint(

                    references[0]

                )





            ConstraintType.VERTICAL ->


                VerticalConstraint(

                    references[0]

                )





            ConstraintType.PARALLEL ->


                ParallelConstraint(

                    references[0],

                    references[1]

                )





            ConstraintType.PERPENDICULAR ->


                PerpendicularConstraint(

                    references[0],

                    references[1]

                )





            ConstraintType.EQUAL ->


                EqualConstraint(

                    references[0],

                    references[1]

                )





            ConstraintType.TANGENT ->


                TangentConstraint(

                    references[0],

                    references[1]

                )





            ConstraintType.CONCENTRIC ->


                ConcentricConstraint(

                    references[0],

                    references[1]

                )





            else ->


                throw UnsupportedOperationException(

                    "Constraint type not implemented: $type"

                )


        }


    }


}