package com.tamercad.ui.viewport

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import com.tamercad.core.math.Point3
import com.tamercad.core.math.Vector3
import com.tamercad.ui.CADViewModel
import kotlin.math.*

/**
 * 3D Manipülatör (Gizmo) Görselleştirme.
 * Seçilen nesne üzerinde X, Y, Z eksen oklarını çizer.
 */
object Manipulator3D {

    fun drawTranslationGizmo(
        drawScope: DrawScope,
        viewModel: CADViewModel,
        center: Point3,
        screenWidth: Float,
        screenHeight: Float
    ) {
        val zoom = viewModel.zoom
        val handleLength = 100.0 / zoom // Ekran boyutuna göre ölçekle
        
        val centerScreen = viewModel.worldToScreen(center, screenWidth, screenHeight)

        // Eksen Noktaları
        val xEnd = Point3(center.x + handleLength, center.y, center.z)
        val yEnd = Point3(center.x, center.y + handleLength, center.z)
        val zEnd = Point3(center.x, center.y, center.z + handleLength)

        val xScreen = viewModel.worldToScreen(xEnd, screenWidth, screenHeight)
        val yScreen = viewModel.worldToScreen(yEnd, screenWidth, screenHeight)
        val zScreen = viewModel.worldToScreen(zEnd, screenWidth, screenHeight)

        // X Ok (Kırmızı)
        drawArrow(drawScope, centerScreen, xScreen, Color.Red, zoom)
        // Y Ok (Yeşil)
        drawArrow(drawScope, centerScreen, yScreen, Color.Green, zoom)
        // Z Ok (Mavi)
        drawArrow(drawScope, centerScreen, zScreen, Color.Blue, zoom)
    }

    private fun drawArrow(drawScope: DrawScope, start: Offset, end: Offset, color: Color, zoom: Float) {
        val arrowSize = 15f * zoom
        val angle = atan2(end.y - start.y, end.x - start.x)
        
        drawScope.apply {
            // Ana Çizgi
            drawLine(color, start, end, strokeWidth = 4f * zoom)
            
            // Ok Başı
            val path = Path().apply {
                moveTo(end.x, end.y)
                lineTo(
                    end.x - arrowSize * cos(angle - PI.toFloat() / 6),
                    end.y - arrowSize * sin(angle - PI.toFloat() / 6)
                )
                lineTo(
                    end.x - arrowSize * cos(angle + PI.toFloat() / 6),
                    end.y - arrowSize * sin(angle + PI.toFloat() / 6)
                )
                close()
            }
            drawPath(path, color)
        }
    }
    
    /**
     * Ekranda dokunulan noktanın manipülatör oklarından birine çarpıp çarpmadığını kontrol eder.
     */
    fun hitTest(
        tapPos: Offset,
        viewModel: CADViewModel,
        center: Point3,
        screenWidth: Float,
        screenHeight: Float
    ): String? {
        val zoom = viewModel.zoom
        val handleLength = 100.0 / zoom
        
        val centerScreen = viewModel.worldToScreen(center, screenWidth, screenHeight)
        
        val axes = listOf(
            Triple("X", Point3(center.x + handleLength, center.y, center.z), Color.Red),
            Triple("Y", Point3(center.x, center.y + handleLength, center.z), Color.Green),
            Triple("Z", Point3(center.x, center.y, center.z + handleLength), Color.Blue)
        )
        
        for (axis in axes) {
            val endScreen = viewModel.worldToScreen(axis.second, screenWidth, screenHeight)
            if (isPointNearLine(tapPos, centerScreen, endScreen, 40f)) {
                return axis.first
            }
        }
        
        return null
    }

    private fun isPointNearLine(pt: Offset, start: Offset, end: Offset, tolerance: Float): Boolean {
        val dx = end.x - start.x
        val dy = end.y - start.y
        val mag = sqrt(dx * dx + dy * dy)
        if (mag < 1f) return pt.distanceTo(start) < tolerance
        
        val u = ((pt.x - start.x) * dx + (pt.y - start.y) * dy) / (mag * mag)
        if (u < 0 || u > 1) return pt.distanceTo(start) < tolerance || pt.distanceTo(end) < tolerance
        
        val intersectionX = start.x + u * dx
        val intersectionY = start.y + u * dy
        return sqrt((pt.x - intersectionX).pow(2) + (pt.y - intersectionY).pow(2)) < tolerance
    }
    
    private fun Offset.distanceTo(other: Offset): Float {
        return sqrt((x - other.x).pow(2) + (y - other.y).pow(2))
    }
}
