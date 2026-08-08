package com.tamercad.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.ui.CadMode
import com.tamercad.ui.theme.TamerCadColors

@Composable
fun MainToolbar(
    currentMode: CadMode,
    expandedToolGroup: String?,
    showLeftSecondaryPanel: String?,
    onToolClick: (CadMode, String?) -> Unit,
    onPanelToggle: (String) -> Unit,
    onUndo: () -> Unit,
    onHelp: () -> Unit
) {
    Column(
        modifier = Modifier
            .padding(start = 12.dp, top = 20.dp, bottom = 20.dp)
            .width(60.dp)
            .fillMaxHeight()
            .clip(RoundedCornerShape(30.dp))
            .background(TamerCadColors.PanelColor)
            .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(30.dp))
            .shadow(8.dp)
            .padding(vertical = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Üst Grup (Yönetim & Görünüm)
        IconGroupButton(
            Icons.Default.Menu,
            "All Items",
            showLeftSecondaryPanel == "All Items"
        ) { onPanelToggle("All Items") }
        IconGroupButton(
            Icons.Default.Face,
            "Materials",
            showLeftSecondaryPanel == "Materials"
        ) { onPanelToggle("Materials") }
        IconGroupButton(Icons.Default.Settings, "Drawings", false) { }
        IconGroupButton(Icons.Default.List, "Items", false) { }
        IconGroupButton(Icons.Default.Search, "Search", false) { }

        Spacer(Modifier.height(8.dp))
        Divider(color = TamerCadColors.PanelBorder, modifier = Modifier.fillMaxWidth(0.6f))
        Spacer(Modifier.height(8.dp))

        // Çizim & Düzenleme Grubu (Sketching)
        IconGroupButton(Icons.Default.Close, "Exit Sketching", false) {
            onToolClick(CadMode.NAVIGATE, null)
        }

        ExpandableToolGroup(
            "Line/Arc", Icons.Default.Create, expandedToolGroup == "Line/Arc",
            listOf(
                "Automatic" to CadMode.SMART_SKETCH,
                "Line" to CadMode.SKETCH_LINE_MANUAL,
                "Arc" to CadMode.SKETCH_ARC
            ),
            currentMode
        ) { mode, group -> onToolClick(mode, group) }

        ExpandableToolGroup(
            "Spline", Icons.Default.Share, expandedToolGroup == "Spline",
            listOf("Fit" to CadMode.SKETCH_SPLINE_FIT, "Control" to CadMode.SKETCH_SPLINE_CTRL),
            currentMode
        ) { mode, group -> onToolClick(mode, group) }

        ExpandableToolGroup(
            "Rectangle", Icons.Default.Menu, expandedToolGroup == "Rectangle",
            listOf(
                "Center" to CadMode.SKETCH_RECT_CENTER,
                "Diagonal" to CadMode.SKETCH_RECT_DIAG,
                "3 Points" to CadMode.SKETCH_RECT_3PT
            ),
            currentMode
        ) { mode, group -> onToolClick(mode, group) }

        IconGroupButton(
            Icons.Default.Star,
            "Ellipse",
            currentMode == CadMode.SKETCH_ELLIPSE
        ) { onToolClick(CadMode.SKETCH_ELLIPSE, null) }
        IconGroupButton(
            Icons.Default.Star,
            "Polygon",
            currentMode == CadMode.SKETCH_POLYGON
        ) { onToolClick(CadMode.SKETCH_POLYGON, null) }
        IconGroupButton(
            Icons.Default.KeyboardArrowUp,
            "Offset Edge",
            currentMode == CadMode.OFFSET_EDGE
        ) { onToolClick(CadMode.OFFSET_EDGE, null) }

        IconGroupButton(Icons.Default.Delete, "Trim", currentMode == CadMode.TRIM) {
            onToolClick(CadMode.TRIM, null)
        }
        IconGroupButton(Icons.Default.Delete, "Delete", currentMode == CadMode.DELETE) {
            onToolClick(CadMode.DELETE, null)
        }

        Spacer(Modifier.height(8.dp))
        Divider(color = TamerCadColors.PanelBorder, modifier = Modifier.fillMaxWidth(0.6f))
        Spacer(Modifier.height(8.dp))

        // Modelleme & Analiz Grubu
        IconGroupButton(
            Icons.Default.PlayArrow,
            "Move/Rotate",
            currentMode == CadMode.MOVE_ROTATE
        ) { onToolClick(CadMode.MOVE_ROTATE, null) }
        IconGroupButton(Icons.Default.Star, "Mirror", currentMode == CadMode.MIRROR) {
            onToolClick(CadMode.MIRROR, null)
        }
        IconGroupButton(
            Icons.Default.Build,
            "Pattern",
            currentMode == CadMode.PATTERN_LINEAR
        ) { onToolClick(CadMode.PATTERN_LINEAR, null) }

        Spacer(Modifier.weight(1f))
        IconGroupButton(Icons.Default.Refresh, "Undo", false) { onUndo() }
        IconGroupButton(Icons.Default.Info, "Help", false) { onHelp() }
    }
}

@Composable
fun ToolOptionsPanel(
    expandedToolGroup: String,
    currentMode: CadMode,
    onModeSelect: (CadMode) -> Unit
) {
    val options = when (expandedToolGroup) {
        "Line/Arc" -> listOf(
            "Automatic" to CadMode.SMART_SKETCH,
            "Line" to CadMode.SKETCH_LINE_MANUAL,
            "Arc" to CadMode.SKETCH_ARC
        )
        "Spline" -> listOf(
            "Fit Point Spline" to CadMode.SKETCH_SPLINE_FIT,
            "Control Point Spline" to CadMode.SKETCH_SPLINE_CTRL
        )
        "Rectangle" -> listOf(
            "Center" to CadMode.SKETCH_RECT_CENTER,
            "Diagonal" to CadMode.SKETCH_RECT_DIAG,
            "3 Points" to CadMode.SKETCH_RECT_3PT
        )
        else -> emptyList()
    }

    Column(
        modifier = Modifier
            .padding(start = 80.dp, top = 200.dp)
            .width(160.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(TamerCadColors.PanelColor)
            .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(12.dp))
            .shadow(8.dp)
            .padding(8.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        options.forEach { (label, mode) ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(if (currentMode == mode) TamerCadColors.ActiveColor.copy(alpha = 0.2f) else Color.Transparent)
                    .clickable { onModeSelect(mode) }
                    .padding(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(24.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(if (currentMode == mode) TamerCadColors.ActiveColor else Color(0xFF2C2C36)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.Create,
                        contentDescription = null,
                        tint = if (currentMode == mode) Color.White else TamerCadColors.IconColor,
                        modifier = Modifier.size(14.dp)
                    )
                }
                Spacer(Modifier.width(10.dp))
                Text(
                    label,
                    color = TamerCadColors.TextColor,
                    fontSize = 12.sp,
                    fontWeight = if (currentMode == mode) FontWeight.Bold else FontWeight.Normal
                )
            }
        }
    }
}

@Composable
fun IconGroupButton(
    icon: ImageVector,
    description: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .size(42.dp)
            .clip(CircleShape)
            .background(if (isSelected) TamerCadColors.ActiveColor.copy(alpha = 0.2f) else Color.Transparent)
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Icon(
            icon,
            contentDescription = description,
            tint = if (isSelected) TamerCadColors.ActiveColor else Color(0xFFA1A1AA),
            modifier = Modifier.size(22.dp)
        )
    }
}

@Composable
fun ExpandableToolGroup(
    groupName: String,
    icon: ImageVector,
    isExpanded: Boolean,
    modes: List<Pair<String, CadMode>>,
    currentMode: CadMode,
    onClick: (CadMode, String?) -> Unit
) {
    val isActiveInGroup = modes.any { it.second == currentMode }
    Box(
        modifier = Modifier
            .size(42.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(if (isActiveInGroup || isExpanded) TamerCadColors.AccentBlue.copy(alpha = 0.2f) else Color.Transparent)
            .border(
                if (isExpanded) 1.dp else 0.dp,
                if (isExpanded) TamerCadColors.AccentBlue else Color.Transparent,
                RoundedCornerShape(10.dp)
            )
            .clickable { onClick(modes.first().second, if (isExpanded) null else groupName) },
        contentAlignment = Alignment.Center
    ) {
        Icon(
            icon,
            contentDescription = groupName,
            tint = if (isActiveInGroup || isExpanded) Color.White else Color(0xFFA1A1AA),
            modifier = Modifier.size(20.dp)
        )
        Box(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(4.dp)
                .size(6.dp)
                .clip(CircleShape)
                .background(Color.Gray)
        )
    }
}
