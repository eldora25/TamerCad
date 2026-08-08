package com.tamercad.core.constraints.type

import com.tamercad.core.constraints.*
import java.util.UUID



/**
 * Forces two entities to have equal properties.
 */
class EqualConstraint(

    private val first:

        UUID,


    private val second:

        UUID


):

    AbstractConstraint(

        type = ConstraintType.EQUAL

    ){



    init {

        references.add(first)

        references.add(second)

    }




    override fun solve(

        context: ConstraintContext

    ):

    ConstraintResult {


        if(

            context.getEntity(first)==null ||

            context.getEntity(second)==null

        ){

            return ConstraintResult.Failed(

                "Equal constraint reference missing"

            )

        }



        return ConstraintResult.Solved

    }


}