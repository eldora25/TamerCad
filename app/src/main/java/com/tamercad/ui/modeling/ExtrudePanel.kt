package com.tamercad.ui.modeling

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadDimensions
import java.util.Locale

/**
 * TamerCAD Extrude (Katılama) Paneli.
 * Mesafe ayarı ve Boolean işlemlerini yönetir.
 */
@Composable
fun ExtrudePanel(
    distance: Double,
    onDistanceChange: (String) -> Unit,
    onAccept: () -> Unit,
    onCancel: () -> Unit
) {
    Box(
        modifier = Modifier
            .padding(16.dp)
            .width(280.dp)
            .clip(RoundedCornerShape(TamerCadDimensions.CornerLarge))
            .background(TamerCadColors.Surface)
            .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerLarge))
            .shadow(TamerCadDimensions.ElevationHigh)
            .padding(TamerCadDimensions.SpacingLarge)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text("Extrude", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            
            // Mesafe Girişi
            OutlinedTextField(
                value = String.format(Locale.US, "%.1f", distance),
                onValueChange = onDistanceChange,
                label = { Text("Mesafe (mm)", color = TamerCadColors.TextSecondary) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = TamerCadColors.Primary
                ),
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            // OPERATIONS
            Text("Operation", color = TamerCadColors.TextSecondary, fontSize = 12.sp)
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                maxItemsInEachRow = 2,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OperationButton("New Body", true)
                OperationButton("Join", false)
                OperationButton("Cut", false)
                OperationButton("Intersect", false)
            }

            // MODIFIERS
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                ModifierToggle("Symmetric", false)
                ModifierToggle("Reverse", false)
            }

            // Onay / İptal
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End, verticalAlignment = Alignment.CenterVertically) {
                TextButton(onClick = onCancel) { Text("İptal", color = TamerCadColors.Error) }
                Spacer(Modifier.width(8.dp))
                Button(
                    onClick = onAccept, 
                    colors = ButtonDefaults.buttonColors(containerColor = TamerCadColors.Primary),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Tamam")
                }
            }
        }
    }
}

@Composable
private fun RowScope.OperationButton(label: String, isSelected: Boolean) {
    Box(
        modifier = Modifier
            .weight(1f)
            .height(36.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(if (isSelected) TamerCadColors.Primary else TamerCadColors.SurfaceElevated)
            .border(1.dp, if (isSelected) TamerCadColors.Primary else TamerCadColors.PanelBorder, RoundedCornerShape(8.dp))
            .clickable { /* TODO */ },
        contentAlignment = Alignment.Center
    ) {
        Text(label, color = if (isSelected) Color.White else TamerCadColors.TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
private fun RowScope.ModifierToggle(label: String, isSelected: Boolean) {
    Box(
        modifier = Modifier
            .weight(1f)
            .height(32.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(if (isSelected) TamerCadColors.Primary.copy(alpha = 0.2f) else Color.Transparent)
            .border(1.dp, if (isSelected) TamerCadColors.Primary else TamerCadColors.TextSecondary.copy(alpha = 0.3f), RoundedCornerShape(16.dp))
            .clickable { /* TODO */ },
        contentAlignment = Alignment.Center
    ) {
        Text(label, color = if (isSelected) TamerCadColors.Primary else TamerCadColors.TextSecondary, fontSize = 10.sp)
    }
}
