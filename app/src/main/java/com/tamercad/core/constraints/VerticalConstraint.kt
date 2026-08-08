package com.tamercad.core.constraints

import com.tamercad.core.geometry.Line
import org.json.JSONObject
import java.util.UUID

/**
 * Çizgiyi dikey eksene kilitleyen kısıtlama.
 */
class VerticalConstraint(
    val line: Line,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "VerticalConstraint"

    override fun resolve(): Boolean {
        // Start noktasını sabit tut, end noktasının X değerini start ile aynı yap
        line.endPoint.x = line.startPoint.x
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        return json
    }
}
