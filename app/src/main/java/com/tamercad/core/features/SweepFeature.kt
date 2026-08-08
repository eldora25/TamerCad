package com.tamercad.core.features

import com.tamercad.core.geometry.Face3D
import com.tamercad.core.geometry.Line
import com.tamercad.core.geometry.Solid3D
import com.tamercad.core.math.Point3
import com.tamercad.core.serialization.ISerializable
import com.tamercad.core.sketch.SketchFeature
import org.json.JSONObject
import java.util.UUID

/**
 * Gelişmiş Modelleme: Bir profilin bir yol (path) boyunca süpürülerek katı modele dönüştürülmesi.
 */
class SweepFeature(
    val profileSketch: SketchFeature,
    val pathLines: List<Line>,
    override val name: String = "Sweep",
    override var id: String = UUID.randomUUID().toString() // HATA DÜZELTİLDİ: Arayüz uyumluluğu için 'var' yapıldı
) : IFeature, ISerializable {
    
    override val type: String = "SweepFeature"
    override var isSuppressed: Boolean = false
    
    // HATA DÜZELTİLDİ: C++ Kernelinin üzerine yazabilmesi için 'private set' kaldırıldı
    var generatedGeometry: Solid3D? = null

    override fun evaluate() {
        val sweepLines = mutableListOf<Line>()
        val sweepFaces = mutableListOf<Face3D>()
        val profileLines = profileSketch.getGeometries().filterIsInstance<Line>()

        if (profileLines.isEmpty() || pathLines.isEmpty()) return

        // Basitleştirilmiş vektörel süpürme (Sweep) simülasyonu
        val translationVector = pathLines.last().endPoint.subtract(pathLines.first().startPoint)

        profileLines.forEach { baseLine ->
            val p1 = baseLine.startPoint.copy()
            val p2 = baseLine.endPoint.copy()
            val p3 = Point3(p2.x + translationVector.x, p2.y + translationVector.y, p2.z + translationVector.z)
            val p4 = Point3(p1.x + translationVector.x, p1.y + translationVector.y, p1.z + translationVector.z)

            sweepFaces.add(Face3D(listOf(p1, p2, p3, p4)))
            sweepLines.add(Line(p1, p2))
            sweepLines.add(Line(p4, p3))
            sweepLines.add(Line(p1, p4))
            sweepLines.add(Line(p2, p3))
        }

        generatedGeometry = Solid3D(sweepLines, sweepFaces)
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("name", name)
        json.put("type", type)
        json.put("profileSketch", profileSketch.toJson())
        return json
    }
}
