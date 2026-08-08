package com.tamercad.core.assembly

import androidx.compose.runtime.mutableStateListOf
import com.tamercad.core.serialization.ISerializable
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

/**
 * Birden fazla bileşenin bir araya gelerek oluşturduğu Montaj (Assembly) grubu.
 */
class Assembly3D(
    var name: String = "Ana Montaj",
    val id: String = UUID.randomUUID().toString() // HATA DÜZELTİLDİ: 'override' kelimesi kaldırıldı
) : ISerializable {
    
    val components = mutableStateListOf<Component3D>()
    val mates = mutableListOf<IMate>()

    fun addComponent(component: Component3D) {
        components.add(component)
    }

    fun removeComponent(component: Component3D) {
        components.remove(component)
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("name", name)
        
        val compArray = JSONArray()
        components.forEach { compArray.put(it.toJson()) }
        json.put("components", compArray)
        
        return json
    }
}
