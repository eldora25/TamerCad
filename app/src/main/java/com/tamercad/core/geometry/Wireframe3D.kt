package com.tamercad.core.geometry

import com.tamercad.core.serialization.ISerializable
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

/**
 * 3D uzayda katılaştırılmış nesnelerin tel kafes (kenar) görünümlerini temsil eder.
 */
data class Wireframe3D(
    val lines: List<Line>,
    override val id: String = UUID.randomUUID().toString()
) : IGeometry, ISerializable {
    
    override val type: String = "Wireframe3D"
    override var isSelected: Boolean = false
    override var isFullyDefined: Boolean = true

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        
        val linesArray = JSONArray()
        lines.forEach { linesArray.put(it.toJson()) }
        json.put("lines", linesArray)
        
        return json
    }
}
