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
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadDimensions
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
            .zIndex(100f)
            .width(TamerCadDimensions.BrowserWidth)
            .fillMaxHeight(0.6f)
            .clip(RoundedCornerShape(TamerCadDimensions.CornerMedium))
            .background(TamerCadColors.Surface)
            .border(TamerCadDimensions.BorderThin, TamerCadColors.PanelBorder, RoundedCornerShape(TamerCadDimensions.CornerMedium))
            .shadow(TamerCadDimensions.ElevationMedium)
    ) {
        Column {
            // Sürüklenebilir Başlık Çubuğu
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(40.dp)
                    .background(TamerCadColors.SurfaceElevated)
                    .pointerInput(Unit) {
                        detectDragGestures { change, dragAmount ->
                            change.consume()
                            onOffsetChange(currentOffset + dragAmount)
                        }
                    }
                    .padding(horizontal = TamerCadDimensions.SpacingMedium),
                contentAlignment = Alignment.CenterStart
            ) {
                Text(
                    "Browser",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = TamerCadColors.TextPrimary
                )
            }
            
            LazyColumn(
                modifier = Modifier.padding(TamerCadDimensions.SpacingMedium),
                verticalArrangement = Arrangement.spacedBy(TamerCadDimensions.SpacingSmall)
            ) {
                // BODIES & FEATURES
                items(assembly.components) { comp ->
                    var isExpanded by remember { mutableStateOf(false) }
                    
                    Column {
                        ObjectTreeItem(
                            name = comp.name,
                            isSelected = comp.isSelected,
                            isVisible = comp.isVisible,
                            isExpanded = isExpanded,
                            onVisibilityToggle = { onVisibilityToggle(comp) },
                            onRenameRequest = { onRenameRequest(comp) },
                            onSelect = { onSelect(comp); isExpanded = !isExpanded },
                            icon = Icons.Default.ViewInAr
                        )
                        
                        if (isExpanded) {
                            comp.features.forEach { feat ->
                                ObjectTreeSubItem(
                                    name = feat.name,
                                    icon = if (feat.type == "ExtrudeFeature") Icons.Default.Upload else Icons.Default.Settings,
                                    onSelect = { /* TODO */ }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun ObjectTreeItem(
    name: String,
    isSelected: Boolean,
    isVisible: Boolean,
    isExpanded: Boolean,
    icon: ImageVector,
    onVisibilityToggle: () -> Unit,
    onRenameRequest: () -> Unit,
    onSelect: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(TamerCadDimensions.CornerSmall))
            .background(if (isSelected) TamerCadColors.Primary.copy(alpha = 0.2f) else Color.Transparent)
            .combinedClickable(
                onClick = onSelect,
                onDoubleClick = onRenameRequest
            )
            .padding(horizontal = TamerCadDimensions.SpacingSmall, vertical = TamerCadDimensions.SpacingMedium),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            if (isExpanded) Icons.Default.KeyboardArrowDown else Icons.Default.KeyboardArrowRight,
            null,
            tint = TamerCadColors.TextSecondary,
            modifier = Modifier.size(14.dp)
        )
        
        Spacer(Modifier.width(4.dp))
        
        Icon(
            icon,
            null,
            tint = if (isSelected) TamerCadColors.Primary else TamerCadColors.TextSecondary,
            modifier = Modifier.size(TamerCadDimensions.IconSmall)
        )
        
        Spacer(Modifier.width(TamerCadDimensions.SpacingMedium))
        
        Text(
            name,
            color = if (isSelected) TamerCadColors.Primary else TamerCadColors.TextPrimary,
            fontSize = 13.sp,
            modifier = Modifier.weight(1f),
            maxLines = 1
        )

        Icon(
            if (isVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
            null,
            tint = if (isVisible) TamerCadColors.Primary else Color.Gray,
            modifier = Modifier
                .size(TamerCadDimensions.IconSmall)
                .clickable { onVisibilityToggle() }
        )
    }
}

@Composable
fun ObjectTreeSubItem(
    name: String,
    icon: ImageVector,
    onSelect: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 24.dp)
            .clickable { onSelect() }
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, null, tint = TamerCadColors.TextSecondary, modifier = Modifier.size(12.dp))
        Spacer(Modifier.width(8.dp))
        Text(name, color = TamerCadColors.TextSecondary, fontSize = 11.sp, maxLines = 1)
    }
}
