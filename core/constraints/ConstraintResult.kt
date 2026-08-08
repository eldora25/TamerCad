package com.tamercad.core.constraints

/**
 * Result returned by constraint evaluation.
 *
 * The solver never throws errors for normal
 * geometric failures. Instead it returns
 * diagnostic information.
 */
data class ConstraintResult(

    val status: ConstraintStatus,


    val message: String = "",


    val changedEntities: List<String> = emptyList()

)