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
    val mates = mutableStateListOf<IMate>()

    fun addComponent(component: Component3D) {
        components.add(component)
    }

    fun removeComponent(component: Component3D) {
        components.remove(component)
    }

    fun addMate(mate: IMate) {
        mates.add(mate)
        solveMates()
    }

    /**
     * Tüm montaj ilişkilerini (Mates) iteratif olarak çözer.
     */
    fun solveMates() {
        var iterations = 0
        val maxIterations = 5
        while (iterations < maxIterations) {
            var allResolved = true
            for (mate in mates) {
                if (!mate.solve()) allResolved = false
            }
            if (allResolved) break
            iterations++
        }
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
