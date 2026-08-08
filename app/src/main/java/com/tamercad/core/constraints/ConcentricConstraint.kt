package com.tamercad.core.constraints

import com.tamercad.core.geometry.Circle3D
import com.tamercad.core.geometry.Arc3D
import com.tamercad.core.geometry.IGeometry
import com.tamercad.core.math.Point3
import org.json.JSONObject
import java.util.UUID

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * İki dairesel nesnenin merkezlerini birbirine kilitleyen kısıtlama.
 */
class ConcentricConstraint(
    val entity1: IGeometry,
    val entity2: IGeometry,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "ConcentricConstraint"

    override fun resolve(): Boolean {
        val center1 = getCenter(entity1) ?: return false
        val center2 = getCenter(entity2) ?: return false
        
        // İki merkezin ortalamasını bul ve ikisini de oraya eşitle
        val midX = (center1.x + center2.x) / 2.0
        val midY = (center1.y + center2.y) / 2.0
        val midZ = (center1.z + center2.z) / 2.0
        
        center1.x = midX; center1.y = midY; center1.z = midZ
        center2.x = midX; center2.y = midY; center2.z = midZ
        
        return true
    }
    
    private fun getCenter(geom: IGeometry): Point3? {
        return when (geom) {
            is Circle3D -> geom.center
            is Arc3D -> geom.center
            else -> null
        }
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        json.put("entity1Id", entity1.id)
        json.put("entity2Id", entity2.id)
        return json
    }
}
