package com.tamercad.ui.interaction

import android.view.MotionEvent
import androidx.compose.ui.geometry.Offset

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Gerçek Donanım Verilerini Taşıyan Stylus Modeli.
 */
data class StylusEvent(
    val positionX: Float,
    val positionY: Float,
    val pressure: Float,
    val tiltX: Float,
    val tiltY: Float,
    val orientation: Float,
    val pointerId: Int,
    val timestamp: Long,
    val buttonState: Int,
    val toolType: Int,
    val eventType: Int
) {
    val position: Offset get() = Offset(positionX, positionY)
    
    // Donanımsal toolType 2 = STYLUS
    val isStylus: Boolean get() = toolType == MotionEvent.TOOL_TYPE_STYLUS
    val isFinger: Boolean get() = toolType == MotionEvent.TOOL_TYPE_FINGER
}
