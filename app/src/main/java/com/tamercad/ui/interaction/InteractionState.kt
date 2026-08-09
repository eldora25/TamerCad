package com.tamercad.ui.interaction

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Merkezi Etkileşim Durum Makinesi.
 */
enum class InteractionState {
    IDLE,
    STYLUS_HOVER,
    STYLUS_PRESSED,
    STYLUS_DRAWING,
    STYLUS_MANIPULATING,
    STYLUS_MEASURING,
    FINGER_NAVIGATING,
    MULTI_TOUCH_NAVIGATING,
    UI_INTERACTION,
    CANCELLED
}
