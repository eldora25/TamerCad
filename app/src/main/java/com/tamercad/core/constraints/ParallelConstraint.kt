package com.tamercad.core.constraints

import com.tamercad.core.geometry.Line
import com.tamercad.core.math.Point3
import org.json.JSONObject
import java.util.UUID
import kotlin.math.*

/**
 * İki çizginin birbirine paralel olmasını sağlayan kısıtlama.
 */
class ParallelConstraint(
    val line1: Line,
    val line2: Line,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "ParallelConstraint"

    override fun resolve(): Boolean {
        // Line 1'in açısını baz al
        val dx1 = line1.endPoint.x - line1.startPoint.x
        val dy1 = line1.endPoint.y - line1.startPoint.y
        val angle1 = atan2(dy1, dx1)
        
        // Line 2'yi aynı açıya getir
        val len2 = line2.length()
        if (len2 == 0.0) return false
        
        line2.endPoint = Point3(
            line2.startPoint.x + len2 * cos(angle1),
            line2.startPoint.y + len2 * sin(angle1),
            0.0
        )
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        return json
    }
}
