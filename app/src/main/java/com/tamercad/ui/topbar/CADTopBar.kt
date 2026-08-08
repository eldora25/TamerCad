package com.tamercad.ui.topbar

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.tamercad.ui.theme.IconRegistry
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadDimensions

import androidx.compose.ui.text.style.TextOverflow

/**
 * TamerCAD Profesyonel Üst Bar.
 * Proje yönetimi, Undo/Redo ve genel ayarları içerir.
 */
@Composable
fun CADTopBar(
    designName: String,
    buildNo: String,
    saveStatus: String, // "Saved", "Saving...", "Unsaved changes"
    onUndo: () -> Unit,
    onRedo: () -> Unit,
    onSave: () -> Unit,
    onSettings: () -> Unit,
    onHelp: () -> Unit,
    onAR: () -> Unit,
    onBack: () -> Unit
) {
    // Dynamic Branding String
    val branding = "TamerCadv01.$buildNo Tamer YAMAK©"
    val fullTitle = if (designName.isNotEmpty()) "$branding - $designName" else branding

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = TamerCadDimensions.SpacingLarge, vertical = TamerCadDimensions.SpacingMedium),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        // SOL: Home, Branding & Status
        Row(
            modifier = Modifier
                .weight(1f, fill = false) 
                .clip(RoundedCornerShape(TamerCadDimensions.CornerLarge))
                .background(TamerCadColors.Surface)
                .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerLarge))
                .padding(horizontal = TamerCadDimensions.SpacingMedium, vertical = TamerCadDimensions.SpacingSmall),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack, modifier = Modifier.size(TamerCadDimensions.IconButtonSize)) {
                Icon(IconRegistry.Home, "Home", tint = Color.White, modifier = Modifier.size(TamerCadDimensions.IconMedium))
            }
            Column(modifier = Modifier.padding(start = TamerCadDimensions.SpacingSmall, end = TamerCadDimensions.SpacingMedium)) {
                Text(
                    text = fullTitle,
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(saveStatus, color = TamerCadColors.TextSecondary, fontSize = 10.sp)
            }
        }

        // ORTA: Undo / Redo
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(TamerCadDimensions.CornerLarge))
                .background(TamerCadColors.Surface)
                .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerLarge))
                .padding(horizontal = TamerCadDimensions.SpacingMedium, vertical = TamerCadDimensions.SpacingSmall),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(TamerCadDimensions.SpacingSmall)
        ) {
            IconButton(onClick = onUndo, modifier = Modifier.size(TamerCadDimensions.IconButtonSize)) {
                Icon(IconRegistry.Undo, "Undo", tint = Color.White, modifier = Modifier.size(TamerCadDimensions.IconMedium))
            }
            IconButton(onClick = onRedo, modifier = Modifier.size(TamerCadDimensions.IconButtonSize)) {
                Icon(IconRegistry.Redo, "Redo", tint = Color.White, modifier = Modifier.size(TamerCadDimensions.IconMedium))
            }
        }

        // SAĞ: Save, Settings, Help
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(TamerCadDimensions.CornerLarge))
                .background(TamerCadColors.Surface)
                .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerLarge))
                .padding(horizontal = TamerCadDimensions.SpacingSmall, vertical = TamerCadDimensions.SpacingSmall),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(TamerCadDimensions.SpacingSmall)
        ) {
            IconButton(onClick = onSave, modifier = Modifier.size(TamerCadDimensions.IconButtonSize)) {
                Icon(IconRegistry.Save, "Save", tint = Color.White, modifier = Modifier.size(TamerCadDimensions.IconMedium))
            }
            IconButton(onClick = onAR, modifier = Modifier.size(TamerCadDimensions.IconButtonSize)) {
                Icon(IconRegistry.AR, "AR", tint = Color.White, modifier = Modifier.size(TamerCadDimensions.IconMedium))
            }
            IconButton(onClick = onSettings, modifier = Modifier.size(TamerCadDimensions.IconButtonSize)) {
                Icon(IconRegistry.Settings, "Settings", tint = Color.White, modifier = Modifier.size(TamerCadDimensions.IconMedium))
            }
            IconButton(onClick = onHelp, modifier = Modifier.size(TamerCadDimensions.IconButtonSize)) {
                Icon(IconRegistry.Help, "Help", tint = Color.White, modifier = Modifier.size(TamerCadDimensions.IconMedium))
            }
        }
    }
}
