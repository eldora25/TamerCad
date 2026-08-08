package com.tamercad.core.features

import com.tamercad.core.geometry.Face3D
import com.tamercad.core.geometry.Line
import com.tamercad.core.geometry.Solid3D
import com.tamercad.core.serialization.ISerializable
import com.tamercad.core.sketch.SketchFeature
import org.json.JSONObject
import java.util.UUID

/**
 * Gelişmiş Modelleme: İki farklı kesiti (Sketch) birbirine bağlayarak geçişli 3D form oluşturma (Loft).
 */
class LoftFeature(
    val sketchA: SketchFeature,
    val sketchB: SketchFeature,
    override val name: String = "Loft",
    override var id: String = UUID.randomUUID().toString() // HATA DÜZELTİLDİ: Arayüz uyumluluğu için 'var' yapıldı
) : IFeature, ISerializable {
    
    override val type: String = "LoftFeature"
    override var isSuppressed: Boolean = false
    
    // HATA DÜZELTİLDİ: C++ Kernelinin üzerine yazabilmesi için 'private set' kaldırıldı
    var generatedGeometry: Solid3D? = null

    override fun evaluate() {
        val loftLines = mutableListOf<Line>()
        val loftFaces = mutableListOf<Face3D>()
        val linesA = sketchA.getGeometries().filterIsInstance<Line>()
        val linesB = sketchB.getGeometries().filterIsInstance<Line>()

        if (linesA.isEmpty() || linesB.isEmpty()) return

        val p1 = linesA.first().startPoint
        val p2 = linesA.first().endPoint
        val p3 = linesB.first().endPoint
        val p4 = linesB.first().startPoint

        loftFaces.add(Face3D(listOf(p1, p2, p3, p4)))
        loftLines.add(Line(p1, p2))
        loftLines.add(Line(p2, p3))
        loftLines.add(Line(p3, p4))
        loftLines.add(Line(p4, p1))

        generatedGeometry = Solid3D(loftLines, loftFaces)
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("name", name)
        json.put("type", type)
        return json
    }
}
