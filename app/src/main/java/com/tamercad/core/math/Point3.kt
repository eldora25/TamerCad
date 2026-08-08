package com.tamercad.core.math

import kotlin.math.abs
import kotlin.math.sqrt

data class Point3(
    var x: Double = 0.0,
    var y: Double = 0.0,
    var z: Double = 0.0
) {
    companion object {
        fun origin(): Point3 = Point3(0.0, 0.0, 0.0)
        fun fromVector(vector: Vector3): Point3 = Point3(vector.x, vector.y, vector.z)
    }

    fun toVector(): Vector3 = Vector3(x, y, z)

    fun add(vector: Vector3): Point3 = Point3(x + vector.x, y + vector.y, z + vector.z)

    fun subtract(point: Point3): Vector3 = Vector3(x - point.x, y - point.y, z - point.z)

    fun distanceTo(point: Point3): Double {
        val dx = x - point.x
        val dy = y - point.y
        val dz = z - point.z
        return sqrt((dx * dx) + (dy * dy) + (dz * dz))
    }

    fun midpoint(point: Point3): Point3 = Point3(
        (x + point.x) / 2.0,
        (y + point.y) / 2.0,
        (z + point.z) / 2.0
    )

    fun transform(matrix: Matrix4): Point3 {
        val result = matrix.transformVector(x, y, z)
        return Point3(result.x, result.y, result.z)
    }

    fun equals(point: Point3, tolerance: Double = 0.000001): Boolean {
        return (abs(x - point.x) < tolerance &&
                abs(y - point.y) < tolerance &&
                abs(z - point.z) < tolerance)
    }
    
    override fun toString(): String = "Point3($x, $y, $z)"
}
