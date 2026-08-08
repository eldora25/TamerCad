package com.tamercad.core.assembly

import com.tamercad.core.features.IFeature
import com.tamercad.core.math.Matrix4
import com.tamercad.core.serialization.ISerializable
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

/**
 * Montaj içindeki tekil bir parçayı (Part) temsil eder.
 */
class Component3D(
    var name: String = "Parça",
    val id: String = UUID.randomUUID().toString() 
) : ISerializable {
    
    // YENİ EKLENEN: Arayüzden seçilme durumu
    var isSelected: Boolean = false
    
    // YENİ EKLENEN: Görünürlük durumu
    var isVisible: Boolean = true
    
    // YENİ EKLENEN: Sürükleme (Drag) koordinatları
    var tx: Double = 0.0
    var ty: Double = 0.0
    var tz: Double = 0.0
    
    var transform: Matrix4 = Matrix4.identity()
    
    // Koordinatlar değiştikçe matrisi günceller
    fun updateTransform() {
        transform = Matrix4.translation(tx, ty, tz)
    }
    
    val features = mutableListOf<IFeature>()

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("name", name)
        json.put("tx", tx)
        json.put("ty", ty)
        json.put("tz", tz)
        
        val featureArray = JSONArray()
        features.forEach { if (it is ISerializable) featureArray.put(it.toJson()) }
        json.put("features", featureArray)
        
        return json
    }
}
