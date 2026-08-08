package com.tamercad.core.constraints


import java.util.UUID



/**
 * Common constraint implementation.
 */
abstract class AbstractConstraint(


    override val id: UUID = UUID.randomUUID(),



    override val type: ConstraintType



):
    Constraint {



    override val references =
        mutableListOf<UUID>()



    override var enabled =
        true



    override val createdAt =
        System.currentTimeMillis()





    override fun validate(

        context: ConstraintContext

    ):
    ConstraintValidation {



        for(reference in references){


            if(
                !context.contains(reference)
            ){

                return ConstraintValidation.InvalidReference(

                    "Missing geometry reference: $reference"

                )

            }

        }



        return ConstraintValidation.Valid

    }





    override fun serialize():

            Map<String, Any>{


        return mapOf(

            "id" to id.toString(),

            "type" to type.name,

            "references" to references.map{

                it.toString()

            },

            "enabled" to enabled,

            "createdAt" to createdAt

        )

    }


}