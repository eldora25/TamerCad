package com.tamercad.core.constraints

import com.tamercad.core.math.Point3
import org.json.JSONObject
import java.util.UUID
import kotlin.math.*

/**
 * İki nokta arasındaki mesafeyi sabit tutan kısıtlama.
 */
class DistanceConstraint(
    val p1: Point3,
    val p2: Point3,
    var targetDistance: Double,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "DistanceConstraint"

    override fun resolve(): Boolean {
        val currentDist = sqrt((p2.x - p1.x).pow(2) + (p2.y - p1.y).pow(2))
        if (currentDist == 0.0) return false
        
        val ratio = targetDistance / currentDist
        
        // P1'i sabit tutup P2'yi hareket ettir (Basit yaklaşım)
        p2.x = p1.x + (p2.x - p1.x) * ratio
        p2.y = p1.y + (p2.y - p1.y) * ratio
        
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        json.put("distance", targetDistance)
        return json
    }
}
