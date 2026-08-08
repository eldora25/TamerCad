package com.tamercad.core.constraints

import com.tamercad.core.geometry.Circle3D
import com.tamercad.core.geometry.Arc3D
import com.tamercad.core.geometry.IGeometry
import org.json.JSONObject
import java.util.UUID

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Bir daire veya yayın çapını (Diameter) sabit bir değere kilitleyen kısıtlama.
 */
class DiameterConstraint(
    val entity: IGeometry,
    var targetDiameter: Double,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "DiameterConstraint"

    override fun resolve(): Boolean {
        val radius = targetDiameter / 2.0
        when (entity) {
            is Circle3D -> entity.radius = radius
            is Arc3D -> entity.radius = radius
            else -> return false
        }
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        json.put("targetDiameter", targetDiameter)
        return json
    }
}
