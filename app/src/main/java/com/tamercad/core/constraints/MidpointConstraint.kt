package com.tamercad.core.constraints

import com.tamercad.core.geometry.Line
import com.tamercad.core.math.Point3
import org.json.JSONObject
import java.util.UUID

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Bir noktayı bir çizginin tam orta noktasına kilitleyen kısıtlama.
 */
class MidpointConstraint(
    val point: Point3,
    val line: Line,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "MidpointConstraint"

    override fun resolve(): Boolean {
        // Çizginin güncel orta noktasını hesapla
        val midX = (line.startPoint.x + line.endPoint.x) / 2.0
        val midY = (line.startPoint.y + line.endPoint.y) / 2.0
        val midZ = (line.startPoint.z + line.endPoint.z) / 2.0
        
        // Noktayı orta noktaya taşı
        point.x = midX
        point.y = midY
        point.z = midZ
        
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        json.put("lineId", line.id)
        return json
    }
}
