package com.tamercad.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
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
    onDrag: (Float, Float) -> Unit
) {
    Box(
        modifier = Modifier
            .size(80.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(TamerCadColors.PanelColor)
            .border(1.dp, TamerCadColors.PanelBorder, RoundedCornerShape(12.dp))
    ) {
        Canvas(
            modifier = Modifier.fillMaxSize()
                .pointerInput(Unit) {
                    detectTapGestures(onTap = { offset ->
                        val projectedHitFaces = navFaces.map { face ->
                            val tNormal = projectNav3DTo2D(face.normal, cameraPitch, cameraYaw)
                            val tVertices = face.vertices.map { v -> 
                                val p = projectNav3DTo2D(v, cameraPitch, cameraYaw)
                                Offset((size.width / 2f) + p.x.toFloat() * (size.width / 2f * 0.6f), (size.height / 2f) + p.y.toFloat() * (size.width / 2f * 0.6f)) 
                            }
                            Triple(face, tNormal, tVertices)
                        }.filter { it.second.z > 0 }.sortedByDescending { it.second.z }
                        for ((face, _, verts) in projectedHitFaces) {
                            if (isPointInPolygon(offset, verts)) { 
                                onViewChange(face.pitch, face.yaw); break 
                            }
                        }
                    })
                }
                .pointerInput(Unit) { 
                    detectDragGestures(onDrag = { change, dragAmount -> 
                        change.consume(); 
                        onDrag(dragAmount.x, dragAmount.y)
                    }) 
                }
        ) {
            val radius = size.width / 2f; val center = Offset(size.width / 2f, size.height / 2f); val scale = radius * 0.6f
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
                    lineTo(tVertices[1].x, tVertices[1].y)
                    lineTo(tVertices[2].x, tVertices[2].y)
                    lineTo(tVertices[3].x, tVertices[3].y)
                    close() 
                }
                drawPath(path = path, color = face.color)
                drawPath(path = path, color = Color.Gray, style = Stroke(width = 1f))
                val cx = tVertices.map { it.x }.average().toFloat()
                val cy = tVertices.map { it.y }.average().toFloat()
                val paint = android.graphics.Paint().apply { 
                    setColor(android.graphics.Color.WHITE)
                    textSize = scale * 0.35f
                    textAlign = android.graphics.Paint.Align.CENTER
                    isAntiAlias = true
                    typeface = android.graphics.Typeface.DEFAULT_BOLD 
                }
                drawContext.canvas.nativeCanvas.drawText(face.name, cx, cy - ((paint.descent() + paint.ascent()) / 2), paint)
            }
        }
    }
}
