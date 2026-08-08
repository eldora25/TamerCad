package com.tamercad.core.math

import kotlin.math.sqrt

data class Vector3(
    var x: Double = 0.0,
    var y: Double = 0.0,
    var z: Double = 0.0
) {
    fun add(v: Vector3): Vector3 = Vector3(x + v.x, y + v.y, z + v.z)

    fun subtract(v: Vector3): Vector3 = Vector3(x - v.x, y - v.y, z - v.z)

    fun multiply(scale: Double): Vector3 = Vector3(x * scale, y * scale, z * scale)

    fun dot(v: Vector3): Double = (x * v.x) + (y * v.y) + (z * v.z)

    fun cross(v: Vector3): Vector3 = Vector3(
        (y * v.z) - (z * v.y),
        (z * v.x) - (x * v.z),
        (x * v.y) - (y * v.x)
    )

    fun length(): Double = sqrt((x * x) + (y * y) + (z * z))

    fun normalize(): Vector3 {
        val len = length()
        if (len == 0.0) return Vector3()
        return Vector3(x / len, y / len, z / len)
    }
}
