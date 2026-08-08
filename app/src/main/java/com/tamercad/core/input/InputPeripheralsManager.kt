package com.tamercad.core.input

import android.view.MotionEvent

class InputPeripheralsManager {
    data class StylusInputData(
        val pressure: Float,
        val tiltX: Float,
        val tiltY: Float,
        val isStylus: Boolean
    )

    fun parseStylusEvent(event: MotionEvent): StylusInputData {
        val isStylus = event.getToolType(0) == MotionEvent.TOOL_TYPE_STYLUS || 
                       event.getToolType(0) == MotionEvent.TOOL_TYPE_ERASER
        
        val pressure = if (isStylus) event.pressure else 1.0f
        val tiltX = if (isStylus) event.getAxisValue(MotionEvent.AXIS_TILT) else 0f
        val tiltY = if (isStylus) event.getAxisValue(MotionEvent.AXIS_ORIENTATION) else 0f

        return StylusInputData(pressure, tiltX, tiltY, isStylus)
    }

    fun parseSpaceMouseOrTrackpad(deltaX: Float, deltaY: Float, scrollWheel: Float): Triple<Float, Float, Float> {
        val yawDelta = deltaX * 0.015f
        val pitchDelta = -deltaY * 0.015f
        val zoomDelta = 1.0f + (scrollWheel * 0.05f)
        return Triple(yawDelta, pitchDelta, zoomDelta)
    }
}
