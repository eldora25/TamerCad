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
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.unit.dp
import com.tamercad.ui.CadMode
import com.tamercad.ui.SidebarState
import com.tamercad.ui.getIconForMode
import com.tamercad.ui.theme.TamerCadColors
import androidx.compose.foundation.ExperimentalFoundationApi

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun BottomToolbar(
    state: SidebarState,
    currentMode: CadMode,
    onToolClick: (CadMode) -> Unit,
    onToolLongClick: (String) -> Unit,
    onExitSketch: () -> Unit
) {
    Row(
        modifier = Modifier
            .padding(bottom = 32.dp)
            .height(80.dp)
            .background(TamerCadColors.PanelColor, RoundedCornerShape(40.dp))
            .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(40.dp))
            .shadow(16.dp)
            .padding(horizontal = 24.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        if (currentMode == CadMode.NAVIGATE) {
            LabeledSidebarIconButton(Icons.Default.Create, "Sketch", false) { onToolClick(CadMode.SMART_SKETCH) }
            LabeledSidebarIconButton(Icons.Default.Build, "Modeling", false) { /* modeling menu */ }
            LabeledSidebarIconButton(Icons.Default.Refresh, "Transform", false) { onToolClick(CadMode.MOVE_ROTATE) }
            LabeledSidebarIconButton(Icons.Default.Settings, "Tools", false) { }
        } else {
            // Active Sketch Tools
            LabeledSidebarIconButton(Icons.Default.Close, "Exit", false) { onExitSketch() }
            
            VerticalDivider()

            DynamicToolButton(mode = state.primaryLineTool, label = "Line", isSelected = currentMode == state.primaryLineTool, onClick = { onToolClick(state.primaryLineTool) }, onLongClick = { onToolLongClick("Line") })
            DynamicToolButton(mode = state.primarySplineTool, label = "Spline", isSelected = currentMode == state.primarySplineTool, onClick = { onToolClick(state.primarySplineTool) }, onLongClick = { onToolLongClick("Spline") })
            DynamicToolButton(mode = state.primaryRectTool, label = "Rect", isSelected = currentMode == state.primaryRectTool, onClick = { onToolClick(state.primaryRectTool) }, onLongClick = { onToolLongClick("Rectangle") })

            LabeledSidebarIconButton(Icons.Default.Delete, "Trim", currentMode == CadMode.TRIM) { onToolClick(CadMode.TRIM) }
            LabeledSidebarIconButton(Icons.Default.Clear, "Delete", currentMode == CadMode.DELETE) { onToolClick(CadMode.DELETE) }
        }
    }
}

@Composable
fun VerticalDivider() {
    Box(modifier = Modifier.width(1.dp).height(40.dp).background(TamerCadColors.PanelBorder))
}
