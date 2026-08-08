package com.tamercad.core.geometry

import com.tamercad.core.math.Point3
import com.tamercad.core.serialization.ISerializable
import org.json.JSONObject
import java.util.UUID
import kotlin.math.abs

/**
 * 3D uzayda tek parça bir daireyi temsil eder.
 * Shapr3D tarzı tek nesne seçimi ve yarıçap düzenleme için optimize edilmiştir.
 */
data class Circle3D(
    var center: Point3,
    var radius: Double,
    override val id: String = UUID.randomUUID().toString()
) : IGeometry, ISerializable {
    override val type: String = "Circle3D"
    override var isSelected: Boolean = false
    override var isFullyDefined: Boolean = false

    /**
     * Hit-testing: Noktanın daire çizgisine mesafesi.
     */
    fun distanceToPoint(p: Point3): Double {
        val distToCenter = center.distanceTo(p)
        return abs(distToCenter - radius)
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        json.put("center", JSONObject().apply {
            put("x", center.x); put("y", center.y); put("z", center.z)
        })
        json.put("radius", radius)
        return json
    }
}
