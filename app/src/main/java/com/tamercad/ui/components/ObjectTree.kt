package com.tamercad.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.core.assembly.Assembly3D
import com.tamercad.core.assembly.Component3D
import com.tamercad.core.features.ExtrudeFeature
import com.tamercad.ui.theme.TamerCadColors
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.combinedClickable

import androidx.compose.ui.zIndex
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.ui.unit.IntOffset
import androidx.compose.foundation.layout.offset

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun ObjectTree(
    assembly: Assembly3D,
    onVisibilityToggle: (Component3D) -> Unit,
    onRenameRequest: (Component3D) -> Unit,
    onSelect: (Component3D) -> Unit,
    offset: Offset,
    onOffsetChange: (Offset) -> Unit,
    updateTrigger: Int,
    isVisible: Boolean
) {
    if (!isVisible) return
    val currentOffset by rememberUpdatedState(offset)

    Box(
        modifier = Modifier
            .offset { IntOffset(offset.x.toInt(), offset.y.toInt()) }
            .zIndex(100f) // En üstte olduğundan emin ol
            .width(220.dp)
            .fillMaxHeight(0.6f)
            .clip(RoundedCornerShape(12.dp))
            .background(TamerCadColors.PanelColor)
            .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(12.dp))
            .shadow(8.dp)
    ) {
        Column {
            // Sürüklenebilir Başlık Çubuğu
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(40.dp)
                    .background(TamerCadColors.SecondaryBg)
                    .pointerInput(Unit) {
                        detectDragGestures { change, dragAmount ->
                            change.consume()
                            onOffsetChange(currentOffset + dragAmount)
                        }
                    }
                    .padding(horizontal = 12.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Text(
                    "Browser",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = TamerCadColors.TextColor
                )
            }
            
            LazyColumn(
                modifier = Modifier.padding(8.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                items(assembly.components) { comp ->
                    ObjectTreeItem(
                        component = comp,
                        onVisibilityToggle = { onVisibilityToggle(comp) },
                        onRenameRequest = { onRenameRequest(comp) },
                        onSelect = { onSelect(comp) }
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun ObjectTreeItem(
    component: Component3D,
    onVisibilityToggle: () -> Unit,
    onRenameRequest: () -> Unit,
    onSelect: () -> Unit
) {
    val icon = when {
        component.name.contains("Sketch", true) -> Icons.Default.Create
        component.name.contains("Plane", true) -> Icons.Default.Menu
        else -> Icons.Default.Build // Solid/Body icon
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(6.dp))
            .background(if (component.isSelected) TamerCadColors.ActiveColor.copy(alpha = 0.2f) else Color.Transparent)
            .combinedClickable(
                onClick = onSelect,
                onDoubleClick = onRenameRequest
            )
            .padding(horizontal = 4.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Tür İkonu (Sol)
        Icon(
            icon,
            null,
            tint = if (component.isSelected) TamerCadColors.ActiveColor else TamerCadColors.IconColor,
            modifier = Modifier.size(16.dp)
        )
        
        Spacer(Modifier.width(8.dp))
        
        // İsim (Orta)
        Text(
            component.name,
            color = if (component.isSelected) TamerCadColors.ActiveColor else TamerCadColors.TextColor,
            fontSize = 13.sp,
            modifier = Modifier.weight(1f),
            maxLines = 1
        )

        // Göz İkonu (Sağ)
        Icon(
            if (component.isVisible) Icons.Default.CheckCircle else Icons.Default.Clear, // Eye icon simülasyonu
            null,
            tint = if (component.isVisible) TamerCadColors.ActiveColor else Color.Gray,
            modifier = Modifier
                .size(18.dp)
                .clickable { onVisibilityToggle() }
        )
    }
}
