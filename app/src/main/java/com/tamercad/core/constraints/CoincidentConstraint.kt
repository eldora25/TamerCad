package com.tamercad.core.constraints

import com.tamercad.core.math.Point3
import org.json.JSONObject
import java.util.UUID

/**
 * İki noktayı aynı koordinata kilitleyen kısıtlama.
 */
class CoincidentConstraint(
    val p1: Point3,
    val p2: Point3,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "CoincidentConstraint"

    override fun resolve(): Boolean {
        // İki noktanın ortalamasını bul ve ikisini de oraya çek
        val midX = (p1.x + p2.x) / 2.0
        val midY = (p1.y + p2.y) / 2.0
        val midZ = (p1.z + p2.z) / 2.0
        
        p1.x = midX; p1.y = midY; p1.z = midZ
        p2.x = midX; p2.y = midY; p2.z = midZ
        
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        return json
    }
}
