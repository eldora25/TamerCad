package com.tamercad.core.math

class Matrix4(
    val elements: DoubleArray = doubleArrayOf(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    )
) {
    companion object {
        fun identity(): Matrix4 = Matrix4()

        fun translation(x: Double, y: Double, z: Double): Matrix4 {
            return Matrix4(doubleArrayOf(
                1.0, 0.0, 0.0, x,
                0.0, 1.0, 0.0, y,
                0.0, 0.0, 1.0, z,
                0.0, 0.0, 0.0, 1.0
            ))
        }

        fun scale(x: Double, y: Double, z: Double): Matrix4 {
            return Matrix4(doubleArrayOf(
                x, 0.0, 0.0, 0.0,
                0.0, y, 0.0, 0.0,
                0.0, 0.0, z, 0.0,
                0.0, 0.0, 0.0, 1.0
            ))
        }
    }

    fun multiply(m: Matrix4): Matrix4 {
        val a = this.elements
        val b = m.elements
        val r = DoubleArray(16) { 0.0 }

        for (row in 0 until 4) {
            for (col in 0 until 4) {
                for (k in 0 until 4) {
                    r[row * 4 + col] += a[row * 4 + k] * b[k * 4 + col]
                }
            }
        }
        return Matrix4(r)
    }

    fun transformVector(x: Double, y: Double, z: Double): Vector3 {
        val m = this.elements
        return Vector3(
            x = (m[0] * x) + (m[1] * y) + (m[2] * z) + m[3],
            y = (m[4] * x) + (m[5] * y) + (m[6] * z) + m[7],
            z = (m[8] * x) + (m[9] * y) + (m[10] * z) + m[11]
        )
    }

    fun clone(): Matrix4 = Matrix4(elements.clone())
}
