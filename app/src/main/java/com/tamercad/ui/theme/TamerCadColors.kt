package com.tamercad.ui.theme

import androidx.compose.ui.graphics.Color

/**
 * TamerCAD Merkezi Renk Sistemi.
 * Profesyonel Koyu Tema standartlarına uygun renk hiyerarşisi.
 */
object TamerCadColors {
    // Arka Plan ve Yüzeyler
    val Background = Color(0xFF16161A)
    val Surface = Color(0xFF1C1C22)
    val SurfaceVariant = Color(0xFF26262E)
    val PanelBorder = Color(0xFF2E2E36)
    
    // Marka ve Vurgu Renkleri
    val Primary = Color(0xFF4A90E2) // Aktif elemanlar
    val Accent = Color(0xFF007AFF)  // Önemli butonlar (iOS tarzı Blue)
    val Selection = Color(0xFF4A90E2).copy(alpha = 0.3f)
    
    // Teknik Renkler (Sketch)
    val Grid = Color(0xFF26262E)
    val GridThick = Color(0xFF383842)
    val Snap = Color(0xFFFF9500)
    val SketchBg = Color(0xFFF0F0F3) // Sketch modunda opsiyonel açık tema
    
    // Metin Renkleri
    val TextPrimary = Color(0xFFF3F4F6)
    val TextSecondary = Color(0xFFA1A1AA)
    
    // Durum Renkleri
    val Error = Color(0xFFEB5757)
    val Warning = Color(0xFFF2994A)
    val Success = Color(0xFF27AE60)

    // GERİYE UYUMLULUK (Legacy support for existing files)
    val BgColor = Background
    val GridColor = Grid
    val GridThickColor = GridThick
    val PanelColor = Surface
    val ActiveColor = Primary
    val SnapColor = Snap
    val TextColor = TextPrimary
    val IconColor = TextSecondary
    val SecondaryBg = SurfaceVariant
    val AccentBlue = Accent
    val SketchBgColor = SketchBg
}
