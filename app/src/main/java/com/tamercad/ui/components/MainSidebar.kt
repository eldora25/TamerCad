package com.tamercad.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.ExperimentalFoundationApi
import com.tamercad.ui.CadMode
import com.tamercad.ui.SidebarCategory
import com.tamercad.ui.SidebarState
import com.tamercad.ui.getIconForMode
import com.tamercad.ui.theme.TamerCadColors

import com.tamercad.ui.theme.IconRegistry

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun MainSidebar(
    state: SidebarState,
    onCategoryClick: (SidebarCategory) -> Unit,
    onToolClick: (CadMode) -> Unit,
    onToolLongClick: (String) -> Unit,
    onExitSketch: () -> Unit,
    onUndo: () -> Unit,
    onRedo: () -> Unit,
    onHelp: () -> Unit
) {
    Box(modifier = Modifier.fillMaxHeight()) {
        Column(
            modifier = Modifier
                .padding(start = 12.dp, top = 80.dp, bottom = 24.dp)
                .width(72.dp)
                .fillMaxHeight()
                .clip(RoundedCornerShape(36.dp))
                .background(TamerCadColors.PanelColor)
                .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(36.dp))
                .shadow(12.dp)
                .padding(vertical = 12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            if (state.activeCategory != SidebarCategory.SKETCH) {
                LabeledSidebarIconButton(IconRegistry.Sketch, "Sketch", state.activeCategory == SidebarCategory.SKETCH) { onCategoryClick(SidebarCategory.SKETCH) }
                LabeledSidebarIconButton(Icons.Default.Add, "Insert", state.activeCategory == SidebarCategory.INSERT) { onCategoryClick(SidebarCategory.INSERT) }
                LabeledSidebarIconButton(Icons.Default.Build, "Construct", state.activeCategory == SidebarCategory.CONSTRUCT) { onCategoryClick(SidebarCategory.CONSTRUCT) }
                LabeledSidebarIconButton(Icons.Default.PlayArrow, "Transform", state.activeCategory == SidebarCategory.TRANSFORM) { onCategoryClick(SidebarCategory.TRANSFORM) }
                LabeledSidebarIconButton(IconRegistry.Settings, "Tools", state.activeCategory == SidebarCategory.TOOLS) { onCategoryClick(SidebarCategory.TOOLS) }
                LabeledSidebarIconButton(Icons.Default.Face, "Material", state.activeCategory == SidebarCategory.MATERIAL) { onCategoryClick(SidebarCategory.MATERIAL) }
                LabeledSidebarIconButton(Icons.Default.List, "Items", state.activeCategory == SidebarCategory.ITEMS) { onCategoryClick(SidebarCategory.ITEMS) }
            } else {
                // SKETCH MODU MENÜSÜ
                LabeledSidebarIconButton(Icons.Default.Close, "Exit", false) { onExitSketch() }
                Divider(color = TamerCadColors.PanelBorder, modifier = Modifier.fillMaxWidth(0.6f))
                
                DynamicToolButton(mode = state.primaryLineTool, label = "Line", isSelected = false, onClick = { onToolClick(state.primaryLineTool) }, onLongClick = { onToolLongClick("Line") })
                DynamicToolButton(mode = state.primarySplineTool, label = "Spline", isSelected = false, onClick = { onToolClick(state.primarySplineTool) }, onLongClick = { onToolLongClick("Spline") })
                DynamicToolButton(mode = state.primaryRectTool, label = "Rect", isSelected = false, onClick = { onToolClick(state.primaryRectTool) }, onLongClick = { onToolLongClick("Rectangle") })

                LabeledSidebarIconButton(Icons.Default.MoreVert, "More", false) { }
                LabeledSidebarIconButton(IconRegistry.Delete, "Trim", false) { onToolClick(CadMode.TRIM) }
                LabeledSidebarIconButton(Icons.Default.Clear, "Delete", false) { onToolClick(CadMode.DELETE) }
            }
            
            Spacer(Modifier.weight(1f))
            LabeledSidebarIconButton(IconRegistry.Undo, "Undo", false) { onUndo() }
            LabeledSidebarIconButton(IconRegistry.Redo, "Redo", false) { onRedo() } 
            LabeledSidebarIconButton(IconRegistry.Help, "Help", false) { onHelp() }
        }

        if (state.expandedGroup != null) {
            val options = when (state.expandedGroup) {
                "Line" -> listOf(CadMode.SMART_SKETCH, CadMode.SKETCH_LINE_MANUAL, CadMode.SKETCH_ARC)
                "Spline" -> listOf(CadMode.SKETCH_SPLINE_FIT, CadMode.SKETCH_SPLINE_CTRL)
                "Rectangle" -> listOf(CadMode.SKETCH_RECT_DIAG, CadMode.SKETCH_RECT_CENTER, CadMode.SKETCH_RECT_3PT)
                else -> emptyList()
            }

            Column(
                modifier = Modifier
                    .padding(start = 80.dp, top = 120.dp)
                    .background(TamerCadColors.PanelColor, RoundedCornerShape(12.dp))
                    .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(12.dp))
                    .padding(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                options.forEach { mode ->
                    LabeledSidebarIconButton(getIconForMode(mode), mode.name.replace("SKETCH_", "").lowercase(), false) {
                        state.swapTool(state.expandedGroup!!, mode)
                        onToolClick(mode)
                    }
                }
            }
        }
    }
}
