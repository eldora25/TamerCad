package com.tamercad.ui.contextual

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.ui.components.LabeledSidebarIconButton
import com.tamercad.ui.theme.IconRegistry
import com.tamercad.ui.theme.TamerCadColors

enum class SelectionType {
    NONE, VERTEX, EDGE, FACE, BODY, SKETCH, FEATURE, MULTIPLE
}

/**
 * TamerCAD Bağlamsal (Contextual) Araç Çubuğu.
 */
@Composable
fun CADContextToolbar(
    selectionType: SelectionType,
    onCommandClick: (String) -> Unit
) {
    Row(
        modifier = Modifier
            .padding(bottom = 32.dp)
            .height(80.dp)
            .background(TamerCadColors.PanelColor, RoundedCornerShape(40.dp))
            .border(1.dp, TamerCadColors.ActiveColor, RoundedCornerShape(40.dp))
            .shadow(16.dp)
            .padding(horizontal = 24.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        when (selectionType) {
            SelectionType.NONE -> {
                LabeledSidebarIconButton(IconRegistry.Select, "Select", false) { onCommandClick("select") }
                LabeledSidebarIconButton(IconRegistry.Sketch, "Sketch", false) { onCommandClick("sketch") }
                LabeledSidebarIconButton(IconRegistry.Measure, "Measure", false) { onCommandClick("measure") }
            }
            SelectionType.FACE -> {
                LabeledSidebarIconButton(IconRegistry.Extrude, "Extrude", false) { onCommandClick("extrude") }
                LabeledSidebarIconButton(IconRegistry.Fillet, "Fillet", false) { onCommandClick("fillet") }
                LabeledSidebarIconButton(IconRegistry.Chamfer, "Chamfer", false) { onCommandClick("chamfer") }
                LabeledSidebarIconButton(IconRegistry.Measure, "Offset", false) { onCommandClick("offset") }
                LabeledSidebarIconButton(IconRegistry.Delete, "Delete", false) { onCommandClick("delete") }
            }
            SelectionType.EDGE -> {
                LabeledSidebarIconButton(IconRegistry.Fillet, "Fillet", false) { onCommandClick("fillet") }
                LabeledSidebarIconButton(IconRegistry.Chamfer, "Chamfer", false) { onCommandClick("chamfer") }
                LabeledSidebarIconButton(IconRegistry.Measure, "Measure", false) { onCommandClick("measure") }
                LabeledSidebarIconButton(IconRegistry.Delete, "Delete", false) { onCommandClick("delete") }
            }
            SelectionType.VERTEX -> {
                LabeledSidebarIconButton(IconRegistry.Select, "Move", false) { onCommandClick("move") }
                LabeledSidebarIconButton(IconRegistry.Measure, "Measure", false) { onCommandClick("measure") }
                LabeledSidebarIconButton(IconRegistry.Delete, "Delete", false) { onCommandClick("delete") }
            }
            SelectionType.BODY -> {
                LabeledSidebarIconButton(IconRegistry.Select, "Move", false) { onCommandClick("move") }
                LabeledSidebarIconButton(IconRegistry.Redo, "Rotate", false) { onCommandClick("rotate") }
                LabeledSidebarIconButton(IconRegistry.Mirror, "Mirror", false) { onCommandClick("mirror") }
                LabeledSidebarIconButton(IconRegistry.Pattern, "Pattern", false) { onCommandClick("pattern") }
                LabeledSidebarIconButton(IconRegistry.Hidden, "Hide", false) { onCommandClick("hide") }
                LabeledSidebarIconButton(IconRegistry.Delete, "Delete", false) { onCommandClick("delete") }
            }
            SelectionType.SKETCH -> {
                LabeledSidebarIconButton(IconRegistry.Sketch, "Edit", false) { onCommandClick("edit_sketch") }
                LabeledSidebarIconButton(IconRegistry.Visible, "Show", false) { onCommandClick("show") }
                LabeledSidebarIconButton(IconRegistry.Delete, "Delete", false) { onCommandClick("delete") }
            }
            SelectionType.MULTIPLE -> {
                LabeledSidebarIconButton(IconRegistry.Measure, "Measure", false) { onCommandClick("measure") }
                LabeledSidebarIconButton(IconRegistry.Delete, "Delete", false) { onCommandClick("delete") }
            }
            SelectionType.FEATURE -> {
                LabeledSidebarIconButton(IconRegistry.Settings, "Edit", false) { onCommandClick("edit_feature") }
                LabeledSidebarIconButton(IconRegistry.Delete, "Delete", false) { onCommandClick("delete") }
            }
        }
    }
}
