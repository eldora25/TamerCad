package com.tamercad.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.ui.theme.TamerCadColors

@Composable
fun SelectionMenu(
    selectionPoint: Offset,
    onFillet: () -> Unit,
    onChamfer: () -> Unit,
    onDelete: () -> Unit
) {
    Box(
        modifier = Modifier
            .offset { IntOffset(selectionPoint.x.toInt() + 40, selectionPoint.y.toInt() - 40) }
            .wrapContentSize()
            .clip(RoundedCornerShape(12.dp))
            .background(TamerCadColors.PanelColor)
            .border(1.dp, TamerCadColors.ActiveColor, RoundedCornerShape(12.dp))
            .shadow(8.dp)
            .padding(8.dp)
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            SelectionMenuItem(Icons.Default.Refresh, "Fillet") { onFillet() }
            SelectionMenuItem(Icons.Default.Build, "Chamfer") { onChamfer() }
            SelectionMenuItem(Icons.Default.Delete, "Delete") { onDelete() }
        }
    }
}

@Composable
fun SelectionMenuItem(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .clickable { onClick() }
            .padding(4.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(icon, null, tint = Color.White, modifier = Modifier.size(20.dp))
        Text(label, color = Color.White, fontSize = 8.sp)
    }
}
