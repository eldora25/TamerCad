package com.tamercad.core.analysis

import com.tamercad.core.geometry.Solid3D
import kotlin.math.abs

/**
 * ADR-0018: Analysis Engine Architecture
 * 3D katı modellerin hacim (Volume) ve kütle özelliklerini hesaplayan analitik motor.
 */
class MassPropertiesAnalyzer {

    /**
     * Verilen 3D katı modelin yaklaşık hacmini hesaplar.
     */
    fun calculateVolume(solid: Solid3D): Double {
        var totalVolume = 0.0
        
        // Yüzeylerin (Face3D) uzaydaki koordinatlarına göre basitleştirilmiş hacim entegrasyonu
        solid.faces.forEach { face ->
            if (face.vertices.size >= 3) {
                val p0 = face.vertices[0]
                for (i in 1 until face.vertices.size - 1) {
                    val p1 = face.vertices[i]
                    val p2 = face.vertices[i + 1]
                    
                    // Tetrahedral hacim formülü (Diverkans Teoremi tabanlı)
                    val v31 = p0.x * (p1.y * p2.z - p2.y * p1.z)
                    totalVolume += abs(v31)
                }
            }
        }
        return totalVolume / 6.0
    }
}
