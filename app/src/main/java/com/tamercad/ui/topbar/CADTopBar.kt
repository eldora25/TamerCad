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
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        // Sol Grup: Geri, Proje Adı ve Kaydet
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(24.dp))
                .background(TamerCadColors.PanelColor)
                .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(24.dp))
                .padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack, modifier = Modifier.size(32.dp)) {
                Icon(IconRegistry.Home, "Back", tint = Color.White, modifier = Modifier.size(20.dp))
            }
            Spacer(Modifier.width(8.dp))
            Text(projectName, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Spacer(Modifier.width(8.dp))
            IconButton(onClick = onSave, modifier = Modifier.size(32.dp)) {
                Icon(IconRegistry.Save, "Save", tint = Color.White, modifier = Modifier.size(20.dp))
            }
        }

        // Orta Grup: Undo / Redo
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(24.dp))
                .background(TamerCadColors.PanelColor)
                .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(24.dp))
                .padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            IconButton(onClick = onUndo, modifier = Modifier.size(40.dp)) {
                Icon(IconRegistry.Undo, "Undo", tint = Color.White, modifier = Modifier.size(24.dp))
            }
            IconButton(onClick = onRedo, modifier = Modifier.size(40.dp)) {
                Icon(IconRegistry.Redo, "Redo", tint = Color.White, modifier = Modifier.size(24.dp))
            }
        }

        // Sağ Grup: Ayarlar ve Yardım
        Row(
            horizontalArrangement = Arrangement.spacedBy(12.dp)
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
            .size(36.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(TamerCadColors.PanelColor)
            .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(10.dp))
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Icon(icon, null, tint = Color.White, modifier = Modifier.size(20.dp))
    }
}
