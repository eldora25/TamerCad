package com.tamercad.ui.sketch

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadDimensions

/**
 * TamerCAD Düzlem Seçici.
 * Sketch Mode'a girerken XY, XZ veya YZ düzlemini seçtirir.
 */
@Composable
fun PlaneSelector(
    onPlaneSelected: (String) -> Unit,
    onCancel: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.4f))
            .clickable { onCancel() },
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .width(320.dp)
                .clip(RoundedCornerShape(TamerCadDimensions.CornerLarge))
                .background(TamerCadColors.Surface)
                .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerLarge))
                .padding(TamerCadDimensions.SpacingExtraLarge),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            Text(
                "Çizim Düzlemi Seçin",
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                PlaneItem("XY", TamerCadColors.AxisZ) { onPlaneSelected("XY") }
                PlaneItem("XZ", TamerCadColors.AxisY) { onPlaneSelected("XZ") }
                PlaneItem("YZ", TamerCadColors.AxisX) { onPlaneSelected("YZ") }
            }
        }
    }
}

@Composable
private fun PlaneItem(
    name: String,
    color: Color,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Box(
            modifier = Modifier
                .size(64.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(color.copy(alpha = 0.2f))
                .border(2.dp, color, RoundedCornerShape(12.dp))
                .clickable { onClick() },
            contentAlignment = Alignment.Center
        ) {
            Text(name, color = color, fontWeight = FontWeight.ExtraBold, fontSize = 20.sp)
        }
        Text(name, color = TamerCadColors.TextSecondary, fontSize = 12.sp)
    }
}
