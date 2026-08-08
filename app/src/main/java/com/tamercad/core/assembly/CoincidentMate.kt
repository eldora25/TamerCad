package com.tamercad.core.assembly

import com.tamercad.core.math.Matrix4
import com.tamercad.core.math.Point3
import org.json.JSONObject
import java.util.UUID

/**
 * ADR-0016: Assembly System
 * İki bileşeni 3D uzayda aynı hizaya getiren (Çakıştıran) montaj ilişkisi.
 */
class CoincidentMate(
    override val componentA: Component3D,
    override val componentB: Component3D,
    val faceA: com.tamercad.core.geometry.Face3D? = null,
    val faceB: com.tamercad.core.geometry.Face3D? = null,
    override val id: String = UUID.randomUUID().toString()
) : IMate {
    
    override val type: String = "CoincidentMate"

    override fun solve(): Boolean {
        // A bileşeninin dünya koordinatlarındaki hedef noktasını bul (Varsayılan Orijin)
        val worldTarget = if (faceA != null) {
            val avg = faceA.vertices.map { it.transform(componentA.transform) }
            Point3(avg.map { it.x }.average(), avg.map { it.y }.average(), avg.map { it.z }.average())
        } else {
            Point3(0.0, 0.0, 0.0).transform(componentA.transform)
        }

        // B bileşeninin taşınacak noktasını bul
        val bSource = if (faceB != null) {
            val avg = faceB.vertices.map { it.transform(componentB.transform) }
            Point3(avg.map { it.x }.average(), avg.map { it.y }.average(), avg.map { it.z }.average())
        } else {
            Point3(0.0, 0.0, 0.0).transform(componentB.transform)
        }

        // B'yi A'ya yapıştır (Translation only for simple coincident)
        val dx = worldTarget.x - bSource.x
        val dy = worldTarget.y - bSource.y
        val dz = worldTarget.z - bSource.z

        componentB.tx += dx
        componentB.ty += dy
        componentB.tz += dz
        componentB.updateTransform()
        
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        json.put("componentA_id", componentA.id)
        json.put("componentB_id", componentB.id)
        return json
    }
}
