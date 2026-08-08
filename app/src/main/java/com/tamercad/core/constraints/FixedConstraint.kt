package com.tamercad.core.constraints

import com.tamercad.core.math.Point3
import org.json.JSONObject
import java.util.UUID

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Bir noktayı veya geometriyi dünya uzayında donduran kısıtlama.
 */
class FixedConstraint(
    val point: Point3,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "FixedConstraint"
    
    // Sabitlenmiş orijinal koordinatlar
    private val fixedX = point.x
    private val fixedY = point.y
    private val fixedZ = point.z

    override fun resolve(): Boolean {
        // Noktayı her zaman kilitli olduğu koordinata geri çek
        point.x = fixedX
        point.y = fixedY
        point.z = fixedZ
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        json.put("fixedX", fixedX)
        json.put("fixedY", fixedY)
        json.put("fixedZ", fixedZ)
        return json
    }
}
