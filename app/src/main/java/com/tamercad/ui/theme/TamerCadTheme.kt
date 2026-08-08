package com.tamercad.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

/**
 * TamerCAD Profesyonel Tema Orkestratörü.
 * Tüm bileşenlerin merkezi renk, font ve ölçü yönetimini sağlar.
 */
private val TamerCadDarkColorScheme = darkColorScheme(
    primary = TamerCadColors.Primary,
    onPrimary = Color.White,
    secondary = TamerCadColors.Accent,
    onSecondary = Color.White,
    background = TamerCadColors.Background,
    onBackground = TamerCadColors.TextPrimary,
    surface = TamerCadColors.Surface,
    onSurface = TamerCadColors.TextPrimary,
    surfaceVariant = TamerCadColors.SurfaceElevated,
    onSurfaceVariant = TamerCadColors.TextSecondary,
    outline = TamerCadColors.PanelBorder,
    error = TamerCadColors.Error
)

@Composable
fun TamerCadTheme(
    darkTheme: Boolean = true, // CAD uygulamaları varsayılan olarak koyu temadır
    content: @Composable () -> Unit
) {
    val colorScheme = TamerCadDarkColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = TamerCadTypography,
        content = content
    )
}
