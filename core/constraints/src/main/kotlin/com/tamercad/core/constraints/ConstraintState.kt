package com.tamercad.core.constraints


/**
 * Runtime state of a constraint.
 */
enum class ConstraintState {


    /**
     * Constraint is active.
     */
    ACTIVE,


    /**
     * Constraint is disabled.
     */
    DISABLED,


    /**
     * Constraint failed.
     */
    FAILED,


    /**
     * Constraint has conflict.
     */
    CONFLICT,


    /**
     * Constraint requires update.
     */
    DIRTY


}