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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.ui.theme.IconRegistry
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadDimensions
import com.tamercad.ui.viewport.ViewportPolicy
import androidx.compose.ui.text.style.TextOverflow

/**
 * TamerCAD Profesyonel Üst Bar Bileşenleri.
 */

@Composable
fun DocumentHeader(
    designName: String,
    buildNo: String,
    saveStatus: String,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val branding = "TC_v0.1.$buildNo" // More compact branding
    val displayTitle = if (designName.isNotEmpty()) "$branding - $designName" else branding

    Row(
        modifier = modifier
            .height(36.dp)
            .widthIn(max = 240.dp) // Limit width to avoid tool palette overlap
            .clip(RoundedCornerShape(TamerCadDimensions.CornerMedium))
            .background(TamerCadColors.Surface)
            .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerMedium))
            .padding(horizontal = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onBack, modifier = Modifier.size(32.dp)) {
            Icon(IconRegistry.Home, "Home", tint = Color.White, modifier = Modifier.size(18.dp))
        }
        Column(
            modifier = Modifier.padding(start = 2.dp, end = 4.dp),
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = displayTitle,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 10.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Text(saveStatus, color = TamerCadColors.TextSecondary, fontSize = 8.sp, maxLines = 1)
        }
    }
}

@Composable
fun UndoRedoBar(
    onUndo: () -> Unit,
    onRedo: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .height(36.dp)
            .clip(RoundedCornerShape(TamerCadDimensions.CornerMedium))
            .background(TamerCadColors.Surface)
            .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerMedium))
            .padding(horizontal = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(2.dp)
    ) {
        IconButton(onClick = onUndo, modifier = Modifier.size(32.dp)) {
            Icon(IconRegistry.Undo, "Undo", tint = Color.White, modifier = Modifier.size(18.dp))
        }
        IconButton(onClick = onRedo, modifier = Modifier.size(32.dp)) {
            Icon(IconRegistry.Redo, "Redo", tint = Color.White, modifier = Modifier.size(18.dp))
        }
    }
}

@Composable
fun GlobalToolbar(
    onSave: () -> Unit,
    onAR: () -> Unit,
    onSettings: () -> Unit,
    onHelp: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .height(36.dp)
            .clip(RoundedCornerShape(TamerCadDimensions.CornerMedium))
            .background(TamerCadColors.Surface)
            .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerMedium))
            .padding(horizontal = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(2.dp)
    ) {
        IconButton(onClick = onSave, modifier = Modifier.size(32.dp)) {
            Icon(IconRegistry.Save, "Save", tint = Color.White, modifier = Modifier.size(18.dp))
        }
        IconButton(onClick = onAR, modifier = Modifier.size(32.dp)) {
            Icon(IconRegistry.AR, "AR", tint = Color.White, modifier = Modifier.size(18.dp))
        }
        IconButton(onClick = onSettings, modifier = Modifier.size(32.dp)) {
            Icon(IconRegistry.Settings, "Settings", tint = Color.White, modifier = Modifier.size(18.dp))
        }
        IconButton(onClick = onHelp, modifier = Modifier.size(32.dp)) {
            Icon(IconRegistry.Help, "Help", tint = Color.White, modifier = Modifier.size(18.dp))
        }
    }
}
