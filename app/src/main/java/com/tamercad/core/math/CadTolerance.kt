package com.tamercad.core.math

/**
 * TAMERCAD — CENTRAL CAD TOLERANCE POLICY
 * Unified geometric precision constants.
 */
object CadTolerance {
    /**
     * General geometric epsilon for point equality and near-zero checks.
     * 1 micrometer (0.001 mm).
     */
    const val EPSILON = 1e-3

    /**
     * Square of epsilon for distance squared comparisons.
     */
    const val EPSILON_SQ = EPSILON * EPSILON

    /**
     * Tolerance for angular comparisons in radians.
     * Approx 0.01 degrees.
     */
    const val ANGULAR_EPSILON = 2e-4

    /**
     * Minimum length for a valid segment.
     */
    const val MIN_LENGTH = 1e-2 // 0.01 mm

    /**
     * Check if a value is effectively zero.
     */
    fun isZero(value: Double): Boolean = kotlin.math.abs(value) < EPSILON

    /**
     * Check if two values are approximately equal.
     */
    fun areEqual(v1: Double, v2: Double): Boolean = kotlin.math.abs(v1 - v2) < EPSILON
}
