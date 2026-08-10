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

        /**
         * Calculates the circumcenter of three points.
         * Returns null if points are collinear.
         */
        fun calculateCircumcenter(p1: Vec2, p2: Vec2, p3: Vec2): Vec2? {
            val x1 = p1.x; val y1 = p1.y
            val x2 = p2.x; val y2 = p2.y
            val x3 = p3.x; val y3 = p3.y

            val d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2))
            
            if (kotlin.math.abs(d) < CadTolerance.EPSILON) return null

            val ux = ((x1 * x1 + y1 * y1) * (y2 - y3) + (x2 * x2 + y2 * y2) * (y3 - y1) + (x3 * x3 + y3 * y3) * (y1 - y2)) / d
            val uy = ((x1 * x1 + y1 * y1) * (x3 - x2) + (x2 * x2 + y2 * y2) * (x1 - x3) + (x3 * x3 + y3 * y3) * (x2 - x1)) / d
            
            return Vec2(ux, uy)
        }
    }
}
