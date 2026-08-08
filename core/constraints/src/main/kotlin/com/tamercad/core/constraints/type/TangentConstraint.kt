package com.tamercad.core.constraints.type

import com.tamercad.core.constraints.*
import java.util.UUID



/**
 * Maintains tangent relation
 * between curve entities.
 */
class TangentConstraint(

    private val curveA:

        UUID,


    private val curveB:

        UUID


):

    AbstractConstraint(

        type = ConstraintType.TANGENT

    ){



    init {

        references.add(curveA)

        references.add(curveB)

    }




    override fun solve(

        context: ConstraintContext

    ):

    ConstraintResult {


        if(

            context.getEntity(curveA)==null ||

            context.getEntity(curveB)==null

        ){

            return ConstraintResult.Failed(

                "Tangent target missing"

            )

        }



        return ConstraintResult.Solved

    }


}