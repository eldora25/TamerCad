package com.tamercad.core.constraints

import com.tamercad.core.geometry.Line
import com.tamercad.core.geometry.Circle3D
import com.tamercad.core.math.Point3
import org.json.JSONObject
import java.util.UUID
import kotlin.math.*

/**
 * Çizgiyi daireye teğet yapan kısıtlama.
 */
class TangentConstraint(
    val line: Line,
    val circle: Circle3D,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "TangentConstraint"

    override fun resolve(): Boolean {
        // En yakın teğet noktasını bul ve start/end'den birini oraya taşı
        // (Basitleştirilmiş: Sadece end noktasını en yakın teğet hizasına çeker)
        val center = circle.center
        val radius = circle.radius
        
        val dx = line.endPoint.x - center.x
        val dy = line.endPoint.y - center.y
        val dist = sqrt(dx*dx + dy*dy)
        if (dist == 0.0) return false
        
        line.endPoint = Point3(
            center.x + dx * radius / dist,
            center.y + dy * radius / dist,
            0.0
        )
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        return json
    }
}
