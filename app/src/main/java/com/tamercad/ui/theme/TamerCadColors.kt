package com.tamercad.ui.theme

import androidx.compose.ui.graphics.Color

/**
 * TamerCAD Merkezi Renk Sistemi (Design Tokens).
 * Profesyonel Koyu Tema standartlarına uygun renk hiyerarşisi.
 */
object TamerCadColors {
    // Background & Surfaces
    val Background = Color(0xFF16161A)
    val Surface = Color(0xFF1C1C22)
    val SurfaceElevated = Color(0xFF26262E)
    val SurfacePressed = Color(0xFF2E2E36)
    val SurfaceSelected = Color(0xFF383842)
    val PanelBorder = Color(0xFF2E2E36)
    
    // Brand & Accent
    val Primary = Color(0xFF4A90E2) 
    val Accent = Color(0xFF007AFF)  
    val Selection = Color(0xFF4A90E2).copy(alpha = 0.3f)
    val SelectionColor = Color(0xFFF1C40F) // Yellow highlight
    
    // Status
    val Error = Color(0xFFEB5757)
    val Warning = Color(0xFFF2994A)
    val Success = Color(0xFF27AE60)
    
    // Typography
    val TextPrimary = Color(0xFFF3F4F6)
    val TextSecondary = Color(0xFFA1A1AA)
    
    // Technical / Viewport
    val Grid = Color(0xFF26262E)
    val GridThick = Color(0xFF383842)
    val Snap = Color(0xFFFF9500)
    val SketchBg = Color(0xFFF0F0F3) 
    
    // Axis Indicators
    val AxisX = Color(0xFFEB5757) // Red
    val AxisY = Color(0xFF27AE60) // Green
    val AxisZ = Color(0xFF4A90E2) // Blue

    // LEGACY COMPATIBILITY
    val BgColor = Background
    val GridColor = Grid
    val GridThickColor = GridThick
    val PanelColor = Surface
    val ActiveColor = Primary
    val SnapColor = Snap
    val TextColor = TextPrimary
    val IconColor = TextSecondary
    val SecondaryBg = SurfaceElevated
    val AccentBlue = Accent
    val SketchBgColor = SketchBg
}
