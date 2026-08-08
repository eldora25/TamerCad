package com.tamercad.core.input

import com.tamercad.core.math.Point3

/**
 * ADR-0011: Input System Architecture
 * Donanım bağımsız normalleştirilmiş girdi olayı.
 */
enum class DeviceType {
    STYLUS, TOUCH, MOUSE, KEYBOARD, UNKNOWN
}

enum class EventType {
    DOWN, MOVE, UP, CANCEL, HOVER
}

data class InputEvent(
    val eventId: String,
    val deviceType: DeviceType,
    val eventType: EventType,
    val timestamp: Long,
    val position: Point3,
    val pressure: Float = 1.0f,
    val tiltX: Float = 0.0f,
    val tiltY: Float = 0.0f,
    val buttonState: Int = 0,
    val modifierKeys: Int = 0
)
