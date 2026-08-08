package com.tamercad.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.Icon
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

@Composable
fun TopBar(
    projectName: String,
    currentToolTitle: String?,
    onShare: () -> Unit,
    onMenuClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
    ) {
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(24.dp))
                .background(TamerCadColors.PanelColor)
                .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(24.dp))
                .padding(horizontal = 16.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.Home, contentDescription = "Home", tint = Color.White, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(12.dp))
            Text(projectName, fontWeight = FontWeight.Bold, color = TamerCadColors.TextColor, fontSize = 14.sp)
            Spacer(Modifier.width(4.dp))
            Icon(Icons.Default.KeyboardArrowDown, contentDescription = null, tint = TamerCadColors.IconColor, modifier = Modifier.size(16.dp))
            Spacer(Modifier.width(12.dp))
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(TamerCadColors.ActiveColor)
                    .clickable { onShare() }
                    .padding(horizontal = 14.dp, vertical = 4.dp)
            ) {
                Text("Share...", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
            Spacer(Modifier.width(12.dp))
            Icon(
                Icons.Default.MoreVert, 
                contentDescription = null, 
                tint = Color.White, 
                modifier = Modifier.size(18.dp).clickable { onMenuClick() }
            )
        }

        if (currentToolTitle != null) {
            Spacer(Modifier.width(16.dp))
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(24.dp))
                    .background(TamerCadColors.SecondaryBg)
                    .padding(horizontal = 16.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(currentToolTitle, fontWeight = FontWeight.SemiBold, color = Color.White, fontSize = 13.sp)
                Spacer(Modifier.width(4.dp))
                Icon(Icons.Default.KeyboardArrowDown, contentDescription = null, tint = TamerCadColors.IconColor, modifier = Modifier.size(16.dp))
            }
        }
    }
}
