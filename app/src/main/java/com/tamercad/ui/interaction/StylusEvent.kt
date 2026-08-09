package com.tamercad.ui.interaction

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.pointer.PointerType

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Zenginleştirilmiş Stylus ve Dokunmatik Olay Modeli.
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
    val toolType: Int, // Android MotionEvent.getToolType()
    val eventType: Int // MotionEvent.ACTION_*
) {
    val position: Offset get() = Offset(positionX, positionY)
    val isStylus: Boolean get() = toolType == 2 // TOOL_TYPE_STYLUS
}
