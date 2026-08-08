package com.tamercad.core.math

import kotlin.math.abs

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * 3D Ray (Işın) Modeli. Ray-Casting ve 3D Picking için kullanılır.
 */
data class Ray(
    val origin: Point3,
    val direction: Vector3
) {
    init {
        direction.normalize()
    }

    /**
     * Işının bir düzlemle kesiştiği noktayı bulur.
     */
    fun intersectPlane(planePoint: Point3, planeNormal: Vector3): Point3? {
        val denom = direction.dot(planeNormal)
        if (abs(denom) < 0.0001) return null // Düzleme paralel

        val t = planePoint.subtract(origin).dot(planeNormal) / denom
        if (t < 0) return null // Işın düzlemin ters yönünde

        return origin.add(direction.multiply(t))
    }

    /**
     * Işının bir doğruya (Axis) en yakın olduğu noktayı bulur.
     */
    fun closestPointOnAxis(axisOrigin: Point3, axisDirection: Vector3): Point3 {
        val w0 = origin.subtract(axisOrigin)
        val a = direction.dot(direction)
        val b = direction.dot(axisDirection)
        val c = axisDirection.dot(axisDirection)
        val d = direction.dot(w0)
        val e = axisDirection.dot(w0)
        
        val denom = a * c - b * b
        if (abs(denom) < 0.0001) return axisOrigin // Paralel ise başlangıç noktası
        
        val s = (b * e - c * d) / denom
        return origin.add(direction.multiply(s))
    }
}
