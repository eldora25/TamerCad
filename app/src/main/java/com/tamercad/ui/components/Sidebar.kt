package com.tamercad.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInRoot
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.core.assembly.Assembly3D
import com.tamercad.core.assembly.Component3D
import com.tamercad.ui.RenderMaterial
import com.tamercad.ui.theme.TamerCadColors

@Composable
fun Sidebar(
    title: String,
    assembly: Assembly3D,
    availableMaterials: List<RenderMaterial>,
    onClose: () -> Unit,
    onComponentClick: (Component3D) -> Unit,
    onMaterialDragStart: (RenderMaterial, Offset) -> Unit,
    onMaterialDrag: (Offset) -> Unit,
    onMaterialDragEnd: (Offset, RenderMaterial) -> Unit
) {
    Box(
        modifier = Modifier
            .padding(start = 75.dp, top = 80.dp)
            .width(240.dp)
            .fillMaxHeight(0.85f)
            .clip(RoundedCornerShape(12.dp))
            .background(TamerCadColors.PanelColor)
            .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(12.dp))
            .shadow(8.dp)
            .padding(14.dp)
    ) {
        Column {
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = TamerCadColors.TextColor
                )
                Icon(
                    Icons.Default.Close,
                    "Close",
                    tint = TamerCadColors.IconColor,
                    modifier = Modifier.clickable { onClose() }
                )
            }
            Spacer(Modifier.height(12.dp))

            if (title == "All Items") {
                LazyColumn {
                    items(assembly.components) { comp ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp)
                                .clickable { onComponentClick(comp) },
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                if (comp.isSelected) Icons.Default.CheckCircle else Icons.Default.Info,
                                "Body",
                                tint = if (comp.isSelected) TamerCadColors.ActiveColor else TamerCadColors.IconColor,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(Modifier.width(10.dp))
                            Text(
                                comp.name,
                                color = if (comp.isSelected) TamerCadColors.ActiveColor else TamerCadColors.TextColor,
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            } else if (title == "Materials") {
                Text("Drag & Drop onto a 3D body", fontSize = 11.sp, color = Color.Gray)
                Spacer(Modifier.height(12.dp))
                LazyColumn {
                    items(availableMaterials) { mat ->
                        var itemPosition by remember { mutableStateOf(Offset.Zero) }
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp)
                                .onGloballyPositioned { layoutCoordinates ->
                                    itemPosition = layoutCoordinates.positionInRoot()
                                }
                                .pointerInput(mat) {
                                    detectDragGestures(
                                        onDragStart = { offset ->
                                            onMaterialDragStart(mat, itemPosition + offset)
                                        },
                                        onDrag = { change, dragAmount ->
                                            change.consume()
                                            onMaterialDrag(dragAmount)
                                        },
                                        onDragEnd = {
                                            onMaterialDragEnd(Offset.Zero, mat) // The caller should know the current drag offset
                                        }
                                    )
                                },
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clip(CircleShape)
                                    .background(mat.color)
                                    .border(1.dp, Color.LightGray, CircleShape)
                            )
                            Spacer(Modifier.width(10.dp))
                            Text(mat.name, color = TamerCadColors.TextColor, fontSize = 13.sp)
                        }
                    }
                }
            }
        }
    }
}
