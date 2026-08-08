package com.tamercad.core.constraints.solver


/**
 * Represents current solver state.
 */
enum class SolverState {


    /**
     * Solver is idle.
     */
    IDLE,


    /**
     * Solver is calculating.
     */
    SOLVING,


    /**
     * Solution completed.
     */
    SOLVED,


    /**
     * Constraint conflict detected.
     */
    CONFLICT,


    /**
     * Numerical instability detected.
     */
    FAILED


}