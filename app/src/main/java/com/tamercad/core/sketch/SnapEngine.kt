package com.tamercad.core.sketch

import com.tamercad.core.geometry.Line
import com.tamercad.core.math.Point3
import kotlin.math.*

enum class SnapType { 
    NONE, GRID, ENDPOINT, COINCIDENT, HORIZONTAL, VERTICAL, PARALLEL, PERPENDICULAR, TANGENT 
}

data class SnapResult(val point: Point3, val type: SnapType, val refLine: Line? = null)

/**
 * TamerCAD Canlı Yakalama ve Bağlamsal Kısıtlama (Constraint) Motoru
 * c1: Paralel ve Dik (Perpendicular) Kilitleme
 * c2: Teğetlik (Tangent) Kilitleme
 * c3: Çakışma (Coincident) ve Uç Nokta (Endpoint) Kilitleme
 */
object SnapEngine {
    
    // Manyetik alan yarıçapı
    private const val BASE_SNAP_DISTANCE = 15.0
    // Açısal tolerans (Radyan cinsinden, ~4.5 derece sapmaya kadar kilitler)
    private const val ANGLE_TOLERANCE = 0.08 

    fun snapPoint(current: Point3, start: Point3?, geometries: List<Line>, zoom: Float): SnapResult {
        val threshold = BASE_SNAP_DISTANCE / zoom

        // 1. C3 - Çakışma (Coincident) ve Uç Nokta (Endpoint)
        for (line in geometries) {
            if (distance(current, line.startPoint) < threshold) return SnapResult(line.startPoint.copy(), SnapType.ENDPOINT)
            if (distance(current, line.endPoint) < threshold) return SnapResult(line.endPoint.copy(), SnapType.ENDPOINT)
            
            // Eğer uçta değilse ama çizginin üzerindeyse (Coincident)
            val proj = projectPointOnLine(current, line)
            if (proj != null && distance(current, proj) < threshold) {
                return SnapResult(proj, SnapType.COINCIDENT, line)
            }
        }

        // 2. Çizim esnasındaki Vektörel (Açısal) Kısıtlamalar (C1 ve C2)
        if (start != null) {
            val dx = current.x - start.x
            val dy = current.y - start.y
            val dist = sqrt(dx * dx + dy * dy)
            
            if (dist > 0) {
                val angle = atan2(dy, dx)

                // Yatay / Dikey kilitler
                if (abs(current.x - start.x) < threshold) return SnapResult(Point3(start.x, current.y, current.z), SnapType.VERTICAL)
                if (abs(current.y - start.y) < threshold) return SnapResult(Point3(current.x, start.y, current.z), SnapType.HORIZONTAL)

                // Sahnedeki diğer geometrilerle açı karşılaştırması
                for (line in geometries) {
                    val refDx = line.endPoint.x - line.startPoint.x
                    val refDy = line.endPoint.y - line.startPoint.y
                    val refAngle = atan2(refDy, refDx)

                    val diff = abs(normalizeAngle(angle - refAngle))

                    // C1 & C2: Paralellik ve Teğetlik (0 veya 180 Derece Uyum)
                    if (diff < ANGLE_TOLERANCE || abs(diff - Math.PI) < ANGLE_TOLERANCE) {
                        // Eğer start noktası mevcut bir çizginin üzerindeyse ve açısı aynıysa bu Teğettir
                        val isTangent = (distance(start, line.startPoint) < 0.1 || distance(start, line.endPoint) < 0.1)
                        val snapType = if (isTangent) SnapType.TANGENT else SnapType.PARALLEL

                        val projectedPt = projectPointOnVector(current, start, refAngle)
                        return SnapResult(projectedPt, snapType, line)
                    }

                    // C1: Diklik / Perpendicular (90 veya 270 Derece Uyum)
                    if (abs(diff - Math.PI/2) < ANGLE_TOLERANCE || abs(diff - 3*Math.PI/2) < ANGLE_TOLERANCE) {
                        val perpAngle = refAngle + Math.PI/2
                        val projectedPt = projectPointOnVector(current, start, perpAngle)
                        return SnapResult(projectedPt, SnapType.PERPENDICULAR, line)
                    }
                }
            }
        }

        // 3. Çalışma Alanı (Grid) Yakalama (50mm standart aralık)
        val gridSize = 50.0
        val gridX = Math.round(current.x / gridSize) * gridSize
        val gridY = Math.round(current.y / gridSize) * gridSize
        
        if (distance(current, Point3(gridX, gridY, 0.0)) < threshold) {
            return SnapResult(Point3(gridX, gridY, 0.0), SnapType.GRID)
        }

        // Kısıtlama yoksa serbest çizim devam eder
        return SnapResult(current, SnapType.NONE)
    }

    // ----------------------------------------------------
    // YARDIMCI MATEMATİK FONKSİYONLARI
    // ----------------------------------------------------

    private fun distance(p1: Point3, p2: Point3): Double {
        return sqrt((p2.x - p1.x)*(p2.x - p1.x) + (p2.y - p1.y)*(p2.y - p1.y))
    }

    // Noktanın çizgi segmentine dik izdüşümünü bulur
    private fun projectPointOnLine(pt: Point3, line: Line): Point3? {
        val l2 = distance(line.startPoint, line.endPoint).pow(2)
        if (l2 == 0.0) return null
        val t = max(0.0, min(1.0, ((pt.x - line.startPoint.x) * (line.endPoint.x - line.startPoint.x) + (pt.y - line.startPoint.y) * (line.endPoint.y - line.startPoint.y)) / l2))
        return Point3(line.startPoint.x + t * (line.endPoint.x - line.startPoint.x), line.startPoint.y + t * (line.endPoint.y - line.startPoint.y), 0.0)
    }

    // İstenilen mükemmel açıya noktayı hapseder (Paralel ve Diklik kilitleri için)
    private fun projectPointOnVector(pt: Point3, origin: Point3, angle: Double): Point3 {
        val dx = pt.x - origin.x
        val dy = pt.y - origin.y
        val dirX = cos(angle)
        val dirY = sin(angle)
        val dist = dx * dirX + dy * dirY
        return Point3(origin.x + dist * dirX, origin.y + dist * dirY, 0.0)
    }

    private fun normalizeAngle(a: Double): Double {
        var angle = a % (2 * Math.PI)
        if (angle < 0) angle += (2 * Math.PI)
        return angle
    }
}
