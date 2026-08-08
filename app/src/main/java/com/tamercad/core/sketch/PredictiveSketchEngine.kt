package com.tamercad.core.sketch

import com.tamercad.core.geometry.IGeometry
import com.tamercad.core.geometry.Line
import com.tamercad.core.geometry.Circle3D
import com.tamercad.core.geometry.Arc3D
import com.tamercad.core.math.Point3
import kotlin.math.*

/**
 * TamerCAD Gelişmiş YZ Geometri Tanıma ve Üretim Motoru (Shapr3D Standardı)
 */
object PredictiveSketchEngine {

    fun recognize(rawStroke: List<Point3>, zoom: Float): List<IGeometry> {
        if (rawStroke.size < 5) return emptyList()
        
        val start = rawStroke.first()
        val end = rawStroke.last()
        val distStartEnd = distance(start, end)
        var pathLength = 0.0
        for (i in 0 until rawStroke.size - 1) { 
            pathLength += distance(rawStroke[i], rawStroke[i+1]) 
        }

        // Kapalı bir şekil mi?
        val isClosed = distStartEnd < (pathLength * 0.20) || distStartEnd < (30.0 / zoom)

        if (isClosed) {
            val centerX = rawStroke.map { it.x }.average()
            val centerY = rawStroke.map { it.y }.average()
            val center = Point3(centerX, centerY, 0.0)
            
            val avgRadius = rawStroke.map { distance(center, it) }.average()
            val radiusVariance = rawStroke.map { (distance(center, it) - avgRadius).pow(2) }.average()

            // Daire Tanıma (TEK PARÇA)
            if (radiusVariance < (avgRadius * avgRadius * 0.12)) {
                return listOf(Circle3D(center, avgRadius))
            } 
            
            // Elips Tanıma
            val ellipse = generateEllipseBestFit(rawStroke)
            if (ellipse != null) return ellipse

            // Dikdörtgen Tanıma
            val epsilon = 20.0 / zoom
            val simplified = rdp(rawStroke, epsilon)
            if (simplified.size in 4..6) {
                return generateRectangleDiagonal(simplified.first(), simplified[simplified.size / 2])
            }
            
            val lines = mutableListOf<Line>()
            val polyPoints = simplified.toMutableList()
            if (polyPoints.size > 2) {
                polyPoints[polyPoints.size - 1] = polyPoints.first()
                for (i in 0 until polyPoints.size - 1) {
                    lines.add(Line(polyPoints[i], polyPoints[i+1]))
                }
            }
            return lines
        } else {
            // Açık şekil: Çizgi mi Yay mı?
            val straightness = distStartEnd / pathLength
            if (straightness > 0.92) {
                return listOf(Line(start, end))
            } else {
                // YAY (Arc) Tanıma - Tek Parça Arc3D
                val midIndex = rawStroke.size / 2
                val midPoint = rawStroke[midIndex]
                return listOf(calculateArcFromPoints(start, midPoint, end))
            }
        }
    }

    private fun calculateArcFromPoints(p1: Point3, p2: Point3, p3: Point3): Arc3D {
        val x1 = p1.x; val y1 = p1.y
        val x2 = p2.x; val y2 = p2.y
        val x3 = p3.x; val y3 = p3.y
        
        val d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2))
        if (abs(d) < 0.0001) return Arc3D(p1, 0.0, 0.0, 0.0)
        
        val ux = ((x1.pow(2) + y1.pow(2)) * (y2 - y3) + (x2.pow(2) + y2.pow(2)) * (y3 - y1) + (x3.pow(2) + y3.pow(2)) * (y1 - y2)) / d
        val uy = ((x1.pow(2) + y1.pow(2)) * (x3 - x2) + (x2.pow(2) + y2.pow(2)) * (x1 - x3) + (x3.pow(2) + y3.pow(2)) * (x2 - x1)) / d
        
        val center = Point3(ux, uy, 0.0)
        val radius = distance(center, p1)
        val startAngle = atan2(y1 - uy, x1 - ux)
        val endAngle = atan2(y3 - uy, x3 - ux)
        
        return Arc3D(center, radius, startAngle, endAngle)
    }

    fun straighten(start: Point3, end: Point3): Line {
        val dx = abs(end.x - start.x)
        val dy = abs(end.y - start.y)
        return if (dx > dy * 5) {
            Line(start, Point3(end.x, start.y, 0.0))
        } else if (dy > dx * 5) {
            Line(start, Point3(start.x, end.y, 0.0))
        } else {
            Line(start, end)
        }
    }

    fun generateEllipseBestFit(points: List<Point3>): List<Line>? {
        if (points.size < 10) return null
        val minX = points.minOf { it.x }; val maxX = points.maxOf { it.x }
        val minY = points.minOf { it.y }; val maxY = points.maxOf { it.y }
        val radiusX = (maxX - minX) / 2.0
        val radiusY = (maxY - minY) / 2.0
        if (abs(radiusX - radiusY) < (radiusX * 0.15)) return null
        return generateEllipse(Point3((minX+maxX)/2.0, (minY+maxY)/2.0, 0.0), radiusX, radiusY)
    }

    fun generateRectangleDiagonal(start: Point3, end: Point3): List<Line> {
        val p2 = Point3(end.x, start.y, 0.0)
        val p4 = Point3(start.x, end.y, 0.0)
        return listOf(Line(start, p2), Line(p2, end), Line(end, p4), Line(p4, start))
    }

    fun generatePolygon(center: Point3, radius: Double, sides: Int = 6): List<Line> {
        val lines = mutableListOf<Line>()
        var prevPoint = Point3(center.x + radius, center.y, 0.0)
        for (i in 1..sides) {
            val angle = i * (2.0 * PI / sides)
            val nextPoint = Point3(center.x + radius * cos(angle), center.y + radius * sin(angle), 0.0)
            lines.add(Line(prevPoint, nextPoint)); prevPoint = nextPoint
        }
        return lines
    }

    fun generateSpline(points: List<Point3>): List<Line> {
        if (points.size < 3) return emptyList()
        val simplifiedPoints = rdp(points, 8.0)
        val lines = mutableListOf<Line>()
        for (i in 0 until simplifiedPoints.size - 1) { lines.add(Line(simplifiedPoints[i], simplifiedPoints[i+1])) }
        return lines
    }

    fun generateEllipse(center: Point3, radiusX: Double, radiusY: Double): List<Line> {
        val lines = mutableListOf<Line>(); val segments = 36
        var prevPoint = Point3(center.x + radiusX, center.y, 0.0)
        for (i in 1..segments) {
            val angle = i * (2.0 * PI / segments)
            val nextPoint = Point3(center.x + radiusX * cos(angle), center.y + radiusY * sin(angle), 0.0)
            lines.add(Line(prevPoint, nextPoint)); prevPoint = nextPoint
        }
        return lines
    }

    private fun rdp(points: List<Point3>, epsilon: Double): List<Point3> {
        if (points.size < 3) return points
        var maxDistance = 0.0; var index = 0; val end = points.size - 1
        for (i in 1 until end) {
            val d = perpendicularDistance(points[i], points[0], points[end])
            if (d > maxDistance) { index = i; maxDistance = d }
        }
        if (maxDistance > epsilon) {
            val recResults1 = rdp(points.subList(0, index + 1), epsilon)
            val recResults2 = rdp(points.subList(index, end + 1), epsilon)
            return recResults1.dropLast(1) + recResults2
        } else { return listOf(points[0], points[end]) }
    }

    private fun perpendicularDistance(pt: Point3, lineStart: Point3, lineEnd: Point3): Double {
        val dx = lineEnd.x - lineStart.x; val dy = lineEnd.y - lineStart.y; val mag = sqrt(dx * dx + dy * dy)
        if (mag == 0.0) return distance(pt, lineStart)
        val proj = ((pt.x - lineStart.x) * dx + (pt.y - lineStart.y) * dy) / mag
        return distance(pt, Point3(lineStart.x + proj * dx / mag, lineStart.y + proj * dy / mag, 0.0))
    }

    private fun distance(p1: Point3, p2: Point3): Double { return sqrt((p2.x - p1.x).pow(2) + (p2.y - p1.y).pow(2)) }
}
