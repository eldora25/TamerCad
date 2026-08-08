package com.tamercad.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.ui.CadMode
import com.tamercad.ui.getIconForMode
import com.tamercad.ui.theme.TamerCadColors
import androidx.compose.foundation.ExperimentalFoundationApi

@Composable
fun RightPanelItem(title: String, subtitle: String?, icon: ImageVector?) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(title, fontWeight = FontWeight.SemiBold, fontSize = 11.sp, color = Color.White)
            if (subtitle != null) Text(subtitle, fontSize = 10.sp, color = Color(0xFFA1A1AA))
        }
        if (icon != null) {
            Box(
                modifier = Modifier
                    .size(24.dp)
                    .clip(RoundedCornerShape(6.dp))
                    .background(TamerCadColors.SecondaryBg),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
            }
        }
    }
}

@Composable
fun ConstraintBadge(label: String, symbol: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(label, color = Color(0xFFA1A1AA), fontSize = 11.sp, fontWeight = FontWeight.Medium)
        Text(
            symbol,
            color = TamerCadColors.TextColor,
            fontWeight = FontWeight.Bold,
            fontSize = 11.sp,
            modifier = Modifier
                .background(TamerCadColors.SecondaryBg, RoundedCornerShape(4.dp))
                .padding(horizontal = 6.dp, vertical = 2.dp)
        )
    }
}

@Composable
fun LabeledSidebarIconButton(
    icon: ImageVector,
    label: String,
    isSelected: Boolean,
    status: String? = null, // "Saved", "Saving..." vb. için
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .width(64.dp)
            .clickable { onClick() }
            .padding(vertical = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(if (isSelected) TamerCadColors.Primary.copy(alpha = 0.2f) else Color.Transparent),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = label, tint = if (isSelected) TamerCadColors.Primary else TamerCadColors.TextSecondary, modifier = Modifier.size(20.dp))
        }
        if (label.isNotEmpty()) {
            Spacer(Modifier.height(2.dp))
            Text(
                label,
                color = if (isSelected) TamerCadColors.Primary else TamerCadColors.TextSecondary,
                fontSize = 9.sp,
                fontWeight = FontWeight.Medium,
                maxLines = 1
            )
        }
        if (status != null) {
            Text(status, color = TamerCadColors.TextSecondary.copy(alpha = 0.7f), fontSize = 8.sp)
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun DynamicToolButton(mode: CadMode, label: String, isSelected: Boolean, onClick: () -> Unit, onLongClick: () -> Unit) {
    Column(
        modifier = Modifier
            .width(64.dp)
            .combinedClickable(onClick = onClick, onLongClick = onLongClick)
            .padding(vertical = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(if (isSelected) TamerCadColors.ActiveColor.copy(alpha = 0.2f) else Color.Transparent),
            contentAlignment = Alignment.Center
        ) {
            Icon(getIconForMode(mode), contentDescription = null, tint = if (isSelected) TamerCadColors.ActiveColor else TamerCadColors.IconColor, modifier = Modifier.size(20.dp))
            Box(modifier = Modifier.align(Alignment.BottomEnd).padding(2.dp).size(4.dp).background(Color.Gray, RoundedCornerShape(1.dp)))
        }
        Spacer(Modifier.height(2.dp))
        Text(label, color = if (isSelected) TamerCadColors.ActiveColor else TamerCadColors.IconColor, fontSize = 9.sp, fontWeight = FontWeight.Medium)
    }
}
