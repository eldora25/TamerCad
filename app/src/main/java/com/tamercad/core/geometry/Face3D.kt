package com.tamercad.core.geometry

import com.tamercad.core.math.Point3
import com.tamercad.core.math.Vector3

/**
 * 3D uzayda katı modelin bir yüzeyini (Poligon) temsil eder.
 */
data class Face3D(val vertices: List<Point3>) {
    
    /**
     * Işıklandırma (Gölgelendirme) için yüzeyin dikme (Normal) vektörünü hesaplar.
     * Vektörel çarpım (Cross Product) matematiği kullanılır.
     */
    fun normal(): Vector3 {
        if (vertices.size < 3) return Vector3(0.0, 0.0, 1.0)
        
        val v1 = vertices[1].subtract(vertices[0])
        val v2 = vertices[2].subtract(vertices[0])
        
        return v1.cross(v2).normalize()
    }
}
