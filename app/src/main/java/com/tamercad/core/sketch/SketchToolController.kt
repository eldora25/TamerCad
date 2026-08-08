package com.tamercad.core.sketch

import com.tamercad.core.geometry.Line
import com.tamercad.core.math.Point3

/**
 * Shapr3D Standartlarında Android Kalem (Stylus) ve Dokunmatik Çizim Kontrolcüsü.
 */
class SketchToolController {
    var isDrawingActive: Boolean = false
    private val drawnLines = mutableListOf<Line>()

    fun handleStylusInput(x: Float, y: Float, pressure: Float, isDown: Boolean) {
        if (isDown) {
            isDrawingActive = true
            // Kalem basıncına duyarlı çizim başlatma mantığı (Gelecek C++ entegrasyonu için ayrılmıştır)
        } else {
            isDrawingActive = false
        }
    }

    fun getGeometries(): List<Line> = drawnLines
    
    fun clear() {
        drawnLines.clear()
    }
}
