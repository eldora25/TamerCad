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
import com.tamercad.ui.CADViewModel
import com.tamercad.ui.CadMode
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.interaction.InteractionState
import com.tamercad.core.sketch.ProfileValidator
import androidx.compose.material3.Text
import java.util.Locale
import kotlin.math.*

/**
 * TAMERCAD — PHASE 1.1 — REAL DEVICE INPUT REGRESSION FIX
 * Zırhlı Girdi Katmanı ve Debug Overlay.
 */
@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun CADCanvas(viewModel: CADViewModel) {
    val context = LocalContext.current
    val configuration = LocalConfiguration.current
    val screenWidth = configuration.screenWidthDp.toFloat()
    val screenHeight = configuration.screenHeightDp.toFloat()
    
    var pointerCount by androidx.compose.runtime.remember { androidx.compose.runtime.mutableIntStateOf(0) }

    Box(modifier = Modifier.fillMaxSize()) {
        Canvas(
            modifier = Modifier
                .fillMaxSize()
                .background(if (viewModel.isSketchMode) TamerCadColors.SketchBgColor else TamerCadColors.BgColor)
                // 1. INPUT CLASSIFIER & HARD-LOCK
                .pointerInteropFilter { motionEvent ->
                    val stylusEvent = viewModel.stylusInputManager.resolveEvent(motionEvent)
                    pointerCount = motionEvent.pointerCount
                    
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
                // 2. FINGER NAVIGATION
                .pointerInput(Unit) {
                    detectTransformGestures { _, pan, zoomDelta, _ ->
                        if (!viewModel.isStylusInUse) {
                            if (pointerCount > 1) {
                                // TWO-FINGER NAVIGATION: PAN & ZOOM
                                viewModel.interactionState = InteractionState.MULTI_TOUCH_NAVIGATING
                                viewModel.zoom *= zoomDelta
                                viewModel.panX += pan.x
                                viewModel.panY += pan.y
                            } else {
                                // SINGLE-FINGER NAVIGATION: ORBIT
                                viewModel.interactionState = InteractionState.FINGER_NAVIGATING
                                viewModel.cameraYaw += pan.x * 0.005f
                                viewModel.cameraPitch -= pan.y * 0.005f
                            }
                            viewModel.triggerUpdate()
                        }
                    }
                }
                // 3. TWO-FINGER PAN (Manual fallback or refinement)
                .pointerInput(Unit) {
                    // detectDragGestures handles single pointer drag usually.
                    // To handle 2-finger pan distinctly if detectTransformGestures is insufficient:
                    // For now, let's stick to ViewModel's Fit/Pan logic if needed.
                }
                // 4. STYLUS PRODUCTION
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
            // --- WORLD-SPACE GRID ---
            drawWorldGrid(this, viewModel)

            // --- WORLD-SPACE AXES ---
            drawWorldAxes(this, viewModel)

            // Preview Geometry
            viewModel.previewGeometry?.let { geom ->
                if (geom is Line) {
                    drawLine(TamerCadColors.Primary, viewModel.worldToScreen(geom.startPoint, size.width, size.height), viewModel.worldToScreen(geom.endPoint, size.width, size.height), 4f)
                }
            }

            // Committed Geometries
            viewModel.activeSketch.getGeometries().forEach { geom ->
                if (geom is Line) {
                    drawLine(Color.Blue, viewModel.worldToScreen(geom.startPoint, size.width, size.height), viewModel.worldToScreen(geom.endPoint, size.width, size.height), 2f)
                }
            }
            
            // Snap Indicator
            viewModel.currentSnap?.let { snap ->
                if (snap.type != SnapType.NONE) {
                    drawCircle(TamerCadColors.Primary, 8f, viewModel.worldToScreen(snap.point, size.width, size.height), style = Stroke(2f))
                }
            }
        }

        // --- DEBUG OVERLAY ---
        Column(
            modifier = Modifier
                .align(androidx.compose.ui.Alignment.BottomEnd)
                .padding(16.dp)
                .background(Color.Black.copy(alpha = 0.5f))
                .padding(8.dp)
        ) {
            DebugText("INPUT: ${if (viewModel.isStylusInUse) "STYLUS" else "FINGER"}")
            DebugText("POINTERS: $pointerCount")
            DebugText("STATE: ${viewModel.interactionState}")
            DebugText("MODE: ${viewModel.currentMode}")
            DebugText("ZOOM: ${String.format("%.2f", viewModel.zoom)}")
        }
    }
}

@Composable
fun DebugText(text: String) {
    Text(text, color = Color.Green, fontSize = 12.sp, fontWeight = FontWeight.Bold)
}

/**
 * World-Space Grid Rendering.
 * Anchored at Origin (0,0,0).
 */
fun drawWorldGrid(drawScope: DrawScope, viewModel: CADViewModel) {
    val screenWidth = drawScope.size.width
    val screenHeight = drawScope.size.height
    val gridCount = 20
    val gridSpacing = 100.0 // World units

    // Draw XY Plane Grid
    for (i in -gridCount..gridCount) {
        val startX = viewModel.worldToScreen(Point3(i * gridSpacing, -gridCount * gridSpacing, 0.0), screenWidth, screenHeight)
        val endX = viewModel.worldToScreen(Point3(i * gridSpacing, gridCount * gridSpacing, 0.0), screenWidth, screenHeight)
        drawScope.drawLine(Color.Gray.copy(alpha = 0.15f), startX, endX, 1f)

        val startY = viewModel.worldToScreen(Point3(-gridCount * gridSpacing, i * gridSpacing, 0.0), screenWidth, screenHeight)
        val endY = viewModel.worldToScreen(Point3(gridCount * gridSpacing, i * gridSpacing, 0.0), screenWidth, screenHeight)
        drawScope.drawLine(Color.Gray.copy(alpha = 0.15f), startY, endY, 1f)
    }
}

/**
 * World-Space Axis Rendering.
 * X = Red, Y = Green, Z = Blue.
 */
fun drawWorldAxes(drawScope: DrawScope, viewModel: CADViewModel) {
    val screenWidth = drawScope.size.width
    val screenHeight = drawScope.size.height
    val axisLength = 200.0 // World units
    val origin = Point3(0.0, 0.0, 0.0)

    val originScreen = viewModel.worldToScreen(origin, screenWidth, screenHeight)
    
    // X Axis (Red)
    val xAxisEnd = viewModel.worldToScreen(Point3(axisLength, 0.0, 0.0), screenWidth, screenHeight)
    drawScope.drawLine(TamerCadColors.AxisX, originScreen, xAxisEnd, 3f)

    // Y Axis (Green)
    val yAxisEnd = viewModel.worldToScreen(Point3(0.0, axisLength, 0.0), screenWidth, screenHeight)
    drawScope.drawLine(TamerCadColors.AxisY, originScreen, yAxisEnd, 3f)

    // Z Axis (Blue)
    val zAxisEnd = viewModel.worldToScreen(Point3(0.0, 0.0, axisLength), screenWidth, screenHeight)
    drawScope.drawLine(TamerCadColors.AxisZ, originScreen, zAxisEnd, 3f)
}
