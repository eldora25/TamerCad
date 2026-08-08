package com.tamercad.ui.topbar

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.ui.theme.IconRegistry
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadDimensions

/**
 * TamerCAD Profesyonel Üst Bar.
 * Proje yönetimi, Undo/Redo ve genel ayarları içerir.
 */
@Composable
fun CADTopBar(
    projectName: String,
    onUndo: () -> Unit,
    onRedo: () -> Unit,
    onSave: () -> Unit,
    onSettings: () -> Unit,
    onHelp: () -> Unit,
    onBack: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = TamerCadDimensions.SpacingLarge, vertical = TamerCadDimensions.SpacingMedium),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        // Sol Grup: Geri, Proje Adı ve Kaydet
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(TamerCadDimensions.CornerLarge))
                .background(TamerCadColors.Surface)
                .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerLarge))
                .padding(horizontal = TamerCadDimensions.SpacingMedium, vertical = TamerCadDimensions.SpacingSmall),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack, modifier = Modifier.size(TamerCadDimensions.IconButtonSize)) {
                Icon(IconRegistry.Home, "Back", tint = Color.White, modifier = Modifier.size(TamerCadDimensions.IconSmall))
            }
            Spacer(Modifier.width(TamerCadDimensions.SpacingMedium))
            Text(projectName, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Spacer(Modifier.width(TamerCadDimensions.SpacingMedium))
            IconButton(onClick = onSave, modifier = Modifier.size(TamerCadDimensions.IconButtonSize)) {
                Icon(IconRegistry.Save, "Save", tint = Color.White, modifier = Modifier.size(TamerCadDimensions.IconSmall))
            }
        }

        // Orta Grup: Undo / Redo
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

        // Sağ Grup: Ayarlar ve Yardım
        Row(
            horizontalArrangement = Arrangement.spacedBy(TamerCadDimensions.SpacingMedium)
        ) {
            TopBarActionIcon(IconRegistry.Settings) { onSettings() }
            TopBarActionIcon(IconRegistry.Help) { onHelp() }
        }
    }
}

@Composable
fun TopBarActionIcon(icon: androidx.compose.ui.graphics.vector.ImageVector, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .size(TamerCadDimensions.IconButtonSize)
            .clip(RoundedCornerShape(TamerCadDimensions.CornerMedium))
            .background(TamerCadColors.Surface)
            .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerMedium))
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Icon(icon, null, tint = Color.White, modifier = Modifier.size(TamerCadDimensions.IconMedium))
    }
}
