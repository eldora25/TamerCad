package com.tamercad.core.constraints

import com.tamercad.core.geometry.Line
import com.tamercad.core.math.Point3
import org.json.JSONObject
import java.util.UUID
import kotlin.math.*

/**
 * İki çizginin (Line) birbirine dik (90 derece) olmasını sağlayan kısıtlama.
 */
class PerpendicularConstraint(
    val line1: Line,
    val line2: Line,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "PerpendicularConstraint"

    override fun resolve(): Boolean {
        // Line 1'in açısını baz al
        val dx1 = line1.endPoint.x - line1.startPoint.x
        val dy1 = line1.endPoint.y - line1.startPoint.y
        val angle1 = atan2(dy1, dx1)
        
        // Hedef açı: angle1 + 90 derece
        val targetAngle = angle1 + PI / 2.0
        
        // Line 2'yi bu açıya göre düzelt (merkez noktasını koruyarak veya start'ı sabit tutarak)
        val len2 = line2.length()
        if (len2 == 0.0) return false
        
        line2.endPoint = Point3(
            line2.startPoint.x + len2 * cos(targetAngle),
            line2.startPoint.y + len2 * sin(targetAngle),
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
