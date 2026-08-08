package com.tamercad.core.geometry

import com.tamercad.core.math.Point3
import com.tamercad.core.serialization.ISerializable
import org.json.JSONObject
import java.util.UUID
import kotlin.math.*

/**
 * 3D uzayda (mevcut düzlemde) tek parça bir yayı (Arc) temsil eder.
 */
data class Arc3D(
    var center: Point3,
    var radius: Double,
    var startAngle: Double, // Radyan
    var endAngle: Double,   // Radyan
    override val id: String = UUID.randomUUID().toString()
) : IGeometry, ISerializable {
    override val type: String = "Arc3D"
    override var isSelected: Boolean = false
    override var isFullyDefined: Boolean = false

    /**
     * Hit-testing: Noktanın yay çizgisine mesafesi.
     */
    fun distanceToPoint(p: Point3): Double {
        val distToCenter = center.distanceTo(p)
        val angle = atan2(p.y - center.y, p.x - center.x)
        
        // Açının yay aralığında olup olmadığını kontrol et
        if (isAngleInArc(angle)) {
            return abs(distToCenter - radius)
        }
        
        // Yay aralığında değilse uç noktalara olan mesafeye bak
        val startPt = Point3(center.x + radius * cos(startAngle), center.y + radius * sin(startAngle), 0.0)
        val endPt = Point3(center.x + radius * cos(endAngle), center.y + radius * sin(endAngle), 0.0)
        return min(p.distanceTo(startPt), p.distanceTo(endPt))
    }

    private fun isAngleInArc(a: Double): Boolean {
        var angle = a
        var s = startAngle
        var e = endAngle
        
        // Açıları [0, 2PI] aralığına normalize et
        angle = (angle % (2 * PI) + 2 * PI) % (2 * PI)
        s = (s % (2 * PI) + 2 * PI) % (2 * PI)
        e = (e % (2 * PI) + 2 * PI) % (2 * PI)
        
        return if (s < e) {
            angle in s..e
        } else {
            angle >= s || angle <= e
        }
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        json.put("center", JSONObject().apply { put("x", center.x); put("y", center.y); put("z", center.z) })
        json.put("radius", radius)
        json.put("startAngle", startAngle)
        json.put("endAngle", endAngle)
        return json
    }
}
