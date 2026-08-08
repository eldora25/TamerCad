package com.tamercad.ui.state

import androidx.compose.runtime.*

/**
 * TamerCAD Uygulama Ayarları State'i.
 */
class SettingsState {
    // General
    var units by mutableStateOf("mm")
    var precision by mutableStateOf(2)
    var language by mutableStateOf("Türkçe")
    var isDarkTheme by mutableStateOf(true)

    // Navigation
    var orbitSensitivity by mutableFloatStateOf(1.0f)
    var panSensitivity by mutableFloatStateOf(1.0f)
    var zoomSensitivity by mutableFloatStateOf(1.0f)
    var invertZoom by mutableStateOf(false)

    // Stylus
    var isStylusEnabled by mutableStateOf(true)
    var isPalmRejectionEnabled by mutableStateOf(true)
    var isHoverEnabled by mutableStateOf(true)

    // View
    var showGrid by mutableStateOf(true)
    var showAxes by mutableStateOf(true)
    var showShadows by mutableStateOf(true)
    var showEdges by mutableStateOf(true)
}
