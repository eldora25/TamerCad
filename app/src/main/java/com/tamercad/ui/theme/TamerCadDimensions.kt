package com.tamercad.ui.theme

import androidx.compose.ui.unit.dp

/**
 * TamerCAD Tablet Öncelikli Ölçü Sistemi.
 * Shapr3D Prensibi: Minimum 44dp dokunma alanı.
 */
object TamerCadDimensions {
    // Dokunma Hedefleri
    val TouchTargetMin = 44.dp
    val IconButtonSize = 48.dp
    val CategoryButtonSize = 64.dp
    
    // Paneller
    val SideToolbarWidth = 72.dp
    val TopBarHeight = 56.dp
    val ContextToolbarHeight = 80.dp
    val BrowserWidth = 240.dp
    
    // Boşluklar (Spacing)
    val PaddingSmall = 4.dp
    val PaddingMedium = 8.dp
    val PaddingLarge = 16.dp
    val PaddingExtraLarge = 24.dp
    
    // Köşe Yuvarlatma
    val CornerSmall = 4.dp
    val CornerMedium = 12.dp
    val CornerLarge = 24.dp
    val CornerExtraLarge = 36.dp // SideToolbar ve ContextToolbar için
}
