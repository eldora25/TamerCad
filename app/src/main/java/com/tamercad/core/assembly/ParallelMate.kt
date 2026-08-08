package com.tamercad.core.assembly

import org.json.JSONObject
import java.util.UUID

/**
 * İki bileşenin belirtilen yüzeylerini birbirine paralel tutan montaj ilişkisi.
 */
class ParallelMate(
    override val componentA: Component3D,
    override val componentB: Component3D,
    override val id: String = UUID.randomUUID().toString()
) : IMate {
    override val type: String = "ParallelMate"

    override fun solve(): Boolean {
        // TODO: Implement normal alignment logic
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
