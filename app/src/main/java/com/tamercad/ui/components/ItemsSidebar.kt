package com.tamercad.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.List
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.ui.theme.TamerCadColors

@Composable
fun ItemsSidebar(content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = Modifier
            .padding(start = 12.dp, top = 80.dp, bottom = 24.dp)
            .width(220.dp)
            .fillMaxHeight()
            .clip(RoundedCornerShape(16.dp))
            .background(TamerCadColors.PanelColor)
            .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(16.dp))
            .shadow(4.dp)
            .padding(12.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.List, null, tint = TamerCadColors.ActiveColor, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(8.dp))
            Text("Items", color = TamerCadColors.TextColor, fontSize = 14.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
        }
        Spacer(Modifier.height(12.dp))
        content()
    }
}
