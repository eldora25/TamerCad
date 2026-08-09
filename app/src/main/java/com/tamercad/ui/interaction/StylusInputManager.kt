package com.tamercad.ui.interaction

import android.view.MotionEvent
import android.util.Log

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Donanım Odaklı Girdi Sınıflandırıcı (InputClassifier).
 * Shapr3D Prensibi: Kalemle üretim, parmakla navigasyon.
 */
class StylusInputManager {

    private var isStylusActive = false

    fun resolveEvent(event: MotionEvent): StylusEvent {
        val pointerIndex = event.actionIndex
        val toolType = event.getToolType(pointerIndex)
        
        // --- REAL DEVICE LOGGING ---
        if (toolType == MotionEvent.TOOL_TYPE_STYLUS) {
            Log.d("TAMERCAD_INPUT", "STYLUS: Action=${event.actionMasked} x=${event.x} y=${event.y} pressure=${event.pressure}")
        }

        // Hard-Lock: Kalem ekrana değdiği an parmak girişleri fiziksel olarak bloklanır.
        if (toolType == MotionEvent.TOOL_TYPE_STYLUS) {
            when (event.actionMasked) {
                MotionEvent.ACTION_DOWN, MotionEvent.ACTION_POINTER_DOWN -> isStylusActive = true
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> isStylusActive = false
            }
        }

        return StylusEvent(
            positionX = event.x,
            positionY = event.y,
            pressure = event.pressure,
            tiltX = event.getAxisValue(MotionEvent.AXIS_TILT, pointerIndex),
            tiltY = event.getAxisValue(MotionEvent.AXIS_ORIENTATION, pointerIndex),
            orientation = event.orientation,
            pointerId = event.getPointerId(pointerIndex),
            timestamp = event.eventTime,
            buttonState = event.buttonState,
            toolType = toolType,
            eventType = event.actionMasked,
            pointerCount = event.pointerCount
        )
    }

    /**
     * Palm Rejection: Kalem kilitliyken veya aktifken gelen FINGER olaylarını durdurur.
     * Ancak navigasyon için birden fazla parmağa izin verir.
     */
    fun isTouchForbidden(event: StylusEvent): Boolean {
        // Explicit Palm Tool Type rejection (5 is MotionEvent.TOOL_TYPE_PALM since API 29)
        if (event.toolType == 5) return true

        // Eğer 1'den fazla pointer varsa (Multi-touch navigation), engelleme.
        if (event.pointerCount > 1) return false
        
        // Sadece tek parmak dokunuşu (Palm veya kaza eseri dokunuş) kalem aktifken engellenir.
        return (isStylusActive || event.toolType == MotionEvent.TOOL_TYPE_STYLUS) && 
               event.toolType == MotionEvent.TOOL_TYPE_FINGER
    }

    fun isStylusLocked(): Boolean = isStylusActive
}
