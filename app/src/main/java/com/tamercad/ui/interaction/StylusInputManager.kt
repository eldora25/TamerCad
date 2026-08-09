package com.tamercad.ui.interaction

import android.view.MotionEvent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.pointer.PointerType
import com.tamercad.core.input.InputPeripheralsManager

/**
 * TamerCAD Stylus Giriş Yöneticisi.
 * Shapr3D Prensibi: Kalemle üretim (Hard-Lock), parmakla navigasyon.
 */
class StylusInputManager {
    
    private val peripheralManager = InputPeripheralsManager()
    
    // Aktif bir kalem işlemi olup olmadığını takip eder
    private var isStylusLocked = false

    fun resolveEvent(event: MotionEvent): StylusEvent {
        val data = peripheralManager.parseStylusEvent(event)
        val type = if (data.isStylus) PointerType.Stylus else PointerType.Touch
        
        // Hard-Lock Mantığı: Kalem DOWN olduğunda kilitle, UP olduğunda bırak
        if (type == PointerType.Stylus) {
            when (event.action) {
                MotionEvent.ACTION_DOWN -> isStylusLocked = true
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> isStylusLocked = false
            }
        }

        return StylusEvent(
            position = Offset(event.x, event.y),
            pressure = data.pressure,
            tiltX = 0f,
            tiltY = 0f,
            type = type,
            isPrimaryButtonDown = (event.buttonState and MotionEvent.BUTTON_PRIMARY) != 0
        )
    }

    /**
     * Eğer kalem aktifse veya kilitliyse parmak girişlerini reddeder (Palm Rejection + Tool Safety).
     */
    fun isTouchForbidden(event: StylusEvent): Boolean {
        return (isStylusLocked || event.type == PointerType.Stylus) && event.type == PointerType.Touch
    }
    
    fun resetLock() {
        isStylusLocked = false
    }
}
