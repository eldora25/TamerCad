package com.tamercad.ui.interaction

import android.view.MotionEvent
import androidx.compose.ui.geometry.Offset

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Merkezi Girdi Sınıflandırıcı (InputClassifier).
 * Shapr3D Prensibi: Kalemle üretim (Hard-Lock), parmakla navigasyon.
 */
class StylusInputManager {

    // Aktif bir kalem işlemi olup olmadığını takip eder (Hard-Lock)
    private var isStylusLocked = false

    /**
     * Ham bir MotionEvent'i analiz eder ve zengin bir StylusEvent döner.
     */
    fun resolveEvent(event: MotionEvent): StylusEvent {
        val pointerIndex = event.actionIndex
        val toolType = event.getToolType(pointerIndex)
        
        // Hard-Lock Mantığı: Kalem DOWN olduğunda kilitle, UP/CANCEL olduğunda bırak
        if (toolType == MotionEvent.TOOL_TYPE_STYLUS) {
            when (event.actionMasked) {
                MotionEvent.ACTION_DOWN, MotionEvent.ACTION_POINTER_DOWN -> isStylusLocked = true
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL, MotionEvent.ACTION_POINTER_UP -> {
                    if (event.pointerCount <= 1) isStylusLocked = false
                }
            }
        }

        return StylusEvent(
            positionX = event.x,
            positionY = event.y,
            pressure = event.pressure,
            tiltX = event.getAxisValue(MotionEvent.AXIS_TILT, pointerIndex),
            tiltY = event.getAxisValue(MotionEvent.AXIS_ORIENTATION, pointerIndex), // Orientation alignment
            orientation = event.orientation,
            pointerId = event.getPointerId(pointerIndex),
            timestamp = event.eventTime,
            buttonState = event.buttonState,
            toolType = toolType,
            eventType = event.actionMasked
        )
    }

    /**
     * Palm Rejection & Lock: Kalem kilitliyse parmak girişlerini CAD dünyasına sokmaz.
     */
    fun isTouchForbidden(event: StylusEvent): Boolean {
        // Kural: Kalem Down ise veya kalem kilitliyse parmak (Touch) yasaktır.
        return (isStylusLocked || event.toolType == MotionEvent.TOOL_TYPE_STYLUS) && 
               event.toolType == MotionEvent.TOOL_TYPE_FINGER
    }

    fun isStylusActive(): Boolean = isStylusLocked
    
    fun resetLock() {
        isStylusLocked = false
    }
}
