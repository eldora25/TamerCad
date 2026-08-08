package com.tamercad.ui.interaction

import android.view.MotionEvent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.pointer.PointerType
import com.tamercad.core.input.InputPeripheralsManager

/**
 * TamerCAD Stylus Giriş Yöneticisi.
 * Android MotionEvent'lerini alır ve bunları TamerCad StylusEvent'lerine dönüştürür.
 * Shapr3D Prensibi: Kalemle üretim, parmakla navigasyon.
 */
class StylusInputManager {
    
    private val peripheralManager = InputPeripheralsManager()

    /**
     * Ham bir MotionEvent'i analiz eder ve bir StylusEvent döner.
     */
    fun resolveEvent(event: MotionEvent): StylusEvent {
        val data = peripheralManager.parseStylusEvent(event)
        
        return StylusEvent(
            position = Offset(event.x, event.y),
            pressure = data.pressure,
            tiltX = 0f, // TODO: Get tilt from MotionEvent if available
            tiltY = 0f,
            type = if (data.isStylus) PointerType.Stylus else PointerType.Touch,
            isPrimaryButtonDown = (event.buttonState and MotionEvent.BUTTON_PRIMARY) != 0
        )
    }

    /**
     * Palm Rejection Mantığı: Stylus etkinken parmak dokunuşlarını filtreler.
     */
    fun shouldIgnoreTouch(event: StylusEvent, isStylusActive: Boolean): Boolean {
        return isStylusActive && event.type == PointerType.Touch
    }
}
