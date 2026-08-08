package com.tamercad.core.constraints

import java.util.UUID


/**
 * Base interface for all geometric constraints.
 *
 * Constraints define mathematical relationships
 * between sketch entities.
 */
interface Constraint {


    /**
     * Unique constraint identifier.
     */
    val id: UUID



    /**
     * Constraint type.
     */
    val type: ConstraintType



    /**
     * Referenced geometry entities.
     */
    val references: MutableList<UUID>



    /**
     * Constraint active state.
     */
    var enabled: Boolean



    /**
     * Constraint creation time.
     */
    val createdAt: Long



    /**
     * Solve constraint.
     */
    fun solve(
        context: ConstraintContext
    ): ConstraintResult



    /**
     * Validate constraint.
     */
    fun validate(
        context: ConstraintContext
    ): ConstraintValidation



    /**
     * Serialize constraint.
     */
    fun serialize():
            Map<String, Any>

}