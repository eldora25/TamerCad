package com.tamercad.core.constraints

import com.tamercad.core.geometry.Line
import org.json.JSONObject
import java.util.UUID

/**
 * İki çizginin (Line) boylarını birbirine eşitleyen kısıtlama.
 */
class EqualConstraint(
    val line1: Line,
    val line2: Line,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "EqualConstraint"

    override fun resolve(): Boolean {
        val len1 = line1.length()
        val len2 = line2.length()
        if (len1 == 0.0 || len2 == 0.0) return false
        
        // Ortalamaya eşitle
        val targetLen = (len1 + len2) / 2.0
        
        // Line 1 güncelle
        val dir1 = line1.endPoint.subtract(line1.startPoint).normalize()
        line1.endPoint = line1.startPoint.add(dir1.multiply(targetLen))
        
        // Line 2 güncelle
        val dir2 = line2.endPoint.subtract(line2.startPoint).normalize()
        line2.endPoint = line2.startPoint.add(dir2.multiply(targetLen))
        
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        json.put("line1Id", line1.id)
        json.put("line2Id", line2.id)
        return json
    }
}
