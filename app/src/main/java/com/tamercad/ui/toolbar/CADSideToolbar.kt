package com.tamercad.ui.toolbar

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.tamercad.ui.theme.IconRegistry
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadDimensions

/**
 * TamerCAD Profesyonel Tablet Tool Rail.
 * Sadece ana kategorileri dikey bir şeritte gösterir.
 */
@Composable
fun CADSideToolbar(
    activeCategory: ToolbarCategory,
    isSketchMode: Boolean = false,
    onCategoryClick: (ToolbarCategory) -> Unit,
    onExitSketch: (Boolean) -> Unit
) {
    Column(
        modifier = Modifier
            .padding(start = TamerCadDimensions.SpacingMedium, top = 80.dp)
            .width(64.dp) 
            .wrapContentHeight()
            .clip(RoundedCornerShape(TamerCadDimensions.CornerLarge))
            .background(TamerCadColors.Surface)
            .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerLarge))
            .shadow(TamerCadDimensions.ElevationLow)
            .padding(vertical = TamerCadDimensions.SpacingMedium),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        if (isSketchMode) {
            ToolRailItem(IconRegistry.Save, "Done", false, TamerCadColors.Success) { onExitSketch(true) }
            ToolRailItem(IconRegistry.Delete, "Cancel", false, TamerCadColors.Error) { onExitSketch(false) }
            HorizontalDivider(modifier = Modifier.width(32.dp), color = TamerCadColors.PanelBorder)
        }
        
        ToolRailItem(IconRegistry.Select, "Select", activeCategory == ToolbarCategory.SELECT) { onCategoryClick(ToolbarCategory.SELECT) }
        ToolRailItem(IconRegistry.Sketch, "Sketch", activeCategory == ToolbarCategory.SKETCH) { onCategoryClick(ToolbarCategory.SKETCH) }
        ToolRailItem(IconRegistry.Create, "Create", activeCategory == ToolbarCategory.CREATE) { onCategoryClick(ToolbarCategory.CREATE) }
        ToolRailItem(IconRegistry.Modify, "Modify", activeCategory == ToolbarCategory.MODIFY) { onCategoryClick(ToolbarCategory.MODIFY) }
        ToolRailItem(IconRegistry.Construct, "Construct", activeCategory == ToolbarCategory.CONSTRUCT) { onCategoryClick(ToolbarCategory.CONSTRUCT) }
        ToolRailItem(IconRegistry.Measure, "Measure", activeCategory == ToolbarCategory.MEASURE) { onCategoryClick(ToolbarCategory.MEASURE) }
        ToolRailItem(IconRegistry.Inspect, "Items", activeCategory == ToolbarCategory.INSPECT) { onCategoryClick(ToolbarCategory.INSPECT) }
    }
}

@Composable
private fun ToolRailItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    isSelected: Boolean,
    tint: Color? = null,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .size(48.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(if (isSelected) TamerCadColors.Primary.copy(alpha = 0.2f) else Color.Transparent)
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Icon(
            icon,
            contentDescription = label,
            tint = tint ?: (if (isSelected) TamerCadColors.Primary else TamerCadColors.TextSecondary),
            modifier = Modifier.size(24.dp)
        )
    }
}

enum class ToolbarCategory {
    SELECT, SKETCH, CREATE, MODIFY, CONSTRUCT, MEASURE, INSPECT, NONE
}
