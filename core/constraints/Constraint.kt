package com.tamercad.core.constraints

/**
 * Base interface for all geometric constraints.
 *
 * Constraints are mathematical rules applied
 * to sketch entities.
 *
 * Constraint implementations must not contain
 * rendering or UI logic.
 */
interface Constraint {


    /**
     * Unique constraint identifier.
     */
    val id: String



    /**
     * Constraint category.
     */
    val type: ConstraintType



    /**
     * Entity identifiers affected by this constraint.
     */
    val entityIds: List<String>



    /**
     * Current solving state.
     */
    var status: ConstraintStatus



    /**
     * Evaluates the constraint.
     *
     * @return solving result
     */
    fun solve(): ConstraintResult



    /**
     * Checks whether referenced entities are valid.
     *
     * @return true if references exist
     */
    fun validate(): Boolean

}