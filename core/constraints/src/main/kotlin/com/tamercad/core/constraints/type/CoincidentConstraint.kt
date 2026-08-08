package com.tamercad.core.constraints.type

import com.tamercad.core.constraints.*
import java.util.UUID



/**
 * Forces two sketch points
 * to share the same position.
 */
class CoincidentConstraint(

    private val firstPoint:

        UUID,


    private val secondPoint:

        UUID


):

    AbstractConstraint(

        type = ConstraintType.COINCIDENT

    ){



    init {

        references.add(firstPoint)

        references.add(secondPoint)

    }




    override fun solve(

        context: ConstraintContext

    ):

    ConstraintResult {


        val first =
            context.getEntity(firstPoint)



        val second =
            context.getEntity(secondPoint)



        if(
            first == null ||
            second == null
        ){

            return ConstraintResult.Failed(

                "Coincident reference missing"

            )

        }



        /*
         * Geometry engine will handle
         * actual point merging.
         */
        return ConstraintResult.Solved

    }


}