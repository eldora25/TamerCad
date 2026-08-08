package com.tamercad.core.analysis

import androidx.compose.ui.graphics.Color
import com.tamercad.core.geometry.Face3D
import com.tamercad.core.math.Vector3
import kotlin.math.*

/**
 * Yüzey kalitesini (G0, G1, G2 sürekliliği) ölçmek için Zebra şeritleri algoritması.
 */
object ZebraAnalysis {

    /**
     * Verilen normal vektörü ve bakış açısına göre Zebra rengini döner.
     */
    fun getZebraColor(normal: Vector3, viewDir: Vector3): Color {
        // Işık yansıması simülasyonu
        val stripes = 10.0
        val intensity = (normal.dot(viewDir) + 1.0) / 2.0
        val stripeValue = (sin(intensity * PI * stripes) + 1.0) / 2.0
        
        return if (stripeValue > 0.5) Color.Black else Color.White
    }
}
