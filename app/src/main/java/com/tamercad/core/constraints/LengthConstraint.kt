package com.tamercad.core.constraints

import com.tamercad.core.geometry.Line
import org.json.JSONObject
import java.util.UUID

/**
 * Bir çizginin (Line) uzunluğunu sabit bir değere kilitleyen matematiksel kısıtlama.
 */
class LengthConstraint(
    val line: Line,
    var targetLength: Double,
    override val id: String = UUID.randomUUID().toString()
) : IConstraint {
    
    override val type: String = "LengthConstraint"

    override fun resolve(): Boolean {
        val currentLength = line.length()
        if (currentLength == 0.0) return false // Sadece bir nokta haline gelmiş çizgi çözülemez
        
        // Başlangıç noktasını sabit tutup, yön vektörünü bularak bitiş noktasını hedef uzunluğa göre yeniden hesapla
        val direction = line.endPoint.subtract(line.startPoint).normalize()
        val newVector = direction.multiply(targetLength)
        
        line.endPoint = line.startPoint.add(newVector)
        return true
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        json.put("lineId", line.id)
        json.put("targetLength", targetLength)
        return json
    }
}
