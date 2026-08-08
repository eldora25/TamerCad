package com.tamercad.ui.toolbar

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
    onToolClick: (String) -> Unit
) {
    if (category == ToolbarCategory.NONE) return

    Column(
        modifier = Modifier
            .padding(start = 100.dp, top = 80.dp) // Tool Rail'in hemen sağına
            .width(180.dp)
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
        
        tools.forEach { tool ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(TamerCadDimensions.CornerSmall))
                    .background(Color.Transparent) // Highlight eklenebilir
                    .padding(vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Burada LabeledSidebarIconButton'ı yatay formda veya basitleştirilmiş kullanabiliriz
                // Şimdilik standart buton yapısını koruyalım
                LabeledSidebarIconButton(
                    icon = tool.second,
                    label = tool.first,
                    isSelected = false,
                    onClick = { onToolClick(tool.first.lowercase()) }
                )
            }
        }
    }
}

private fun getToolsForCategory(category: ToolbarCategory): List<Pair<String, androidx.compose.ui.graphics.vector.ImageVector>> {
    return when (category) {
        ToolbarCategory.SKETCH -> listOf(
            "Line" to IconRegistry.Line,
            "Arc" to IconRegistry.Arc,
            "Circle" to IconRegistry.Circle,
            "Rectangle" to IconRegistry.Rectangle,
            "Spline" to IconRegistry.Spline,
            "Trim" to IconRegistry.Trim
        )
        ToolbarCategory.CREATE -> listOf(
            "Extrude" to IconRegistry.Extrude,
            "Revolve" to IconRegistry.Revolve
        )
        ToolbarCategory.MODIFY -> listOf(
            "Fillet" to IconRegistry.Fillet,
            "Chamfer" to IconRegistry.Chamfer,
            "Mirror" to IconRegistry.Mirror,
            "Pattern" to IconRegistry.Pattern
        )
        ToolbarCategory.CONSTRUCT -> listOf(
            "Plane" to IconRegistry.Construct
        )
        ToolbarCategory.MEASURE -> listOf(
            "Measure" to IconRegistry.Measure
        )
        else -> emptyList()
    }
}
