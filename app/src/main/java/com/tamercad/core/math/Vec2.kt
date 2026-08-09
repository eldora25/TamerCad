package com.tamercad.core.math

import kotlin.math.sqrt

/**
 * TAMERCAD — IMMUTABLE 2D VECTOR
 * Millimeter units.
 */
data class Vec2(val x: Double = 0.0, val y: Double = 0.0) {
    operator fun plus(v: Vec2) = Vec2(x + v.x, y + v.y)
    operator fun minus(v: Vec2) = Vec2(x - v.x, y - v.y)
    operator fun times(s: Double) = Vec2(x * s, y * s)
    operator fun div(s: Double) = if (s != 0.0) Vec2(x / s, y / s) else Vec2(0.0, 0.0)

    fun dot(v: Vec2): Double = x * v.x + y * v.y
    fun length(): Double = sqrt(x * x + y * y)
    
    fun normalized(): Vec2 {
        val l = length()
        return if (l > CadTolerance.EPSILON) this / l else Vec2(0.0, 0.0)
    }

    fun distanceTo(v: Vec2): Double = (this - v).length()

    fun isFinite(): Boolean = x.isFinite() && y.isFinite()

    fun approximatelyEquals(v: Vec2): Boolean = 
        CadTolerance.areEqual(x, v.x) && CadTolerance.areEqual(y, v.y)

    fun toPoint3() = Point3(x, y, 0.0)

    companion object {
        val Zero = Vec2(0.0, 0.0)
        val UnitX = Vec2(1.0, 0.0)
        val UnitY = Vec2(0.0, 1.0)
    }
}
