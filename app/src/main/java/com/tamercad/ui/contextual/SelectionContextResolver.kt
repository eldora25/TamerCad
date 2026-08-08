package com.tamercad.ui.contextual

import com.tamercad.ui.theme.IconRegistry
import com.tamercad.ui.toolbar.ToolDefinition

/**
 * TamerCAD Bağlamsal Seçim Çözücü.
 * Seçilen nesne tipine göre hangi araçların (ToolDefinition) gösterileceğine karar verir.
 */
object SelectionContextResolver {

    fun getAvailableTools(type: SelectionType): List<ToolDefinition> {
        return when (type) {
            SelectionType.NONE -> listOf(
                ToolDefinition("select", "Select", IconRegistry.Select),
                ToolDefinition("sketch", "Sketch", IconRegistry.Sketch),
                ToolDefinition("measure", "Measure", IconRegistry.Measure)
            )
            SelectionType.VERTEX -> listOf(
                ToolDefinition("move", "Move", IconRegistry.Select),
                ToolDefinition("measure", "Measure", IconRegistry.Measure),
                ToolDefinition("delete", "Delete", IconRegistry.Delete)
            )
            SelectionType.EDGE -> listOf(
                ToolDefinition("fillet", "Fillet", IconRegistry.Fillet),
                ToolDefinition("chamfer", "Chamfer", IconRegistry.Chamfer),
                ToolDefinition("measure", "Measure", IconRegistry.Measure),
                ToolDefinition("delete", "Delete", IconRegistry.Delete)
            )
            SelectionType.FACE -> listOf(
                ToolDefinition("extrude", "Extrude", IconRegistry.Extrude),
                ToolDefinition("offset", "Offset", IconRegistry.Measure),
                ToolDefinition("fillet", "Fillet", IconRegistry.Fillet),
                ToolDefinition("chamfer", "Chamfer", IconRegistry.Chamfer),
                ToolDefinition("shell", "Shell", IconRegistry.Hidden), // Placeholder for Shell icon
                ToolDefinition("measure", "Measure", IconRegistry.Measure),
                ToolDefinition("delete", "Delete", IconRegistry.Delete)
            )
            SelectionType.BODY -> listOf(
                ToolDefinition("move", "Move", IconRegistry.Select),
                ToolDefinition("rotate", "Rotate", IconRegistry.Redo),
                ToolDefinition("mirror", "Mirror", IconRegistry.Mirror),
                ToolDefinition("pattern", "Pattern", IconRegistry.Pattern),
                ToolDefinition("measure", "Measure", IconRegistry.Measure),
                ToolDefinition("hide", "Hide", IconRegistry.Hidden),
                ToolDefinition("delete", "Delete", IconRegistry.Delete)
            )
            SelectionType.SKETCH -> listOf(
                ToolDefinition("edit", "Edit", IconRegistry.Sketch),
                ToolDefinition("hide", "Hide", IconRegistry.Hidden),
                ToolDefinition("show", "Show", IconRegistry.Visible),
                ToolDefinition("rename", "Rename", IconRegistry.Settings),
                ToolDefinition("delete", "Delete", IconRegistry.Delete)
            )
            SelectionType.MULTIPLE -> listOf(
                ToolDefinition("measure", "Measure", IconRegistry.Measure),
                ToolDefinition("delete", "Delete", IconRegistry.Delete)
                // TODO: Find common operations for mixed selection
            )
            SelectionType.FEATURE -> listOf(
                ToolDefinition("edit", "Edit", IconRegistry.Settings),
                ToolDefinition("delete", "Delete", IconRegistry.Delete)
            )
        }
    }
}
