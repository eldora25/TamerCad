package com.tamercad.core.geometry

import com.tamercad.core.serialization.ISerializable
import org.json.JSONObject
import java.util.UUID

/**
 * İçerisinde çizgiler (Edges) ve yüzeyler (Faces) barındıran 3D Katı Model.
 */
data class Solid3D(
    val lines: List<Line>,
    val faces: List<Face3D>,
    override val id: String = UUID.randomUUID().toString()
) : IGeometry, ISerializable {
    
    override val type: String = "Solid3D"
    override var isSelected: Boolean = false
    override var isFullyDefined: Boolean = true // Katılar her zaman tam tanımlı varsayılır

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        // Optimizasyon için şimdilik yüzey serileştirme atlandı, temel mimari tutuluyor.
        return json
    }
}
