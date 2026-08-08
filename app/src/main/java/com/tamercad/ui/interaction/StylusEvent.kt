package com.tamercad.ui.interaction

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.pointer.PointerType

/**
 * TamerCAD için Stylus ve Parmak hareketlerini ayıran soyutlanmış olay modeli.
 */
data class StylusEvent(
    val position: Offset,
    val pressure: Float,
    val tiltX: Float = 0f,
    val tiltY: Float = 0f,
    val type: PointerType,
    val isPrimaryButtonDown: Boolean = false,
    val timestamp: Long = System.currentTimeMillis()
)
