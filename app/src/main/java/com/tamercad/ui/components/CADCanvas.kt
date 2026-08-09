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
import com.tamercad.ui.navigation.GestureHardenEngine
import com.tamercad.ui.navigation.NavigationMode
import com.tamercad.core.sketch.ProfileValidator
import androidx.compose.material3.Text
import java.util.Locale
import kotlin.math.*

/**
 * TAMERCAD — PHASE 1.5 — TWO-FINGER PAN/ZOOM ROOT-CAUSE FIX
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
                // 1. INPUT ARBITRATION (Refined for isStylusDown reset)
                .pointerInteropFilter { motionEvent ->
                    val stylusEvent = viewModel.stylusInputManager.resolveEvent(motionEvent)
                    viewModel.rawPointerCount = motionEvent.pointerCount
                    viewModel.isStylusInUse = stylusEvent.isStylus
                    
                    if (stylusEvent.isStylus) {
                        viewModel.isStylusDown = motionEvent.actionMasked != android.view.MotionEvent.ACTION_UP && 
                                               motionEvent.actionMasked != android.view.MotionEvent.ACTION_CANCEL
                        viewModel.stylusPressure = stylusEvent.pressure
                    } else {
                        // Reset stylus down if any finger event comes up/cancel and no other pointers exist
                        if (motionEvent.actionMasked == android.view.MotionEvent.ACTION_UP || 
                            motionEvent.actionMasked == android.view.MotionEvent.ACTION_CANCEL) {
                            if (motionEvent.pointerCount == 1) {
                                viewModel.isStylusDown = false
                            }
                        }
                    }

                    if (viewModel.stylusInputManager.isTouchForbidden(stylusEvent)) return@pointerInteropFilter true
                    
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
                // 2. HARDENED NAVIGATION PIPELINE (Manual Loop replacing detectTransformGestures)
                .pointerInput(Unit) {
                    val engine = GestureHardenEngine()
                    awaitPointerEventScope {
                        while (true) {
                            val event = awaitPointerEvent()
                            
                            if (!viewModel.isStylusInUse) {
                                val fingerChanges = event.changes.filter { 
                                    it.type == PointerType.Touch || it.type == PointerType.Unknown 
                                }
                                
                                viewModel.activeFingerCount = fingerChanges.size
                                val pointers = fingerChanges.map { it.position }
                                
                                val res = engine.process(fingerChanges.size, pointers)
                                
                                viewModel.gestureMode = res.mode.name
                                viewModel.diagnosticPanDelta = res.panDelta
                                viewModel.diagnosticZoomScale = res.zoomScale
                                
                                if (res.mode != NavigationMode.IDLE) {
                                    viewModel.updateCamera(
                                        res.yawDelta,
                                        res.pitchDelta,
                                        res.zoomScale,
                                        res.panDelta.x,
                                        res.panDelta.y
                                    )
                                    event.changes.forEach { it.consume() }
                                }
                            } else {
                                engine.reset()
                                viewModel.activeFingerCount = 0
                                viewModel.gestureMode = "IDLE (STYLUS)"
                            }
                        }
                    }
                }
                // 3. SKETCH/STYLUS PRODUCTION (Remains independent)
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
                        onDragEnd = { }
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

        // --- ENHANCED DIAGNOSTIC OVERLAY (PHASE 1.5) ---
        Column(
            modifier = Modifier
                .align(androidx.compose.ui.Alignment.BottomEnd)
                .padding(16.dp)
                .background(Color.Black.copy(alpha = 0.6f))
                .padding(10.dp)
        ) {
            DebugText("INPUT DEVICE: ${if (viewModel.isStylusInUse) "STYLUS" else "FINGER"}")
            DebugText("RAW POINTER COUNT: ${viewModel.rawPointerCount}")
            DebugText("ACTIVE FINGER COUNT: ${viewModel.activeFingerCount}")
            DebugText("GESTURE MODE: ${viewModel.gestureMode}")
            DebugText("STYLUS DOWN: ${viewModel.isStylusDown}")
            DebugText("PRESSURE: ${String.format(Locale.US, "%.3f", viewModel.stylusPressure)}")
            DebugText("YAW: ${String.format(Locale.US, "%.2f", viewModel.cameraYaw)}")
            DebugText("PITCH: ${String.format(Locale.US, "%.2f", viewModel.cameraPitch)}")
            DebugText("PAN X/Y: ${String.format(Locale.US, "%.1f", viewModel.panX)} / ${String.format(Locale.US, "%.1f", viewModel.panY)}")
            DebugText("ZOOM: ${String.format(Locale.US, "%.2f", viewModel.zoom)}")
            DebugText("PAN Δ X/Y: ${String.format(Locale.US, "%.1f", viewModel.diagnosticPanDelta.x)} / ${String.format(Locale.US, "%.1f", viewModel.diagnosticPanDelta.y)}")
            DebugText("ZOOM SCALE: ${String.format(Locale.US, "%.3f", viewModel.diagnosticZoomScale)}")
        }
    }
}

@Composable
fun DebugText(text: String) {
    Text(text, color = Color.Green, fontSize = 10.sp, fontWeight = FontWeight.Bold, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
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
