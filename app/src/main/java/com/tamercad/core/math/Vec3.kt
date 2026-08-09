package com.tamercad.core.math

import kotlin.math.sqrt

/**
 * TAMERCAD — IMMUTABLE 3D VECTOR
 * Millimeter units.
 */
data class Vec3(val x: Double = 0.0, val y: Double = 0.0, val z: Double = 0.0) {
    operator fun plus(v: Vec3) = Vec3(x + v.x, y + v.y, z + v.z)
    operator fun minus(v: Vec3) = Vec3(x - v.x, y - v.y, z - v.z)
    operator fun times(s: Double) = Vec3(x * s, y * s, z * s)
    operator fun div(s: Double) = if (s != 0.0) Vec3(x / s, y / s, z / s) else Vec3(0.0, 0.0, 0.0)

    fun dot(v: Vec3): Double = x * v.x + y * v.y + z * v.z
    
    fun cross(v: Vec3) = Vec3(
        y * v.z - z * v.y,
        z * v.x - x * v.z,
        x * v.y - y * v.x
    )

    fun length(): Double = sqrt(x * x + y * y + z * z)

    fun normalized(): Vec3 {
        val l = length()
        return if (l > CadTolerance.EPSILON) this / l else Vec3(0.0, 0.0, 0.0)
    }

    fun distanceTo(v: Vec3): Double = (this - v).length()

    fun isFinite(): Boolean = x.isFinite() && y.isFinite() && z.isFinite()

    fun approximatelyEquals(v: Vec3): Boolean =
        CadTolerance.areEqual(x, v.x) && 
        CadTolerance.areEqual(y, v.y) && 
        CadTolerance.areEqual(z, v.z)

    fun toPoint3() = Point3(x, y, z)

    companion object {
        val Zero = Vec3(0.0, 0.0, 0.0)
        val UnitX = Vec3(1.0, 0.0, 0.0)
        val UnitY = Vec3(0.0, 1.0, 0.0)
        val UnitZ = Vec3(0.0, 0.0, 1.0)
        
        fun fromPoint3(p: Point3) = Vec3(p.x, p.y, p.z)
    }
}
