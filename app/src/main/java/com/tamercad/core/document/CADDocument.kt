package com.tamercad.core.document

import com.tamercad.core.assembly.Assembly3D
import com.tamercad.core.sketch.SketchFeature
import com.tamercad.core.constraints.GCSManager
import com.tamercad.core.serialization.ISerializable
import androidx.compose.runtime.mutableStateListOf
import org.json.JSONObject
import java.util.UUID

/**
 * TamerCAD Profesyonel Doküman Modeli.
 * Tüm tasarım verilerini (Assembly, Sketches, Constraints, Units) tek bir yapı altında toplar.
 */
class CADDocument(
    var name: String = "Untitled_Design",
    val id: String = UUID.randomUUID().toString()
) : ISerializable {

    // Birimler (Units)
    var units: String = "mm"
    var precision: Int = 2

    // Ana Montaj (Bodies & Components)
    val assembly = Assembly3D(name)

    // Eskizler (Hangi düzlemde oldukları bilgisiyle)
    val sketches = mutableStateListOf<SketchFeature>()

    // Global Kısıtlama Çözücü
    val gcsManager = GCSManager()

    /**
     * Dokümanı JSON formatına serileştirir (Kaydetme için).
     */
    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("name", name)
        json.put("units", units)
        json.put("precision", precision)
        json.put("assembly", assembly.toJson())
        return json
    }
}
