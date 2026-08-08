package com.tamercad.core.constraints

/**
 * Represents constraint solving state.
 */
enum class ConstraintStatus {

    /**
     * Constraint solved successfully.
     */
    SATISFIED,


    /**
     * Constraint could not be solved.
     */
    FAILED,


    /**
     * Constraint conflicts with another constraint.
     */
    CONFLICT,


    /**
     * Required reference entity is missing.
     */
    INVALID_REFERENCE,


    /**
     * Constraint system has not been evaluated.
     */
    UNKNOWN

}