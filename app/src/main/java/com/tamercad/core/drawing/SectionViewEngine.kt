package com.tamercad.core.drawing

import com.tamercad.core.assembly.Assembly3D
import com.tamercad.core.geometry.Line
import com.tamercad.core.features.ExtrudeFeature
import com.tamercad.core.features.RevolveFeature
import com.tamercad.core.features.SweepFeature
import com.tamercad.core.features.LoftFeature
import com.tamercad.core.math.Point3

/**
 * İmalat Standardı: Kesit Görünümü (Section View) ve Detay Pafta Motoru.
 */
class SectionViewEngine {

    /**
     * Verilen kesit düzlemine (Z ekseni derinliği) göre modelin kesit çizgilerini hesaplar.
     */
    fun generateSectionView(assembly: Assembly3D, sectionZ: Double): List<Line> {
        val sectionLines = mutableListOf<Line>()

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

                    // Kesit düzlemini kesen çizgileri filtrele ve 2D düzleme projeksiyon yap
                    if ((p1.z <= sectionZ && p2.z >= sectionZ) || (p1.z >= sectionZ && p2.z <= sectionZ)) {
                        sectionLines.add(Line(Point3(p1.x, p1.y, 0.0), Point3(p2.x, p2.y, 0.0)))
                    }
                }
            }
        }
        return sectionLines
    }
}
