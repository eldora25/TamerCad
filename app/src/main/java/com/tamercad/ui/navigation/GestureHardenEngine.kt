package com.tamercad.ui.navigation

import androidx.compose.ui.geometry.Offset
import kotlin.math.sqrt

enum class NavigationMode {
    IDLE,
    ORBIT,
    PAN_ZOOM
}

data class NavigationResult(
    val mode: NavigationMode,
    val yawDelta: Float = 0f,
    val pitchDelta: Float = 0f,
    val panDelta: Offset = Offset.Zero,
    val zoomScale: Float = 1f
)

class GestureHardenEngine {
    private var lastCentroid: Offset? = null
    private var lastDistance: Float? = null
    private var lastSinglePoint: Offset? = null

    fun process(
        pointerCount: Int,
        pointers: List<Offset>
    ): NavigationResult {
        if (pointerCount == 0) {
            reset()
            return NavigationResult(NavigationMode.IDLE)
        }

        if (pointerCount == 1) {
            val currentPoint = pointers[0]
            val lastPoint = lastSinglePoint
            
            // Rebase if transitioning from multi-touch or start
            if (lastPoint == null) {
                lastSinglePoint = currentPoint
                lastCentroid = null
                lastDistance = null
                return NavigationResult(NavigationMode.ORBIT)
            }
            
            val delta = currentPoint - lastPoint
            lastSinglePoint = currentPoint
            
            return NavigationResult(
                mode = NavigationMode.ORBIT,
                yawDelta = delta.x * 0.005f,
                pitchDelta = -delta.y * 0.005f
            )
        }

        if (pointerCount >= 2) {
            val p1 = pointers[0]
            val p2 = pointers[1]
            
            val currentCentroid = (p1 + p2) / 2f
            val currentDistance = distance(p1, p2)
            
            val prevCentroid = lastCentroid
            val prevDistance = lastDistance
            
            // Rebase if transitioning from single-touch or start
            if (prevCentroid == null || prevDistance == null || prevDistance < 0.01f) {
                lastCentroid = currentCentroid
                lastDistance = currentDistance
                lastSinglePoint = null
                return NavigationResult(NavigationMode.PAN_ZOOM)
            }
            
            val panDelta = currentCentroid - prevCentroid
            val zoomScale = if (prevDistance > 0.001f) currentDistance / prevDistance else 1f
            
            lastCentroid = currentCentroid
            lastDistance = currentDistance
            
            return NavigationResult(
                mode = NavigationMode.PAN_ZOOM,
                panDelta = panDelta,
                zoomScale = zoomScale
            )
        }

        return NavigationResult(NavigationMode.IDLE)
    }

    fun reset() {
        lastCentroid = null
        lastDistance = null
        lastSinglePoint = null
    }

    private fun distance(p1: Offset, p2: Offset): Float {
        val dx = p1.x - p2.x
        val dy = p1.y - p2.y
        return sqrt(dx * dx + dy * dy)
    }
}
