package com.tamercad.core.analysis

import com.tamercad.core.geometry.*
import com.tamercad.core.math.Point3
import com.tamercad.core.math.Vector3
import kotlin.math.*

/**
 * TamerCAD Ölçüm Motoru.
 * Farklı geometri tipleri arasındaki mesafe, açı, alan ve hacim hesaplamalarını yapar.
 */
object MeasurementEngine {

    data class MeasurementResult(
        val value: Double,
        val unit: String = "mm",
        val type: MeasurementType,
        val label: String
    )

    enum class MeasurementType {
        DISTANCE, ANGLE, AREA, VOLUME, RADIUS, DIAMETER
    }

    fun measure(entities: List<IGeometry>): MeasurementResult? {
        if (entities.isEmpty()) return null

        return when {
            entities.size == 1 -> measureSingle(entities.first())
            entities.size == 2 -> measurePair(entities[0], entities[1])
            else -> null
        }
    }

    private fun measureSingle(entity: IGeometry): MeasurementResult? {
        return when (entity) {
            is Line -> MeasurementResult(entity.length(), "mm", MeasurementType.DISTANCE, "Uzunluk")
            is Circle3D -> MeasurementResult(entity.radius, "mm", MeasurementType.RADIUS, "Yarıçap")
            is Arc3D -> MeasurementResult(entity.radius, "mm", MeasurementType.RADIUS, "Yarıçap")
            is Face3D -> {
                // Basitleştirilmiş alan hesabı (Düzlemsel poligon)
                val area = computeArea(entity.vertices)
                MeasurementResult(area, "mm²", MeasurementType.AREA, "Alan")
            }
            is Solid3D -> {
                // TODO: Hacim hesabı
                MeasurementResult(0.0, "mm³", MeasurementType.VOLUME, "Hacim")
            }
            else -> null
        }
    }

    private fun measurePair(e1: IGeometry, e2: IGeometry): MeasurementResult? {
        // Point-Point Distance
        if (e1 is Line && e2 is Line) {
            // İki çizgi arasındaki açı
            val v1 = Vector3(e1.endPoint.x - e1.startPoint.x, e1.endPoint.y - e1.startPoint.y, e1.endPoint.z - e1.startPoint.z).normalize()
            val v2 = Vector3(e2.endPoint.x - e2.startPoint.x, e2.endPoint.y - e2.startPoint.y, e2.endPoint.z - e2.startPoint.z).normalize()
            val dot = v1.dot(v2)
            val angle = acos(max(-1.0, min(1.0, dot))) * (180.0 / PI)
            return MeasurementResult(angle, "°", MeasurementType.ANGLE, "Açı")
        }
        
        // Face-Face Distance (Paralelse)
        if (e1 is Face3D && e2 is Face3D) {
            val n1 = e1.normal()
            val n2 = e2.normal()
            if (abs(n1.dot(n2)) > 0.99) {
                val dist = abs(n1.dot(e2.vertices.first().subtract(e1.vertices.first())))
                return MeasurementResult(dist, "mm", MeasurementType.DISTANCE, "Mesafe")
            }
        }

        return null
    }

    private fun computeArea(vertices: List<Point3>): Double {
        if (vertices.size < 3) return 0.0
        var area = 0.0
        for (i in vertices.indices) {
            val j = (i + 1) % vertices.size
            area += vertices[i].x * vertices[j].y
            area -= vertices[j].x * vertices[i].y
        }
        return abs(area) / 2.0
    }
}
