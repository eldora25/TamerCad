package com.tamercad.core.constraints.type

import com.tamercad.core.constraints.*
import java.util.UUID



/**
 * Forces two lines to remain parallel.
 */
class ParallelConstraint(

    private val firstLine:

        UUID,


    private val secondLine:

        UUID


):

    AbstractConstraint(

        type = ConstraintType.PARALLEL

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

                "Parallel line reference missing"

            )

        }



        return ConstraintResult.Solved

    }


}