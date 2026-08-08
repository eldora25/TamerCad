package com.tamercad.core.constraints.type

import com.tamercad.core.constraints.*
import java.util.UUID



/**
 * Forces two circular entities
 * to share the same center.
 */
class ConcentricConstraint(

    private val circleA:

        UUID,


    private val circleB:

        UUID


):

    AbstractConstraint(

        type = ConstraintType.CONCENTRIC

    ){



    init {

        references.add(circleA)

        references.add(circleB)

    }




    override fun solve(

        context: ConstraintContext

    ):

    ConstraintResult {


        if(

            context.getEntity(circleA)==null ||

            context.getEntity(circleB)==null

        ){

            return ConstraintResult.Failed(

                "Concentric entity missing"

            )

        }



        return ConstraintResult.Solved

    }


}