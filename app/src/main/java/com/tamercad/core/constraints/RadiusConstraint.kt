package com.tamercad.core.constraints

import com.tamercad.core.geometry.Circle3D
import com.tamercad.core.geometry.Arc3D
import com.tamercad.core.geometry.IGeometry
import org.json.JSONObject
import java.util.UUID

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Bir daire veya yayın yarıçapını (Radius) sabit bir değere kilitleyen kısıtlama.
 */
class RadiusConstraint(
    val entity: IGeometry,
    var targetRadius: Double,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "RadiusConstraint"

    override fun resolve(): Boolean {
        when (entity) {
            is Circle3D -> entity.radius = targetRadius
            is Arc3D -> entity.radius = targetRadius
            else -> return false
        }
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        json.put("targetRadius", targetRadius)
        return json
    }
}
