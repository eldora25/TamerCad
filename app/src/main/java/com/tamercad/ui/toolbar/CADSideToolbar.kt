package com.tamercad.ui.toolbar

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.unit.dp
import com.tamercad.ui.components.LabeledSidebarIconButton
import com.tamercad.ui.theme.IconRegistry
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadDimensions

/**
 * TamerCAD Profesyonel Tablet Side Toolbar.
 * Ana araç kategorilerini barındırır.
 */
@Composable
fun CADSideToolbar(
    activeCategory: ToolbarCategory,
    onCategoryClick: (ToolbarCategory) -> Unit
) {
    Column(
        modifier = Modifier
            .padding(start = TamerCadDimensions.SpacingMedium, top = 80.dp, bottom = TamerCadDimensions.SpacingExtraLarge)
            .width(TamerCadDimensions.SideToolbarWidth)
            .fillMaxHeight()
            .clip(RoundedCornerShape(TamerCadDimensions.CornerExtraLarge))
            .background(TamerCadColors.Surface)
            .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerExtraLarge))
            .shadow(TamerCadDimensions.ElevationMedium)
            .padding(vertical = TamerCadDimensions.SpacingExtraLarge),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(TamerCadDimensions.SpacingLarge)
    ) {
        LabeledSidebarIconButton(IconRegistry.Select, "Select", activeCategory == ToolbarCategory.SELECT) { onCategoryClick(ToolbarCategory.SELECT) }
        LabeledSidebarIconButton(IconRegistry.Sketch, "Sketch", activeCategory == ToolbarCategory.SKETCH) { onCategoryClick(ToolbarCategory.SKETCH) }
        LabeledSidebarIconButton(IconRegistry.Create, "Create", activeCategory == ToolbarCategory.CREATE) { onCategoryClick(ToolbarCategory.CREATE) }
        LabeledSidebarIconButton(IconRegistry.Modify, "Modify", activeCategory == ToolbarCategory.MODIFY) { onCategoryClick(ToolbarCategory.MODIFY) }
        LabeledSidebarIconButton(IconRegistry.Construct, "Construct", activeCategory == ToolbarCategory.CONSTRUCT) { onCategoryClick(ToolbarCategory.CONSTRUCT) }
        LabeledSidebarIconButton(IconRegistry.Measure, "Measure", activeCategory == ToolbarCategory.MEASURE) { onCategoryClick(ToolbarCategory.MEASURE) }
        LabeledSidebarIconButton(IconRegistry.Inspect, "Inspect", activeCategory == ToolbarCategory.INSPECT) { onCategoryClick(ToolbarCategory.INSPECT) }
    }
}

enum class ToolbarCategory {
    SELECT, SKETCH, CREATE, MODIFY, CONSTRUCT, MEASURE, INSPECT, NONE
}
