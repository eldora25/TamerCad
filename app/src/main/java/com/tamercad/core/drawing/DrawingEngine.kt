package com.tamercad.core.drawing

import com.tamercad.core.assembly.Assembly3D
import com.tamercad.core.geometry.Line
import com.tamercad.core.features.ExtrudeFeature
import com.tamercad.core.features.RevolveFeature
import com.tamercad.core.features.SweepFeature
import com.tamercad.core.features.LoftFeature
import com.tamercad.core.math.Point3

/**
 * ADR / İmalat Standardı: 2D Teknik Resim (2D Drawings) Pafta Üretim Motoru.
 * 3D montaj bileşenlerini Ön, Üst ve Yan görünüşler olarak 2D düzleme projeksiyon yapar.
 */
class DrawingEngine {

    data class DrawingSheet(
        val frontView: List<Line>,
        val topView: List<Line>,
        val sideView: List<Line>
    )

    fun generateSheet(assembly: Assembly3D): DrawingSheet {
        val frontLines = mutableListOf<Line>()
        val topLines = mutableListOf<Line>()
        val sideLines = mutableListOf<Line>()

        assembly.components.forEach { comp ->
            comp.features.forEach { feature ->
                val solid = when (feature) {
                    is ExtrudeFeature -> feature.generatedGeometry
                    is RevolveFeature -> feature.generatedGeometry
                    is SweepFeature -> feature.generatedGeometry
                    is LoftFeature -> feature.generatedGeometry
                    else -> null
                }

                solid?.lines?.forEach { line ->
                    val p1 = line.startPoint.transform(comp.transform)
                    val p2 = line.endPoint.transform(comp.transform)

                    // Ön Görünüş (XY Düzlemi Projeksiyonu - Z derinliği ihmal edilir)
                    frontLines.add(Line(Point3(p1.x, p1.y, 0.0), Point3(p2.x, p2.y, 0.0)))

                    // Üst Görünüş (XZ Düzlemi Projeksiyonu - Y derinliği yukarı taşınır)
                    topLines.add(Line(Point3(p1.x, p1.z, 0.0), Point3(p2.x, p2.z, 0.0)))

                    // Yan Görünüş (YZ Düzlemi Projeksiyonu)
                    sideLines.add(Line(Point3(p1.z, p1.y, 0.0), Point3(p2.z, p2.y, 0.0)))
                }
            }
        }

        return DrawingSheet(frontLines, topLines, sideLines)
    }
}
