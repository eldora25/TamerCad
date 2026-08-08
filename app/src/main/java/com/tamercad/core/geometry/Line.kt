package com.tamercad.core.geometry

import com.tamercad.core.math.Point3
import com.tamercad.core.serialization.ISerializable
import org.json.JSONObject
import java.util.UUID
import kotlin.math.max
import kotlin.math.min

/**
 * 3D uzayda bir doğru parçasını temsil eder.
 */
data class Line(
    var startPoint: Point3,
    var endPoint: Point3,
    override val id: String = UUID.randomUUID().toString()
) : IGeometry, ISerializable {
    override val type: String = "Line"
    
    // YENİ EKLENEN: Varsayılan olarak seçili değil
    override var isSelected: Boolean = false 
    
    // YENİ EKLENEN: Blueprints mantığı
    override var isFullyDefined: Boolean = false
    
    fun length(): Double = startPoint.distanceTo(endPoint)

    // YENİ EKLENEN: Hit-Testing (Dokunma Algılama) Matematiği
    // Verilen noktanın bu çizgiye olan en kısa dik mesafesini hesaplar
    fun distanceToPoint(p: Point3): Double {
        val dx = endPoint.x - startPoint.x
        val dy = endPoint.y - startPoint.y
        val l2 = (dx * dx) + (dy * dy) // Segment uzunluğunun karesi
        
        if (l2 == 0.0) return startPoint.distanceTo(p) // Çizgi tek bir noktadan ibaretse

        // İzdüşüm (Projection) formülü ile t skalerini bul
        var t = ((p.x - startPoint.x) * dx + (p.y - startPoint.y) * dy) / l2
        
        // t değerini [0, 1] aralığına sıkıştırarak izdüşümün çizgi segmentinin DİŞİNA taşmasını engelle
        t = max(0.0, min(1.0, t))

        val projection = Point3(
            startPoint.x + t * dx,
            startPoint.y + t * dy,
            0.0
        )
        return p.distanceTo(projection)
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("type", type)
        
        val startJson = JSONObject().apply {
            put("x", startPoint.x)
            put("y", startPoint.y)
            put("z", startPoint.z)
        }
        json.put("startPoint", startJson)
        
        val endJson = JSONObject().apply {
            put("x", endPoint.x)
            put("y", endPoint.y)
            put("z", endPoint.z)
        }
        json.put("endPoint", endJson)
        
        return json
    }
}
