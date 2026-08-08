package com.tamercad.core.constraints

import com.tamercad.core.geometry.Line
import com.tamercad.core.math.Point3
import org.json.JSONObject
import java.util.UUID
import kotlin.math.*

/**
 * İki çizgi arasındaki açıyı sabit tutan kısıtlama.
 */
class AngleConstraint(
    val line1: Line,
    val line2: Line,
    var targetAngleRad: Double,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "AngleConstraint"

    override fun resolve(): Boolean {
        // Line 1'in açısını baz al
        val angle1 = atan2(line1.endPoint.y - line1.startPoint.y, line1.endPoint.x - line1.startPoint.x)
        val targetAngle2 = angle1 + targetAngleRad
        
        val len2 = line2.length()
        if (len2 == 0.0) return false
        
        line2.endPoint = Point3(
            line2.startPoint.x + len2 * cos(targetAngle2),
            line2.startPoint.y + len2 * sin(targetAngle2),
            0.0
        )
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        json.put("targetAngle", targetAngleRad)
        return json
    }
}
