package com.tamercad.core.sketch

import com.tamercad.core.geometry.*
import com.tamercad.core.math.*
import kotlin.math.*

enum class SnapType { 
    NONE, GRID, ENDPOINT, MIDPOINT, CENTER, INTERSECTION, ORIGIN, COINCIDENT, HORIZONTAL, VERTICAL, PARALLEL, PERPENDICULAR, TANGENT, FACE_CENTER
}

data class SnapResult(
    val point: Vec2, // Local plane coordinates
    val type: SnapType, 
    val refGeometry: IGeometry? = null
)

/**
 * TAMERCAD — PLANE-LOCAL SNAP ENGINE
 */
object SnapEngine {
    
    private const val BASE_SNAP_DISTANCE = 15.0 // Pixels at zoom 1.0

    fun snapPoint(
        currentLocal: Vec2, 
        startLocal: Vec2?, 
        geometries: List<IGeometry>, 
        zoom: Float,
        gridSpacing: Double
    ): SnapResult {
        val threshold = BASE_SNAP_DISTANCE / zoom

        // 1. ORIGIN SNAP (Plane Local (0,0))
        if (currentLocal.distanceTo(Vec2.Zero) < threshold) {
            return SnapResult(Vec2.Zero, SnapType.ORIGIN)
        }

        // 2. GEOMETRY SNAPS (Endpoint, Midpoint, Center)
        for (geom in geometries) {
            when (geom) {
                is SketchLine -> {
                    if (currentLocal.distanceTo(geom.start) < threshold) return SnapResult(geom.start, SnapType.ENDPOINT, geom)
                    if (currentLocal.distanceTo(geom.end) < threshold) return SnapResult(geom.end, SnapType.ENDPOINT, geom)
                    
                    val mid = Vec2((geom.start.x + geom.end.x)/2, (geom.start.y + geom.end.y)/2)
                    if (currentLocal.distanceTo(mid) < threshold) return SnapResult(mid, SnapType.MIDPOINT, geom)
                    
                    val proj = projectOnLine(currentLocal, geom.start, geom.end)
                    if (proj != null && currentLocal.distanceTo(proj) < threshold) {
                        return SnapResult(proj, SnapType.COINCIDENT, geom)
                    }
                }
                is SketchCircle -> {
                    if (currentLocal.distanceTo(geom.center) < threshold) return SnapResult(geom.center, SnapType.CENTER, geom)
                    val distToCenter = currentLocal.distanceTo(geom.center)
                    if (abs(distToCenter - geom.radius) < threshold) {
                        val dir = Vec2(currentLocal.x - geom.center.x, currentLocal.y - geom.center.y).normalized()
                        val onCircle = geom.center + dir * geom.radius
                        return SnapResult(onCircle, SnapType.COINCIDENT, geom)
                    }
                }
                is SketchArc -> {
                    if (currentLocal.distanceTo(geom.center) < threshold) return SnapResult(geom.center, SnapType.CENTER, geom)
                    // Endpoints
                    val p1 = geom.center + Vec2(cos(geom.startAngle) * geom.radius, sin(geom.startAngle) * geom.radius)
                    val p2 = geom.center + Vec2(cos(geom.endAngle) * geom.radius, sin(geom.endAngle) * geom.radius)
                    if (currentLocal.distanceTo(p1) < threshold) return SnapResult(p1, SnapType.ENDPOINT, geom)
                    if (currentLocal.distanceTo(p2) < threshold) return SnapResult(p2, SnapType.ENDPOINT, geom)
                }
            }
        }

        // 3. INFERENCE (Horizontal / Vertical to Start)
        if (startLocal != null) {
            if (abs(currentLocal.x - startLocal.x) < threshold) return SnapResult(Vec2(startLocal.x, currentLocal.y), SnapType.VERTICAL)
            if (abs(currentLocal.y - startLocal.y) < threshold) return SnapResult(Vec2(currentLocal.x, startLocal.y), SnapType.HORIZONTAL)
        }

        // 4. GRID SNAP (Plane Local)
        val gridX = Math.round(currentLocal.x / gridSpacing) * gridSpacing
        val gridY = Math.round(currentLocal.y / gridSpacing) * gridSpacing
        val gridPt = Vec2(gridX, gridY)
        if (currentLocal.distanceTo(gridPt) < threshold) {
            return SnapResult(gridPt, SnapType.GRID)
        }

        return SnapResult(currentLocal, SnapType.NONE)
    }

    private fun projectOnLine(p: Vec2, a: Vec2, b: Vec2): Vec2? {
        val dx = b.x - a.x; val dy = b.y - a.y
        val l2 = dx*dx + dy*dy
        if (l2 == 0.0) return null
        var t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2
        t = max(0.0, min(1.0, t))
        return Vec2(a.x + t * dx, a.y + t * dy)
    }
}
