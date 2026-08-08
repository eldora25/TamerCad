package com.tamercad.core.constraints.type

import com.tamercad.core.constraints.*
import java.util.UUID



/**
 * Keeps a line vertical.
 */
class VerticalConstraint(

    private val line:

        UUID


):

    AbstractConstraint(

        type = ConstraintType.VERTICAL

    ){


    init {

        references.add(line)

    }




    override fun solve(

        context: ConstraintContext

    ):

    ConstraintResult {


        if(

            context.getEntity(line)==null

        ){

            return ConstraintResult.Failed(

                "Vertical constraint target missing"

            )

        }



        return ConstraintResult.Solved

    }


}