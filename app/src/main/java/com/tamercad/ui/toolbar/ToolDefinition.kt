package com.tamercad.ui.toolbar

import androidx.compose.ui.graphics.vector.ImageVector

/**
 * TamerCAD Araç Tanımlama Modeli.
 * Her bir aracın metadata bilgilerini tutar.
 */
data class ToolDefinition(
    val id: String,
    val label: String,
    val icon: ImageVector,
    val commandId: String? = null,
    val enabled: Boolean = true,
    val visible: Boolean = true,
    val tooltip: String? = null
)
