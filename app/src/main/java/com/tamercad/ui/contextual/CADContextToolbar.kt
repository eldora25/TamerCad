package com.tamercad.ui.contextual

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.unit.dp
import com.tamercad.ui.CADViewModel
import com.tamercad.ui.components.LabeledSidebarIconButton
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadDimensions

enum class SelectionType {
    NONE, VERTEX, EDGE, FACE, BODY, SKETCH, FEATURE, MULTIPLE
}

/**
 * TamerCAD Profesyonel Bağlamsal Araç Çubuğu.
 * Seçilen nesneye göre SelectionContextResolver üzerinden dinamik araçlar yükler.
 */
@Composable
fun CADContextToolbar(
    viewModel: CADViewModel,
    onCommandClick: (String) -> Unit
) {
    val selectionType = viewModel.selectionManager.getSelectionType()
    val availableTools = SelectionContextResolver.getAvailableTools(selectionType)
    
    if (availableTools.isEmpty()) return

    Row(
        modifier = Modifier
            .padding(bottom = TamerCadDimensions.SpacingExtraLarge)
            .height(TamerCadDimensions.ContextToolbarHeight)
            .wrapContentWidth()
            .background(TamerCadColors.Surface, RoundedCornerShape(TamerCadDimensions.CornerExtraLarge))
            .border(TamerCadDimensions.BorderThin, TamerCadColors.Primary.copy(alpha = 0.5f), RoundedCornerShape(TamerCadDimensions.CornerExtraLarge))
            .shadow(TamerCadDimensions.ElevationHigh)
            .padding(horizontal = TamerCadDimensions.SpacingLarge),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(TamerCadDimensions.SpacingSmall)
    ) {
        availableTools.forEach { tool ->
            LabeledSidebarIconButton(
                icon = tool.icon,
                label = tool.label,
                isSelected = false,
                enabled = tool.enabled,
                onClick = { onCommandClick(tool.id) }
            )
        }
    }
}
