package com.tamercad.core.math

/**
 * TAMERCAD — AUTHORITATIVE RAY
 */
data class Ray3(
    val origin: Vec3,
    val direction: Vec3
) {
    init {
        // Ensure direction is normalized and valid
        require(direction.length() > CadTolerance.EPSILON) { "Ray direction must be non-zero" }
    }

    val normalizedDirection = direction.normalized()

    fun pointAt(t: Double): Vec3 = origin + (normalizedDirection * t)

    fun isFinite(): Boolean = origin.isFinite() && direction.isFinite()
}
