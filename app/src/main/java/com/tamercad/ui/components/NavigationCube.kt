package com.tamercad.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import com.tamercad.ui.theme.TamerCadColors
import kotlin.math.cos
import kotlin.math.sin

data class NavVec3(val x: Double, val y: Double, val z: Double)
data class NavFace(val name: String, val normal: NavVec3, val pitch: Float, val yaw: Float, val color: Color, val vertices: List<NavVec3>)

private const val cubeScale = 1.0
val navFaces = listOf(
    NavFace("FRONT", NavVec3(0.0, 0.0, 1.0), 0f, 0f, Color(0xFF2C2C34), listOf(NavVec3(-cubeScale, -cubeScale, cubeScale), NavVec3(cubeScale, -cubeScale, cubeScale), NavVec3(cubeScale, cubeScale, cubeScale), NavVec3(-cubeScale, cubeScale, cubeScale))),
    NavFace("BACK", NavVec3(0.0, 0.0, -1.0), 0f, Math.PI.toFloat(), Color(0xFF222228), listOf(NavVec3(cubeScale, -cubeScale, -cubeScale), NavVec3(-cubeScale, -cubeScale, -cubeScale), NavVec3(-cubeScale, cubeScale, -cubeScale), NavVec3(cubeScale, cubeScale, -cubeScale))),
    NavFace("TOP", NavVec3(0.0, -1.0, 0.0), Math.PI.toFloat() / 2f, 0f, Color(0xFF383842), listOf(NavVec3(-cubeScale, -cubeScale, -cubeScale), NavVec3(cubeScale, -cubeScale, -cubeScale), NavVec3(cubeScale, -cubeScale, cubeScale), NavVec3(-cubeScale, -cubeScale, cubeScale))),
    NavFace("BTM", NavVec3(0.0, 1.0, 0.0), -Math.PI.toFloat() / 2f, 0f, Color(0xFF1A1A20), listOf(NavVec3(-cubeScale, cubeScale, cubeScale), NavVec3(cubeScale, cubeScale, cubeScale), NavVec3(cubeScale, cubeScale, -cubeScale), NavVec3(-cubeScale, cubeScale, -cubeScale))),
    NavFace("RIGHT", NavVec3(1.0, 0.0, 0.0), 0f, Math.PI.toFloat() / 2f, Color(0xFF32323C), listOf(NavVec3(cubeScale, -cubeScale, cubeScale), NavVec3(cubeScale, -cubeScale, -cubeScale), NavVec3(cubeScale, cubeScale, -cubeScale), NavVec3(cubeScale, cubeScale, cubeScale))),
    NavFace("LEFT", NavVec3(-1.0, 0.0, 0.0), 0f, -Math.PI.toFloat() / 2f, Color(0xFF26262E), listOf(NavVec3(-cubeScale, -cubeScale, -cubeScale), NavVec3(-cubeScale, -cubeScale, cubeScale), NavVec3(-cubeScale, cubeScale, cubeScale), NavVec3(-cubeScale, cubeScale, -cubeScale)))
)

fun projectNav3DTo2D(p: NavVec3, pitch: Float, yaw: Float): NavVec3 {
    val cosY = cos(yaw.toDouble()); val sinY = sin(yaw.toDouble())
    val cosP = cos(pitch.toDouble()); val sinP = sin(pitch.toDouble())
    val x1 = p.x * cosY - p.z * sinY; val z1 = p.x * sinY + p.z * cosY
    val y2 = p.y * cosP - z1 * sinP; val z2 = p.y * sinP + z1 * cosP
    return NavVec3(x1, y2, z2)
}

fun isPointInPolygon(point: Offset, vertices: List<Offset>): Boolean {
    var isInside = false; var j = vertices.size - 1
    for (i in vertices.indices) {
        val vi = vertices[i]; val vj = vertices[j]
        if (((vi.y > point.y) != (vj.y > point.y)) && (point.x < (vj.x - vi.x) * (point.y - vi.y) / (vj.y - vi.y) + vi.x)) { isInside = !isInside }
        j = i
    }
    return isInside
}

@Composable
fun NavigationCube(
    cameraPitch: Float,
    cameraYaw: Float,
    onViewChange: (Float, Float) -> Unit,
    onDrag: (Float, Float) -> Unit,
    onHomeClick: () -> Unit,
    onFitAllClick: () -> Unit,
    isPerspective: Boolean,
    onTogglePerspective: () -> Unit
) {
    Column(
        modifier = Modifier.wrapContentSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // VIEW CUBE
        Box(
            modifier = Modifier
                .size(100.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(TamerCadColors.Surface.copy(alpha = 0.8f))
                .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(16.dp))
        ) {
            Canvas(
                modifier = Modifier
                    .fillMaxSize()
                    .pointerInput(cameraPitch, cameraYaw) {
                        detectTapGestures(onTap = { offset ->
                            val w = size.width; val h = size.height
                            
                            // Corners (Isometric Views)
                            if (offset.x < w*0.25f && offset.y < h*0.25f) { onViewChange(0.6f, 0.6f); return@detectTapGestures }
                            if (offset.x > w*0.75f && offset.y < h*0.25f) { onViewChange(0.6f, -0.6f); return@detectTapGestures }
                            if (offset.x < w*0.25f && offset.y > h*0.75f) { onViewChange(-0.6f, 0.6f); return@detectTapGestures }
                            if (offset.x > w*0.75f && offset.y > h*0.75f) { onViewChange(-0.6f, -0.6f); return@detectTapGestures }

                            // Faces
                            val projectedHitFaces = navFaces.map { face ->
                                val tNormal = projectNav3DTo2D(face.normal, cameraPitch, cameraYaw)
                                val tVertices = face.vertices.map { v -> 
                                    val p = projectNav3DTo2D(v, cameraPitch, cameraYaw)
                                    Offset((size.width / 2f) + p.x.toFloat() * (size.width / 2f * 0.7f), (size.height / 2f) + p.y.toFloat() * (size.width / 2f * 0.7f)) 
                                }
                                Triple(face, tNormal, tVertices)
                            }.filter { it.second.z > 0 }.sortedByDescending { it.second.z }
                            
                            for ((face, _, verts) in projectedHitFaces) {
                                if (isPointInPolygon(offset, verts)) { 
                                    onViewChange(face.pitch, face.yaw)
                                    return@detectTapGestures
                                }
                            }
                        })
                    }
                    .pointerInput(Unit) { 
                        detectDragGestures(onDrag = { change, dragAmount -> 
                            change.consume(); onDrag(dragAmount.x, dragAmount.y)
                        }) 
                    }
            ) {
                val center = Offset(size.width / 2f, size.height / 2f)
                val scale = size.width / 2f * 0.7f
                
                val projectedFaces = navFaces.map { face ->
                    val tNormal = projectNav3DTo2D(face.normal, cameraPitch, cameraYaw)
                    val tVertices = face.vertices.map { v -> 
                        val p = projectNav3DTo2D(v, cameraPitch, cameraYaw)
                        Offset(center.x + p.x.toFloat() * scale, center.y + p.y.toFloat() * scale) 
                    }
                    Triple(face, tNormal, tVertices)
                }.filter { it.second.z > 0 }.sortedBy { it.second.z } 
                
                projectedFaces.forEach { (face, _, tVertices) ->
                    val path = Path().apply { 
                        moveTo(tVertices[0].x, tVertices[0].y)
                        tVertices.drop(1).forEach { lineTo(it.x, it.y) }
                        close() 
                    }
                    drawPath(path = path, color = face.color)
                    drawPath(path = path, color = TamerCadColors.PanelBorder, style = Stroke(width = 1f))
                    
                    val cx = tVertices.map { it.x }.average().toFloat()
                    val cy = tVertices.map { it.y }.average().toFloat()
                    val paint = android.graphics.Paint().apply { 
                        setColor(android.graphics.Color.WHITE)
                        textSize = 24f
                        textAlign = android.graphics.Paint.Align.CENTER
                        isAntiAlias = true
                        typeface = android.graphics.Typeface.DEFAULT_BOLD 
                    }
                    drawContext.canvas.nativeCanvas.drawText(face.name.take(1), cx, cy + 8f, paint)
                }
            }
        }

        // NAVIGATION BUTTONS
        Row(
            modifier = Modifier
                .wrapContentSize()
                .background(TamerCadColors.Surface.copy(alpha = 0.8f), CircleShape)
                .border(1.dp, TamerCadColors.PanelBorder, CircleShape)
                .padding(4.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            IconButton(onClick = onHomeClick, modifier = Modifier.size(32.dp)) {
                Icon(Icons.Default.Home, "Home", tint = Color.White, modifier = Modifier.size(18.dp))
            }
            IconButton(onClick = onFitAllClick, modifier = Modifier.size(32.dp)) {
                Icon(Icons.Default.ZoomOutMap, "Fit", tint = Color.White, modifier = Modifier.size(18.dp))
            }
            IconButton(onClick = onTogglePerspective, modifier = Modifier.size(32.dp)) {
                Icon(
                    if (isPerspective) Icons.Default.ViewInAr else Icons.Default.CropFree, 
                    "Projection", 
                    tint = Color.White, 
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}
