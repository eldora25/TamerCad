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
import com.tamercad.ui.sketch.SketchTool
import com.tamercad.ui.components.LabeledSidebarIconButton
import com.tamercad.ui.theme.IconRegistry
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadDimensions
import com.tamercad.ui.viewport.ViewportPolicy

/**
 * TamerCAD Kategori Bazlı Dinamik Araç Paneli.
 * Tool Rail üzerinden seçilen kategoriye ait spesifik araçları listeler.
 */
@Composable
fun CategoryPanel(
    category: ToolbarCategory,
    viewModel: com.tamercad.ui.CADViewModel, // Lojiği SelectionManager'dan çekmek için
    onToolClick: (ToolDefinition) -> Unit
) {
    if (category == ToolbarCategory.NONE) return
    
    val selectionType = viewModel.selectionManager.getSelectionType()

    Column(
        modifier = Modifier
            .width(ViewportPolicy.CategoryPanelWidth)
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

        val tools = getToolsForCategory(category, selectionType)
        
        // Grid şeklinde gösterelim (Daha profesyonel)
        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            maxItemsInEachRow = 3,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            tools.forEach { tool ->
                val isSelected = when (tool.id) {
                    "line" -> viewModel.activeSketchTool == SketchTool.LINE
                    "circle" -> viewModel.activeSketchTool == SketchTool.CIRCLE
                    "rect" -> viewModel.activeSketchTool == SketchTool.RECTANGLE
                    "arc" -> viewModel.activeSketchTool == SketchTool.ARC
                    "spline" -> viewModel.activeSketchTool == SketchTool.SPLINE
                    "trim" -> viewModel.activeSketchTool == SketchTool.TRIM
                    "select" -> viewModel.activeSketchTool == SketchTool.SELECT && viewModel.selectionManager.selectionMode == com.tamercad.ui.selection.SelectionMode.SINGLE
                    "multi_select" -> viewModel.activeSketchTool == SketchTool.SELECT && viewModel.selectionManager.selectionMode == com.tamercad.ui.selection.SelectionMode.MULTI
                    else -> false
                }
                
                LabeledSidebarIconButton(
                    icon = tool.icon,
                    label = tool.label,
                    isSelected = isSelected,
                    enabled = tool.enabled,
                    onClick = { 
                        onToolClick(tool)
                        // Auto-close panel on tool selection for tablet efficiency
                        viewModel.activeCategory = ToolbarCategory.NONE
                    }
                )
            }
        }
    }
}

private fun getToolsForCategory(category: ToolbarCategory, selectionType: com.tamercad.ui.contextual.SelectionType): List<ToolDefinition> {
    return when (category) {
        ToolbarCategory.SELECT -> listOf(
            ToolDefinition("select", "Select", IconRegistry.Select),
            ToolDefinition("multi_select", "Multi Select", IconRegistry.Select) // Reuse icon for now
        )
        ToolbarCategory.SKETCH -> listOf(
            ToolDefinition("line", "Line", IconRegistry.Line),
            ToolDefinition("arc", "Arc", IconRegistry.Arc),
            ToolDefinition("circle", "Circle", IconRegistry.Circle),
            ToolDefinition("rect", "Rect", IconRegistry.Rectangle),
            ToolDefinition("spline", "Spline", IconRegistry.Spline),
            ToolDefinition("trim", "Trim", IconRegistry.Trim)
        )
        ToolbarCategory.CREATE -> listOf(
            ToolDefinition("extrude", "Extrude", IconRegistry.Extrude, enabled = selectionType == com.tamercad.ui.contextual.SelectionType.FACE || selectionType == com.tamercad.ui.contextual.SelectionType.SKETCH),
            ToolDefinition("revolve", "Revolve", IconRegistry.Revolve, enabled = selectionType == com.tamercad.ui.contextual.SelectionType.FACE || selectionType == com.tamercad.ui.contextual.SelectionType.SKETCH),
            ToolDefinition("sweep", "Sweep", IconRegistry.Revolve, enabled = false, tooltip = "Coming Soon"),
            ToolDefinition("loft", "Loft", IconRegistry.Select, enabled = false, tooltip = "Coming Soon"),
            ToolDefinition("hole", "Hole", IconRegistry.Circle, enabled = false, tooltip = "Coming Soon")
        )
        ToolbarCategory.MODIFY -> listOf(
            ToolDefinition("fillet", "Fillet", IconRegistry.Fillet, enabled = selectionType == com.tamercad.ui.contextual.SelectionType.EDGE || selectionType == com.tamercad.ui.contextual.SelectionType.FACE),
            ToolDefinition("chamfer", "Chamfer", IconRegistry.Chamfer, enabled = selectionType == com.tamercad.ui.contextual.SelectionType.EDGE || selectionType == com.tamercad.ui.contextual.SelectionType.FACE),
            ToolDefinition("shell", "Shell", IconRegistry.Hidden, enabled = selectionType == com.tamercad.ui.contextual.SelectionType.FACE),
            ToolDefinition("offset_face", "Offset Face", IconRegistry.Measure, enabled = selectionType == com.tamercad.ui.contextual.SelectionType.FACE),
            ToolDefinition("draft", "Draft", IconRegistry.Select, enabled = selectionType == com.tamercad.ui.contextual.SelectionType.FACE),
            ToolDefinition("mirror", "Mirror", IconRegistry.Mirror, enabled = selectionType == com.tamercad.ui.contextual.SelectionType.BODY),
            ToolDefinition("pattern", "Pattern", IconRegistry.Pattern, enabled = selectionType == com.tamercad.ui.contextual.SelectionType.BODY),
            ToolDefinition("union", "Union", IconRegistry.Union, enabled = selectionType == com.tamercad.ui.contextual.SelectionType.MULTIPLE),
            ToolDefinition("subtract", "Subtract", IconRegistry.Subtract, enabled = selectionType == com.tamercad.ui.contextual.SelectionType.MULTIPLE),
            ToolDefinition("intersect", "Intersect", IconRegistry.Intersect, enabled = selectionType == com.tamercad.ui.contextual.SelectionType.MULTIPLE)
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
