package com.tamercad.ui.selection

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadDimensions
import com.tamercad.ui.viewport.ViewportPolicy

/**
 * TamerCAD Seçim Filtre Paneli.
 * Kullanıcının hangi geometri tiplerini seçebileceğini belirlemesini sağlar.
 */
@Composable
fun SelectionFilterPanel(
    manager: SelectionManager,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .width(ViewportPolicy.SelectionFilterWidth)
            .wrapContentHeight()
            .clip(RoundedCornerShape(TamerCadDimensions.CornerLarge))
            .background(TamerCadColors.Surface.copy(alpha = 0.9f))
            .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerLarge))
            .shadow(TamerCadDimensions.ElevationLow)
            .padding(vertical = TamerCadDimensions.SpacingMedium),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Multi-Select Toggle
        FilterToggleItem(
            icon = Icons.Default.Layers,
            isSelected = manager.isMultiSelectMode,
            onClick = { manager.isMultiSelectMode = !manager.isMultiSelectMode },
            tint = if (manager.isMultiSelectMode) TamerCadColors.Primary else TamerCadColors.TextSecondary
        )
        
        Divider(modifier = Modifier.width(32.dp), color = TamerCadColors.PanelBorder)

        // Filters
        FilterToggleItem(Icons.Default.Adjust, manager.showVertices, { manager.showVertices = !manager.showVertices })
        FilterToggleItem(Icons.Default.ShowChart, manager.showEdges, { manager.showEdges = !manager.showEdges })
        FilterToggleItem(Icons.Default.CropFree, manager.showFaces, { manager.showFaces = !manager.showFaces })
        FilterToggleItem(Icons.Default.ViewInAr, manager.showBodies, { manager.showBodies = !manager.showBodies })
        FilterToggleItem(Icons.Default.AutoFixHigh, manager.showSketches, { manager.showSketches = !manager.showSketches })
    }
}

@Composable
private fun FilterToggleItem(
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit,
    tint: Color? = null
) {
    IconButton(
        onClick = onClick,
        modifier = Modifier
            .size(40.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(if (isSelected && tint == null) TamerCadColors.Primary.copy(alpha = 0.2f) else Color.Transparent)
    ) {
        Icon(
            icon,
            contentDescription = null,
            tint = tint ?: (if (isSelected) TamerCadColors.Primary else TamerCadColors.TextSecondary),
            modifier = Modifier.size(20.dp)
        )
    }
}
