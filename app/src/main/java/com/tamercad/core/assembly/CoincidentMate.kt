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
    override val id: String = UUID.randomUUID().toString()
) : IMate {
    
    override val type: String = "CoincidentMate"

    override fun solve(): Boolean {
        // A bileşeninin dünya koordinatlarındaki merkezini (Orijin) bul
        val centerA = Point3(0.0, 0.0, 0.0).transform(componentA.transform)
        
        // B bileşeninin merkezini doğrudan A'nın merkezine eşitleyecek öteleme (Translation) matrisini uygula
        // Bu işlem B'yi uzayda A'nın tam üzerine "yapıştırır".
        componentB.transform = Matrix4.translation(centerA.x, centerA.y, centerA.z)
        
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
