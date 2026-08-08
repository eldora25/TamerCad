package com.tamercad.ui.modeling

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
            .width(260.dp)
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

            // İşlemler (Boolean)
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OperationButton("Yeni", true)
                OperationButton("Ekle", false)
                OperationButton("Kes", false)
            }

            // Onay / İptal
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                TextButton(onClick = onCancel) { Text("İptal", color = TamerCadColors.Error) }
                Button(onClick = onAccept, colors = ButtonDefaults.buttonColors(containerColor = TamerCadColors.Primary)) {
                    Text("Uygula")
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
            .border(1.dp, if (isSelected) TamerCadColors.Primary else TamerCadColors.PanelBorder, RoundedCornerShape(8.dp)),
        contentAlignment = Alignment.Center
    ) {
        Text(label, color = if (isSelected) Color.White else TamerCadColors.TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
    }
}
