package com.tamercad.core.constraints.type

import com.tamercad.core.constraints.*
import java.util.UUID



/**
 * Keeps a line horizontal.
 */
class HorizontalConstraint(

    private val line:

        UUID


):

    AbstractConstraint(

        type = ConstraintType.HORIZONTAL

    ){



    init {

        references.add(line)

    }




    override fun solve(

        context: ConstraintContext

    ):

    ConstraintResult {


        val entity =

            context.getEntity(line)



        if(entity == null){

            return ConstraintResult.Failed(

                "Line not found"

            )

        }



        return ConstraintResult.Solved

    }


}