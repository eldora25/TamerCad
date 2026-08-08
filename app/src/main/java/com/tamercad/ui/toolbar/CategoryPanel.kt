package com.tamercad.ui.toolbar

import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.ui.CadMode
import com.tamercad.ui.components.LabeledSidebarIconButton
import com.tamercad.ui.theme.IconRegistry
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadDimensions

/**
 * TamerCAD Kategori Bazlı Dinamik Araç Paneli.
 * Tool Rail üzerinden seçilen kategoriye ait spesifik araçları listeler.
 */
@Composable
fun CategoryPanel(
    category: ToolbarCategory,
    onToolClick: (ToolDefinition) -> Unit
) {
    if (category == ToolbarCategory.NONE) return

    Column(
        modifier = Modifier
            .padding(start = 100.dp, top = 80.dp) // Tool Rail'in hemen sağına
            .width(200.dp)
            .wrapContentHeight()
            .clip(RoundedCornerShape(TamerCadDimensions.CornerMedium))
            .background(TamerCadColors.Surface)
            .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerMedium))
            .shadow(TamerCadDimensions.ElevationMedium)
            .padding(TamerCadDimensions.SpacingMedium),
        horizontalAlignment = Alignment.Start,
        verticalArrangement = Arrangement.spacedBy(TamerCadDimensions.SpacingSmall)
    ) {
        Text(
            text = category.name,
            color = TamerCadColors.TextSecondary,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 4.dp)
        )

        val tools = getToolsForCategory(category)
        
        // Grid şeklinde gösterelim (Daha profesyonel)
        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            maxItemsInEachRow = 3,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            tools.forEach { tool ->
                LabeledSidebarIconButton(
                    icon = tool.icon,
                    label = tool.label,
                    isSelected = false,
                    enabled = tool.enabled,
                    onClick = { onToolClick(tool) }
                )
            }
        }
    }
}

private fun getToolsForCategory(category: ToolbarCategory): List<ToolDefinition> {
    return when (category) {
        ToolbarCategory.SKETCH -> listOf(
            ToolDefinition("line", "Line", IconRegistry.Line),
            ToolDefinition("arc", "Arc", IconRegistry.Arc),
            ToolDefinition("circle", "Circle", IconRegistry.Circle),
            ToolDefinition("rect", "Rect", IconRegistry.Rectangle),
            ToolDefinition("spline", "Spline", IconRegistry.Spline),
            ToolDefinition("trim", "Trim", IconRegistry.Trim)
        )
        ToolbarCategory.CREATE -> listOf(
            ToolDefinition("extrude", "Extrude", IconRegistry.Extrude),
            ToolDefinition("revolve", "Revolve", IconRegistry.Revolve),
            ToolDefinition("sweep", "Sweep", IconRegistry.Revolve, enabled = false, tooltip = "Coming Soon"),
            ToolDefinition("loft", "Loft", IconRegistry.Select, enabled = false, tooltip = "Coming Soon"),
            ToolDefinition("hole", "Hole", IconRegistry.Circle, enabled = false, tooltip = "Coming Soon"),
            ToolDefinition("thread", "Thread", IconRegistry.Modify, enabled = false),
            ToolDefinition("emboss", "Emboss", IconRegistry.Sketch, enabled = false),
            ToolDefinition("rib", "Rib", IconRegistry.Construct, enabled = false)
        )
        ToolbarCategory.MODIFY -> listOf(
            ToolDefinition("fillet", "Fillet", IconRegistry.Fillet),
            ToolDefinition("chamfer", "Chamfer", IconRegistry.Chamfer),
            ToolDefinition("mirror", "Mirror", IconRegistry.Mirror),
            ToolDefinition("pattern", "Pattern", IconRegistry.Pattern)
        )
        ToolbarCategory.CONSTRUCT -> listOf(
            ToolDefinition("plane", "Plane", IconRegistry.Construct)
        )
        ToolbarCategory.MEASURE -> listOf(
            ToolDefinition("measure", "Measure", IconRegistry.Measure)
        )
        else -> emptyList()
    }
}
