package com.tamercad.ui.components

import android.view.MotionEvent
import androidx.compose.ui.geometry.Offset
import com.tamercad.core.input.InputPeripheralsManager
import kotlin.math.sqrt

/**
 * Android Pencil ve Stylus kalemler için gelişmiş hareket ve basınç algılayıcı.
 * Shapr3D tarzı 'bekle ve düzelt' (dwell to straighten) ve 'basınçla kalınlık' özelliklerini yönetir.
 */
class PencilGestureDetector {

    private val peripheralManager = InputPeripheralsManager()
    
    var currentPressure: Float = 0f
        private set

    var isStylusActive: Boolean = false
        private set

    private var lastEventTime: Long = 0
    private val strokeHistory = mutableListOf<TimedPoint>()

    data class TimedPoint(val offset: Offset, val timestamp: Long)

    fun processMotionEvent(motionEvent: MotionEvent): Boolean {
        val data = peripheralManager.parseStylusEvent(motionEvent)
        isStylusActive = data.isStylus
        currentPressure = data.pressure
        lastEventTime = motionEvent.eventTime

        when (motionEvent.action) {
            MotionEvent.ACTION_DOWN -> {
                strokeHistory.clear()
                strokeHistory.add(TimedPoint(Offset(motionEvent.x, motionEvent.y), lastEventTime))
            }
            MotionEvent.ACTION_MOVE -> {
                strokeHistory.add(TimedPoint(Offset(motionEvent.x, motionEvent.y), lastEventTime))
            }
        }
        return isStylusActive
    }

    /**
     * Kullanıcı çizim yaparken kalemi sonunda sabit tutarsa (Dwell) true döner.
     * Bu, Shapr3D'deki gibi çizginin otomatik düzeltilmesini tetikler.
     */
    fun checkDwellCondition(thresholdMs: Long = 400, distanceThreshold: Float = 10f): Boolean {
        if (strokeHistory.size < 5) return false
        
        val now = System.currentTimeMillis()
        val lastPoint = strokeHistory.last()
        
        // Son 400ms içinde hareket çok azsa dwell sayılır
        val recentPoints = strokeHistory.filter { lastPoint.timestamp - it.timestamp < thresholdMs }
        if (recentPoints.size < 3) return false
        
        return recentPoints.all { 
            val dist = sqrt((it.offset.x - lastPoint.offset.x).pow(2) + (it.offset.y - lastPoint.offset.y).pow(2))
            dist < distanceThreshold
        }
    }

    fun clearHistory() {
        strokeHistory.clear()
    }
}

private fun Float.pow(n: Int): Float = this * this
