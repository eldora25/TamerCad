package com.tamercad.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.input.pointer.PointerType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.pointerInteropFilter
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.core.features.ExtrudeFeature
import com.tamercad.core.features.RevolveFeature
import com.tamercad.core.geometry.*
import com.tamercad.core.math.*
import com.tamercad.core.rendering.VisualEngine
import com.tamercad.core.sketch.SnapType
import com.tamercad.core.sketch.SnapResult
import com.tamercad.ui.CADViewModel
import com.tamercad.ui.CadMode
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.interaction.InteractionState
import com.tamercad.core.sketch.ProfileValidator
import androidx.compose.material3.Text
import java.util.Locale
import kotlin.math.*

/**
 * TAMERCAD — PHASE 1.3 — GESTURE PIPELINE RECOVERY
 */
@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun CADCanvas(viewModel: CADViewModel) {
    val context = LocalContext.current
    val configuration = LocalConfiguration.current
    val screenWidth = configuration.screenWidthDp.toFloat()
    val screenHeight = configuration.screenHeightDp.toFloat()

    Box(modifier = Modifier.fillMaxSize()) {
        Canvas(
            modifier = Modifier
                .fillMaxSize()
                .background(if (viewModel.isSketchMode) TamerCadColors.SketchBgColor else TamerCadColors.BgColor)
                // 1. INPUT CLASSIFIER (Syncs pointerCount to ViewModel)
                .pointerInteropFilter { motionEvent ->
                    val stylusEvent = viewModel.stylusInputManager.resolveEvent(motionEvent)
                    viewModel.pointerCount = motionEvent.pointerCount
                    
                    if (viewModel.stylusInputManager.isTouchForbidden(stylusEvent)) return@pointerInteropFilter true
                    viewModel.isStylusInUse = stylusEvent.isStylus
                    
                    if (viewModel.isStylusInUse) {
                        when (motionEvent.actionMasked) {
                            android.view.MotionEvent.ACTION_UP -> {
                                if (viewModel.interactionState == InteractionState.STYLUS_DRAWING) {
                                    viewModel.onSketchDragEnd(context)
                                }
                                viewModel.interactionState = InteractionState.IDLE
                            }
                        }
                    }
                    false
                }
                // 2. NAVIGATION PIPELINE
                .pointerInput(Unit) {
                    detectTransformGestures { _, pan, zoomDelta, _ ->
                        if (!viewModel.isStylusInUse) {
                            if (viewModel.pointerCount > 1) {
                                // TWO-FINGER: PAN & ZOOM
                                viewModel.interactionState = InteractionState.MULTI_TOUCH_NAVIGATING
                                viewModel.zoom *= zoomDelta
                                viewModel.panX += pan.x
                                viewModel.panY += pan.y
                            } else {
                                // SINGLE-FINGER: ORBIT
                                viewModel.interactionState = InteractionState.FINGER_NAVIGATING
                                viewModel.cameraYaw += pan.x * 0.005f
                                viewModel.cameraPitch -= pan.y * 0.005f
                            }
                            viewModel.triggerUpdate()
                        }
                    }
                }
                // 3. SKETCH/STYLUS PRODUCTION
                .pointerInput(Unit) {
                    detectDragGestures(
                        onDragStart = { offset ->
                            if (viewModel.isStylusInUse) {
                                viewModel.interactionState = if (viewModel.isSketchMode) InteractionState.STYLUS_DRAWING else InteractionState.STYLUS_MANIPULATING
                                viewModel.onSketchDragStart(offset, screenWidth, screenHeight, context)
                            }
                        },
                        onDrag = { change, dragAmount ->
                            if (viewModel.isStylusInUse) {
                                viewModel.onSketchDrag(change.position, dragAmount, screenWidth, screenHeight, context)
                            }
                        },
                        onDragEnd = { /* InteropFilter handles it */ }
                    )
                }
        ) {
            drawWorldGrid(this, viewModel)
            drawWorldAxes(this, viewModel)

            viewModel.previewGeometry?.let { geom ->
                if (geom is Line) {
                    drawLine(TamerCadColors.Primary, viewModel.worldToScreen(geom.startPoint, size.width, size.height), viewModel.worldToScreen(geom.endPoint, size.width, size.height), 4f)
                }
            }

            viewModel.activeSketch.getGeometries().forEach { geom ->
                if (geom is Line) {
                    drawLine(Color.Blue, viewModel.worldToScreen(geom.startPoint, size.width, size.height), viewModel.worldToScreen(geom.endPoint, size.width, size.height), 2f)
                }
            }
            
            viewModel.currentSnap?.let { snap ->
                if (snap.type != SnapType.NONE) {
                    drawSnapMarker(this, viewModel, snap)
                }
            }
        }

        // --- ENHANCED DEBUG OVERLAY ---
        Column(
            modifier = Modifier
                .align(androidx.compose.ui.Alignment.BottomEnd)
                .padding(16.dp)
                .background(Color.Black.copy(alpha = 0.5f))
                .padding(8.dp)
        ) {
            DebugText("INPUT: ${if (viewModel.isStylusInUse) "STYLUS" else "FINGER"}")
            DebugText("POINTERS: ${viewModel.pointerCount}")
            DebugText("STATE: ${viewModel.interactionState}")
            DebugText("YAW/PITCH: ${String.format("%.2f", viewModel.cameraYaw)}/${String.format("%.2f", viewModel.cameraPitch)}")
            DebugText("PAN: X=${String.format("%.1f", viewModel.panX)} Y=${String.format("%.1f", viewModel.panY)}")
            DebugText("ZOOM: ${String.format("%.2f", viewModel.zoom)}")
        }
    }
}

@Composable
fun DebugText(text: String) {
    Text(text, color = Color.Green, fontSize = 12.sp, fontWeight = FontWeight.Bold)
}

fun drawWorldGrid(drawScope: DrawScope, viewModel: CADViewModel) {
    val screenWidth = drawScope.size.width
    val screenHeight = drawScope.size.height
    val gridCount = 20
    val gridSpacing = 100.0

    for (i in -gridCount..gridCount) {
        val startX = viewModel.worldToScreen(Point3(i * gridSpacing, -gridCount * gridSpacing, 0.0), screenWidth, screenHeight)
        val endX = viewModel.worldToScreen(Point3(i * gridSpacing, gridCount * gridSpacing, 0.0), screenWidth, screenHeight)
        drawScope.drawLine(Color.Gray.copy(alpha = 0.15f), startX, endX, 1f)

        val startY = viewModel.worldToScreen(Point3(-gridCount * gridSpacing, i * gridSpacing, 0.0), screenWidth, screenHeight)
        val endY = viewModel.worldToScreen(Point3(gridCount * gridSpacing, i * gridSpacing, 0.0), screenWidth, screenHeight)
        drawScope.drawLine(Color.Gray.copy(alpha = 0.15f), startY, endY, 1f)
    }
}

fun drawWorldAxes(drawScope: DrawScope, viewModel: CADViewModel) {
    val screenWidth = drawScope.size.width
    val screenHeight = drawScope.size.height
    val axisLength = 200.0
    val origin = Point3(0.0, 0.0, 0.0)
    val originScreen = viewModel.worldToScreen(origin, screenWidth, screenHeight)
    
    drawScope.drawLine(TamerCadColors.AxisX, originScreen, viewModel.worldToScreen(Point3(axisLength, 0.0, 0.0), screenWidth, screenHeight), 3f)
    drawScope.drawLine(TamerCadColors.AxisY, originScreen, viewModel.worldToScreen(Point3(0.0, axisLength, 0.0), screenWidth, screenHeight), 3f)
    drawScope.drawLine(TamerCadColors.AxisZ, originScreen, viewModel.worldToScreen(Point3(0.0, 0.0, axisLength), screenWidth, screenHeight), 3f)
}

/**
 * Advanced Snap Marker Rendering.
 */
fun drawSnapMarker(drawScope: DrawScope, viewModel: CADViewModel, snap: SnapResult) {
    val screenPos = viewModel.worldToScreen(snap.point, drawScope.size.width, drawScope.size.height)
    val color = TamerCadColors.SnapColor
    val size = 12f
    
    when (snap.type) {
        SnapType.ENDPOINT -> {
            drawScope.drawRect(color, Offset(screenPos.x - size/2, screenPos.y - size/2), Size(size, size), style = Stroke(2f))
        }
        SnapType.MIDPOINT -> {
            val path = Path().apply {
                moveTo(screenPos.x, screenPos.y - size/2)
                lineTo(screenPos.x - size/2, screenPos.y + size/2)
                lineTo(screenPos.x + size/2, screenPos.y + size/2)
                close()
            }
            drawScope.drawPath(path, color, style = Stroke(2f))
        }
        SnapType.CENTER -> {
            drawScope.drawCircle(color, size/2, screenPos, style = Stroke(2f))
        }
        SnapType.INTERSECTION -> {
            drawScope.drawLine(color, Offset(screenPos.x - size/2, screenPos.y - size/2), Offset(screenPos.x + size/2, screenPos.y + size/2), 2f)
            drawScope.drawLine(color, Offset(screenPos.x + size/2, screenPos.y - size/2), Offset(screenPos.x - size/2, screenPos.y + size/2), 2f)
        }
        SnapType.GRID -> {
            drawScope.drawCircle(color.copy(alpha = 0.5f), 4f, screenPos)
        }
        SnapType.HORIZONTAL, SnapType.VERTICAL -> {
            // Draw Inference Line
            viewModel.startSnap?.let { start ->
                val startScreen = viewModel.worldToScreen(start.point, drawScope.size.width, drawScope.size.height)
                drawScope.drawLine(
                    color = color,
                    start = startScreen,
                    end = screenPos,
                    strokeWidth = 2f,
                    pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f)
                )
            }
            drawScope.drawCircle(color, 6f, screenPos, style = Stroke(2f))
        }
        else -> {
            drawScope.drawCircle(color, 8f, screenPos, style = Stroke(2f))
        }
    }
}
