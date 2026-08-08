package com.tamercad.core.constraints

import com.tamercad.core.geometry.Line
import org.json.JSONObject
import java.util.UUID

/**
 * Çizgiyi yatay eksene kilitleyen kısıtlama.
 */
class HorizontalConstraint(
    val line: Line,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "HorizontalConstraint"

    override fun resolve(): Boolean {
        // Start noktasını sabit tut, end noktasının Y değerini start ile aynı yap
        line.endPoint.y = line.startPoint.y
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        return json
    }
}
