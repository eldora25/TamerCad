package com.tamercad.core.constraints



/**
 * Serializes constraints for project files.
 *
 * Used by .tcad persistence layer.
 */
class ConstraintSerializer {



    /**
     * Serializes one constraint.
     */
    fun serialize(

        constraint: Constraint

    ):

    Map<String,Any>{


        return constraint.serialize()

    }





    /**
     * Serializes constraint collection.
     */
    fun serializeAll(

        constraints:

            List<Constraint>

    ):

    List<Map<String,Any>> {



        return constraints.map{


            serialize(it)


        }

    }


}