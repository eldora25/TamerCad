package com.tamercad.core.math

/**
 * TAMERCAD — AUTHORITATIVE SKETCH PLANE
 * Defines a local coordinate system in 3D space.
 */
data class SketchPlane(
    val origin: Vec3 = Vec3.Zero,
    val normal: Vec3 = Vec3.UnitZ,
    val xAxis: Vec3 = Vec3.UnitX,
    val yAxis: Vec3 = Vec3.UnitY
) {
    /**
     * Projects a 3D world point onto the 2D plane.
     */
    fun worldToLocal(point: Vec3): Vec2 {
        val rel = point - origin
        return Vec2(rel.dot(xAxis), rel.dot(yAxis))
    }

    /**
     * Converts a 2D local sketch point to 3D world coordinates.
     */
    fun localToWorld(point: Vec2): Vec3 {
        return origin + (xAxis * point.x) + (yAxis * point.y)
    }

    /**
     * Intersects a 3D ray with this plane.
     * Returns the 3D intersection point or null if parallel or behind origin.
     */
    fun intersectRay(ray: Ray3): Vec3? {
        val denom = normal.dot(ray.normalizedDirection)
        
        // Parallel check
        if (kotlin.math.abs(denom) < CadTolerance.EPSILON) return null
        
        val t = (origin - ray.origin).dot(normal) / denom
        
        // Behind camera/origin check
        if (t < 0) return null
        
        return ray.pointAt(t)
    }

    companion object {
        val XY = SketchPlane(origin = Vec3.Zero, normal = Vec3.UnitZ, xAxis = Vec3.UnitX, yAxis = Vec3.UnitY)
        val XZ = SketchPlane(origin = Vec3.Zero, normal = Vec3.UnitY, xAxis = Vec3.UnitX, yAxis = Vec3.UnitZ)
        val YZ = SketchPlane(origin = Vec3.Zero, normal = Vec3.UnitX, xAxis = Vec3.UnitY, yAxis = Vec3.UnitZ)
    }
}
