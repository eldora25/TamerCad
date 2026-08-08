package com.tamercad.core.sketch

import com.tamercad.core.geometry.*
import com.tamercad.core.math.Point3
import kotlin.math.*

enum class SnapType { 
    NONE, 
    GRID, 
    ENDPOINT, 
    MIDPOINT, 
    CENTER, 
    INTERSECTION, 
    ORIGIN, 
    COINCIDENT, 
    HORIZONTAL, 
    VERTICAL, 
    PARALLEL, 
    PERPENDICULAR, 
    TANGENT,
    FACE_CENTER
}

data class SnapResult(
    val point: Point3, 
    val type: SnapType, 
    val refGeometry: IGeometry? = null,
    val confidence: Double = 1.0
)

/**
 * TamerCAD Profesyonel Yakalama (Snap) ve Çıkarım (Inference) Motoru.
 * Kalemin hassas mühendislik noktalarına kilitlenmesini sağlar.
 */
object SnapEngine {
    
    private const val BASE_SNAP_DISTANCE = 15.0
    private const val ANGLE_TOLERANCE = 0.08 

    fun snapPoint(
        current: Point3, 
        start: Point3?, 
        geometries: List<IGeometry>, 
        components: List<com.tamercad.core.assembly.Component3D>,
        zoom: Float
    ): SnapResult {
        val threshold = BASE_SNAP_DISTANCE / zoom

        // 1. ORIGIN SNAP (Dünya Orijini)
        val origin = Point3(0.0, 0.0, 0.0)
        if (distance(current, origin) < threshold) {
            return SnapResult(origin, SnapType.ORIGIN)
        }
        
        // 2. FACE CENTER SNAPS
        for (comp in components) {
            if (!comp.isVisible) continue
            comp.features.forEach { feat ->
                val solid = (feat as? com.tamercad.core.features.ExtrudeFeature)?.generatedGeometry
                solid?.faces?.forEach { face ->
                    val center = Point3(
                        face.vertices.map { it.x }.average(),
                        face.vertices.map { it.y }.average(),
                        face.vertices.map { it.z }.average()
                    ).transform(comp.transform)
                    
                    if (distance(current, center) < threshold) {
                        return SnapResult(center, SnapType.FACE_CENTER, face)
                    }
                }
            }
        }

        // 3. GEOMETRY SNAPS (Endpoint, Midpoint, Center)
        for (geom in geometries) {
            when (geom) {
                is Line -> {
                    // Endpoint Snap
                    if (distance(current, geom.startPoint) < threshold) return SnapResult(geom.startPoint.copy(), SnapType.ENDPOINT, geom)
                    if (distance(current, geom.endPoint) < threshold) return SnapResult(geom.endPoint.copy(), SnapType.ENDPOINT, geom)
                    
                    // Midpoint Snap
                    val mid = Point3((geom.startPoint.x + geom.endPoint.x)/2, (geom.startPoint.y + geom.endPoint.y)/2, 0.0)
                    if (distance(current, mid) < threshold) return SnapResult(mid, SnapType.MIDPOINT, geom)
                    
                    // Coincident (On Line)
                    val proj = projectPointOnLine(current, geom)
                    if (proj != null && distance(current, proj) < threshold) {
                        return SnapResult(proj, SnapType.COINCIDENT, geom)
                    }
                }
                is Circle3D -> {
                    // Center Snap
                    if (distance(current, geom.center) < threshold) return SnapResult(geom.center.copy(), SnapType.CENTER, geom)
                }
                is Arc3D -> {
                    // Center Snap
                    if (distance(current, geom.center) < threshold) return SnapResult(geom.center.copy(), SnapType.CENTER, geom)
                    
                    // Arc Endpoints
                    val pStart = Point3(geom.center.x + geom.radius * cos(geom.startAngle), geom.center.y + geom.radius * sin(geom.startAngle), 0.0)
                    val pEnd = Point3(geom.center.x + geom.radius * cos(geom.endAngle), geom.center.y + geom.radius * sin(geom.endAngle), 0.0)
                    if (distance(current, pStart) < threshold) return SnapResult(pStart, SnapType.ENDPOINT, geom)
                    if (distance(current, pEnd) < threshold) return SnapResult(pEnd, SnapType.ENDPOINT, geom)
                }
            }
        }

        // 3. INTERSECTION SNAP (Çizgilerin Kesişimi)
        val lines = geometries.filterIsInstance<Line>()
        for (i in lines.indices) {
            for (j in i + 1 until lines.size) {
                val intersect = findIntersection(lines[i], lines[j])
                if (intersect != null && distance(current, intersect) < threshold) {
                    return SnapResult(intersect, SnapType.INTERSECTION)
                }
            }
        }

        // 4. INFERENCE SNAPS (Drawing context)
        if (start != null) {
            val dx = current.x - start.x
            val dy = current.y - start.y
            val dist = sqrt(dx * dx + dy * dy)
            
            if (dist > 0) {
                val angle = atan2(dy, dx)

                // Horizontal / Vertical
                if (abs(current.x - start.x) < threshold) return SnapResult(Point3(start.x, current.y, current.z), SnapType.VERTICAL)
                if (abs(current.y - start.y) < threshold) return SnapResult(Point3(current.x, start.y, current.z), SnapType.HORIZONTAL)

                // Parallel / Perpendicular to other lines
                for (line in lines) {
                    val refDx = line.endPoint.x - line.startPoint.x
                    val refDy = line.endPoint.y - line.startPoint.y
                    val refAngle = atan2(refDy, refDx)

                    val diff = abs(normalizeAngle(angle - refAngle))

                    if (diff < ANGLE_TOLERANCE || abs(diff - PI) < ANGLE_TOLERANCE) {
                        val projectedPt = projectPointOnVector(current, start, refAngle)
                        return SnapResult(projectedPt, SnapType.PARALLEL, line)
                    }

                    if (abs(diff - PI/2) < ANGLE_TOLERANCE || abs(diff - 3*PI/2) < ANGLE_TOLERANCE) {
                        val perpAngle = refAngle + PI/2
                        val projectedPt = projectPointOnVector(current, start, perpAngle)
                        return SnapResult(projectedPt, SnapType.PERPENDICULAR, line)
                    }
                }
            }
        }

        // 5. GRID SNAP
        val gridSize = 50.0
        val gridX = Math.round(current.x / gridSize) * gridSize
        val gridY = Math.round(current.y / gridSize) * gridSize
        if (distance(current, Point3(gridX, gridY, 0.0)) < threshold) {
            return SnapResult(Point3(gridX, gridY, 0.0), SnapType.GRID)
        }

        return SnapResult(current, SnapType.NONE)
    }

    // ----------------------------------------------------
    // MATH UTILS
    // ----------------------------------------------------

    private fun distance(p1: Point3, p2: Point3): Double {
        return sqrt((p2.x - p1.x).pow(2) + (p2.y - p1.y).pow(2))
    }

    private fun projectPointOnLine(pt: Point3, line: Line): Point3? {
        val dx = line.endPoint.x - line.startPoint.x
        val dy = line.endPoint.y - line.startPoint.y
        val l2 = dx*dx + dy*dy
        if (l2 == 0.0) return null
        val t = max(0.0, min(1.0, ((pt.x - line.startPoint.x) * dx + (pt.y - line.startPoint.y) * dy) / l2))
        return Point3(line.startPoint.x + t * dx, line.startPoint.y + t * dy, 0.0)
    }

    private fun projectPointOnVector(pt: Point3, origin: Point3, angle: Double): Point3 {
        val dx = pt.x - origin.x
        val dy = pt.y - origin.y
        val dirX = cos(angle)
        val dirY = sin(angle)
        val dist = dx * dirX + dy * dirY
        return Point3(origin.x + dist * dirX, origin.y + dist * dirY, 0.0)
    }

    private fun findIntersection(l1: Line, l2: Line): Point3? {
        val x1 = l1.startPoint.x; val y1 = l1.startPoint.y
        val x2 = l1.endPoint.x; val y2 = l1.endPoint.y
        val x3 = l2.startPoint.x; val y3 = l2.startPoint.y
        val x4 = l2.endPoint.x; val y4 = l2.endPoint.y

        val denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
        if (denom == 0.0) return null // Parallel

        val ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom
        val ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom

        if (ua in 0.0..1.0 && ub in 0.0..1.0) {
            return Point3(x1 + ua * (x2 - x1), y1 + ua * (y2 - y1), 0.0)
        }
        return null
    }

    private fun normalizeAngle(a: Double): Double {
        var angle = a % (2 * PI)
        if (angle < 0) angle += (2 * PI)
        return angle
    }
}
