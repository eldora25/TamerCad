package com.tamercad.core.constraints



/**
 * Constraint validation result.
 */
sealed class ConstraintValidation {



    /**
     * Constraint is valid.
     */
    data object Valid :
        ConstraintValidation()



    /**
     * Invalid reference.
     */
    data class InvalidReference(

        val message:String

    ):
        ConstraintValidation()



    /**
     * Constraint conflict.
     */
    data class Conflict(

        val message:String

    ):
        ConstraintValidation()



    /**
     * Missing data.
     */
    data object MissingData :
        ConstraintValidation()


}