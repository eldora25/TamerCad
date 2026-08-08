package com.tamercad.core.constraints.type

import com.tamercad.core.constraints.*
import java.util.UUID



/**
 * Forces two lines to meet at 90 degrees.
 */
class PerpendicularConstraint(

    private val firstLine:

        UUID,


    private val secondLine:

        UUID


):

    AbstractConstraint(

        type = ConstraintType.PERPENDICULAR

    ){



    init {

        references.add(firstLine)

        references.add(secondLine)

    }




    override fun solve(

        context: ConstraintContext

    ):

    ConstraintResult {


        if(

            context.getEntity(firstLine)==null ||

            context.getEntity(secondLine)==null

        ){

            return ConstraintResult.Failed(

                "Perpendicular reference missing"

            )

        }



        return ConstraintResult.Solved

    }


}