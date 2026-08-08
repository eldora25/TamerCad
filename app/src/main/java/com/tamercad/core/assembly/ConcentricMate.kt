package com.tamercad.core.assembly

import org.json.JSONObject
import java.util.UUID

/**
 * İki bileşenin dairesel merkezlerini aynı eksene getiren montaj ilişkisi.
 */
class ConcentricMate(
    override val componentA: Component3D,
    override val componentB: Component3D,
    override val id: String = UUID.randomUUID().toString()
) : IMate {
    override val type: String = "ConcentricMate"

    override fun solve(): Boolean {
        // TODO: Implement axis alignment logic
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
