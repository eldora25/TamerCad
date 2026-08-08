package com.tamercad.ui.app

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
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
import com.tamercad.ui.state.SettingsState

/**
 * TamerCAD Profesyonel Ayarlar Ekranı.
 */
@Composable
fun SettingsScreen(
    state: SettingsState,
    onClose: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.6f))
            .clickable { onClose() },
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .width(480.dp)
                .fillMaxHeight(0.8f)
                .clip(RoundedCornerShape(TamerCadDimensions.CornerLarge))
                .background(TamerCadColors.Surface)
                .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerLarge))
                .clickable(enabled = false) { } // Prevent closing when clicking inside
        ) {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(TamerCadDimensions.SpacingLarge),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Ayarlar", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                IconButton(onClick = onClose) {
                    Icon(Icons.Default.Close, null, tint = Color.White)
                }
            }

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = TamerCadDimensions.SpacingLarge),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                item { SettingsSection("Genel") {
                    SettingsToggle("Koyu Tema", state.isDarkTheme) { state.isDarkTheme = it }
                    SettingsSelect("Birimler", state.units) { /* TODO */ }
                }}
                
                item { SettingsSection("Navigasyon") {
                    SettingsSlider("Orbit Hassasiyeti", state.orbitSensitivity) { state.orbitSensitivity = it }
                    SettingsToggle("Zoom'u Ters Çevir", state.invertZoom) { state.invertZoom = it }
                }}

                item { SettingsSection("Görünüm") {
                    SettingsToggle("Izgarayı Göster", state.showGrid) { state.showGrid = it }
                    SettingsToggle("Eksenleri Göster", state.showAxes) { state.showAxes = it }
                    SettingsToggle("Kenarları Vurgula", state.showEdges) { state.showEdges = it }
                }}
                
                item { Spacer(Modifier.height(40.dp)) }
            }
        }
    }
}

@Composable
private fun SettingsSection(title: String, content: @Composable () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(title, color = TamerCadColors.Primary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        content()
        HorizontalDivider(color = TamerCadColors.PanelBorder)
    }
}

@Composable
private fun SettingsToggle(label: String, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(label, color = TamerCadColors.TextPrimary, fontSize = 14.sp)
        Switch(
            checked = checked, 
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(checkedThumbColor = TamerCadColors.Primary)
        )
    }
}

@Composable
private fun SettingsSlider(label: String, value: Float, onValueChange: (Float) -> Unit) {
    Column {
        Text(label, color = TamerCadColors.TextPrimary, fontSize = 14.sp)
        Slider(
            value = value,
            onValueChange = onValueChange,
            valueRange = 0.1f..2.0f,
            colors = SliderDefaults.colors(thumbColor = TamerCadColors.Primary, activeTrackColor = TamerCadColors.Primary)
        )
    }
}

@Composable
private fun SettingsSelect(label: String, selected: String, onClick: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().clickable { onClick() }.padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, color = TamerCadColors.TextPrimary, fontSize = 14.sp)
        Text(selected, color = TamerCadColors.TextSecondary, fontSize = 14.sp)
    }
}
