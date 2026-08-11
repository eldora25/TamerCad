package com.tamercad.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
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
import androidx.compose.ui.input.pointer.PointerType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.pointerInteropFilter
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tamercad.core.geometry.*
import com.tamercad.core.math.*
import com.tamercad.core.sketch.SnapType
import com.tamercad.core.sketch.SnapResult
import com.tamercad.core.sketch.SketchEntity
import com.tamercad.core.sketch.SketchLine
import com.tamercad.core.sketch.SketchCircle
import com.tamercad.core.sketch.SketchArc
import com.tamercad.core.sketch.SketchRect
import com.tamercad.ui.CADViewModel
import com.tamercad.ui.CadMode
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.interaction.InteractionState
import com.tamercad.ui.navigation.GestureHardenEngine
import com.tamercad.ui.navigation.NavigationMode
import androidx.compose.material3.Text
import java.util.Locale
import kotlin.math.*

/**
 * TAMERCAD — PHASE 2.0.5 — DOCUMENT TRUTH SOURCE REPAIR
 */
@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun CADCanvas(viewModel: CADViewModel) {
    val context = LocalContext.current
    var viewportSize by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(Size.Zero) }
    
    var lastInputX by androidx.compose.runtime.remember { androidx.compose.runtime.mutableFloatStateOf(0f) }
    var lastInputY by androidx.compose.runtime.remember { androidx.compose.runtime.mutableFloatStateOf(0f) }

    Box(modifier = Modifier
        .fillMaxSize()
        .onGloballyPositioned { coords ->
            viewportSize = Size(coords.size.width.toFloat(), coords.size.height.toFloat())
        }
    ) {
        val screenWidth = viewportSize.width
        val screenHeight = viewportSize.height

        if (screenWidth > 0 && screenHeight > 0) {
            Canvas(
                modifier = Modifier
                    .fillMaxSize()
                    .background(if (viewModel.isSketchMode) TamerCadColors.SketchBgColor else TamerCadColors.BgColor)
                    // 1. INPUT ARBITRATION
                    .pointerInteropFilter { motionEvent ->
                        val stylusEvent = viewModel.stylusInputManager.resolveEvent(motionEvent)
                        viewModel.rawPointerCount = motionEvent.pointerCount
                        viewModel.isStylusInUse = stylusEvent.isStylus
                        
                        lastInputX = motionEvent.x
                        lastInputY = motionEvent.y
                        
                        if (stylusEvent.isStylus) {
                            viewModel.isStylusDown = motionEvent.actionMasked != android.view.MotionEvent.ACTION_UP && 
                                                   motionEvent.actionMasked != android.view.MotionEvent.ACTION_CANCEL
                            viewModel.stylusPressure = stylusEvent.pressure
                            
                            val sketchPt = viewModel.screenToSketchPoint(motionEvent.x, motionEvent.y, screenWidth, screenHeight)
                            if (sketchPt != null) {
                                viewModel.hoverPointLocal = sketchPt
                                viewModel.hoverPointWorld = (viewModel.currentActiveSketch?.plane ?: viewModel.activeSketchPlane).localToWorld(sketchPt)
                            }
                        } else {
                            if (motionEvent.actionMasked == android.view.MotionEvent.ACTION_UP || 
                                motionEvent.actionMasked == android.view.MotionEvent.ACTION_CANCEL) {
                                if (motionEvent.pointerCount <= 1) {
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
                                }
                            }
                        }
                        false
                    }
                    // 2. HARDENED NAVIGATION PIPELINE
                    .pointerInput(Unit) {
                        val engine = GestureHardenEngine()
                        awaitPointerEventScope {
                            while (true) {
                                val event = awaitPointerEvent()
                                if (!viewModel.isStylusInUse) {
                                    val fingerChanges = event.changes.filter { 
                                        it.pressed && (it.type == PointerType.Touch || it.type == PointerType.Unknown) 
                                    }
                                    viewModel.activeFingerCount = fingerChanges.size
                                    val res = engine.process(fingerChanges.size, fingerChanges.map { it.position })
                                    viewModel.gestureMode = res.mode.name
                                    if (res.mode != NavigationMode.IDLE) {
                                        viewModel.updateCamera(res.yawDelta, res.pitchDelta, res.zoomScale, res.panDelta.x, res.panDelta.y)
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
                    // 3. SKETCH/STYLUS PRODUCTION
                    .pointerInput(Unit) {
                        detectDragGestures(
                            onDragStart = { offset ->
                                if (viewModel.isStylusInUse) {
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

                // A. COMMITTED GEOMETRY FROM ALL SKETCHES
                viewModel.document.sketches.forEach { sketch ->
                    sketch.getGeometries().forEach { geom ->
                        drawGeometry(this, viewModel, geom, sketch.plane, Color.Blue, 2f)
                    }
                }

                // B. ACTIVE TOOL PREVIEW
                viewModel.previewGeometry?.let { geom ->
                    val plane = viewModel.currentActiveSketch?.plane ?: viewModel.activeSketchPlane
                    drawGeometry(this, viewModel, geom, plane, TamerCadColors.Primary, 4f)
                }
                
                // C. SNAP INDICATOR
                viewModel.currentSnap?.let { snap ->
                    if (snap.type != SnapType.NONE) {
                        drawSnapMarker(this, viewModel, snap)
                    }
                }
                
                // D. CROSSHAIR (Alignment Check)
                drawLine(Color.Red, Offset(lastInputX - 20f, lastInputY), Offset(lastInputX + 20f, lastInputY), 1f)
                drawLine(Color.Red, Offset(lastInputX, lastInputY - 20f), Offset(lastInputX, lastInputY + 20f), 1f)
            }
        }

        // --- ENHANCED DIAGNOSTIC OVERLAY ---
        Column(
            modifier = Modifier
                .align(androidx.compose.ui.Alignment.BottomEnd)
                .padding(16.dp)
                .background(Color.Black.copy(alpha = 0.6f))
                .padding(10.dp)
        ) {
            DebugText("INPUT: ${if (viewModel.isStylusInUse) "STYLUS" else "FINGER"}")
            DebugText("POINTERS: RAW=${viewModel.rawPointerCount} FINGERS=${viewModel.activeFingerCount}")
            DebugText("STYLUS DOWN: ${viewModel.isStylusDown}")

            DebugText("--- DOCUMENT MODEL ---")
            DebugText("DOC SKETCHES: ${viewModel.document.sketches.size}")
            DebugText("ACTIVE SKETCH ID: ${viewModel.activeSketchId?.take(8) ?: "NONE"}")
            val active = viewModel.currentActiveSketch
            DebugText("ACTIVE PLANE: ${active?.plane ?: "NONE"}")
            DebugText("ACTIVE ENTITIES: ${active?.getGeometries()?.size ?: 0}")
            DebugText("TOTAL ENTITIES: ${viewModel.document.sketches.sumOf { it.getGeometries().size }}")
            
            DebugText("--- TOOL STATE ---")
            DebugText("TOOL: ${viewModel.activeSketchTool}")
            DebugText("STATE: ${viewModel.interactionState}")
            DebugText("POINTS: ${viewModel.rawSketchPoints.size}")

            DebugText("--- ALIGNMENT ---")
            DebugText("INPUT XY: ${String.format(Locale.US, "%.1f / %.1f", lastInputX, lastInputY)}")
            viewModel.hoverPointLocal?.let { local ->
                val plane = viewModel.currentActiveSketch?.plane ?: viewModel.activeSketchPlane
                val reprojected = viewModel.sketchToScreen(local, plane, screenWidth, screenHeight)
                DebugText("REPROJECTED XY: ${String.format(Locale.US, "%.1f / %.1f", reprojected.x, reprojected.y)}")
                val errorX = reprojected.x - lastInputX
                val errorY = reprojected.y - lastInputY
                DebugText("ERROR XY: ${String.format(Locale.US, "%+.1f / %+.1f", errorX, errorY)}")
                DebugText("SKETCH XY: ${String.format(Locale.US, "%.2f / %.2f", local.x, local.y)}")
            }
        }
    }
}

@Composable
fun DebugText(text: String) {
    Text(text, color = Color.Green, fontSize = 8.sp, fontWeight = FontWeight.Bold, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
}

fun drawWorldGrid(drawScope: DrawScope, viewModel: CADViewModel) {
    val screenWidth = drawScope.size.width
    val screenHeight = drawScope.size.height
    val targetPixelSpacing = 80f
    val approxWorldSpacing = targetPixelSpacing / viewModel.zoom
    val levels = doubleArrayOf(0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 50.0, 100.0, 200.0, 500.0, 1000.0)
    var worldSpacing = 100.0
    for (level in levels) { if (level >= approxWorldSpacing) { worldSpacing = level; break } }
    viewModel.currentGridSpacing = worldSpacing
    val gridCount = 20
    val plane = viewModel.currentActiveSketch?.plane ?: viewModel.activeSketchPlane
    for (i in -gridCount..gridCount) {
        val startX = Vec2(i * worldSpacing, -gridCount * worldSpacing)
        val endX = Vec2(i * worldSpacing, gridCount * worldSpacing)
        val startY = Vec2(-gridCount * worldSpacing, i * worldSpacing)
        val endY = Vec2(gridCount * worldSpacing, i * worldSpacing)
        drawScope.drawLine(Color.Gray.copy(alpha = 0.15f), viewModel.sketchToScreen(startX, plane, screenWidth, screenHeight), viewModel.sketchToScreen(endX, plane, screenWidth, screenHeight), 1f)
        drawScope.drawLine(Color.Gray.copy(alpha = 0.15f), viewModel.sketchToScreen(startY, plane, screenWidth, screenHeight), viewModel.sketchToScreen(endY, plane, screenWidth, screenHeight), 1f)
    }
}

fun drawWorldAxes(drawScope: DrawScope, viewModel: CADViewModel) {
    val screenWidth = drawScope.size.width
    val screenHeight = drawScope.size.height
    val axisLength = 200.0
    val originScreen = viewModel.worldToScreen(Point3(0.0, 0.0, 0.0), screenWidth, screenHeight)
    drawScope.drawLine(TamerCadColors.AxisX, originScreen, viewModel.worldToScreen(Point3(axisLength, 0.0, 0.0), screenWidth, screenHeight), 3f)
    drawScope.drawLine(TamerCadColors.AxisY, originScreen, viewModel.worldToScreen(Point3(0.0, axisLength, 0.0), screenWidth, screenHeight), 3f)
    drawScope.drawLine(TamerCadColors.AxisZ, originScreen, viewModel.worldToScreen(Point3(0.0, 0.0, axisLength), screenWidth, screenHeight), 3f)
}

fun drawSnapMarker(drawScope: DrawScope, viewModel: CADViewModel, snap: SnapResult) {
    val screenPos = viewModel.worldToScreen(snap.point, drawScope.size.width, drawScope.size.height)
    val color = TamerCadColors.SnapColor
    val size = 12f
    when (snap.type) {
        SnapType.ENDPOINT -> drawScope.drawRect(color, Offset(screenPos.x - size/2, screenPos.y - size/2), Size(size, size), style = Stroke(2f))
        SnapType.MIDPOINT -> {
            val path = Path().apply {
                moveTo(screenPos.x, screenPos.y - size/2)
                lineTo(screenPos.x - size/2, screenPos.y + size/2)
                lineTo(screenPos.x + size/2, screenPos.y + size/2)
                close()
            }
            drawScope.drawPath(path, color, style = Stroke(2f))
        }
        SnapType.CENTER -> drawScope.drawCircle(color, size/2, screenPos, style = Stroke(2f))
        SnapType.INTERSECTION -> {
            drawScope.drawLine(color, Offset(screenPos.x - size/2, screenPos.y - size/2), Offset(screenPos.x + size/2, screenPos.y + size/2), 2f)
            drawScope.drawLine(color, Offset(screenPos.x + size/2, screenPos.y - size/2), Offset(screenPos.x - size/2, screenPos.y + size/2), 2f)
        }
        SnapType.GRID -> drawScope.drawCircle(color.copy(alpha = 0.5f), 4f, screenPos)
        SnapType.HORIZONTAL, SnapType.VERTICAL -> {
            viewModel.startSnap?.let { start ->
                val startScreen = viewModel.worldToScreen(start.point, drawScope.size.width, drawScope.size.height)
                drawScope.drawLine(color = color, start = startScreen, end = screenPos, strokeWidth = 2f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f))
            }
            drawScope.drawCircle(color, 6f, screenPos, style = Stroke(2f))
        }
        else -> drawScope.drawCircle(color, 8f, screenPos, style = Stroke(2f))
    }
}

fun drawGeometry(drawScope: DrawScope, viewModel: CADViewModel, geom: IGeometry, plane: SketchPlane, color: Color, strokeWidth: Float) {
    val screenWidth = drawScope.size.width
    val screenHeight = drawScope.size.height
    when (geom) {
        is SketchLine -> {
            drawScope.drawLine(color, viewModel.sketchToScreen(geom.start, plane, screenWidth, screenHeight), viewModel.sketchToScreen(geom.end, plane, screenWidth, screenHeight), strokeWidth)
        }
        is SketchCircle -> {
            val segments = 64
            val path = Path()
            for (i in 0..segments) {
                val t = 2.0 * PI * i / segments
                val pLocal = geom.center + Vec2(cos(t) * geom.radius, sin(t) * geom.radius)
                val pScreen = viewModel.sketchToScreen(pLocal, plane, screenWidth, screenHeight)
                if (i == 0) path.moveTo(pScreen.x, pScreen.y) else path.lineTo(pScreen.x, pScreen.y)
            }
            drawScope.drawPath(path, color, style = Stroke(strokeWidth))
        }
        is SketchArc -> {
            val segments = 32
            val path = Path()
            fun norm(a: Double) = (a % (2 * PI) + (2 * PI)) % (2 * PI)
            val s = norm(geom.startAngle)
            val e = norm(geom.endAngle)
            var sweep = e - s
            if (geom.isClockwise && sweep > 0) sweep -= 2 * PI
            if (!geom.isClockwise && sweep < 0) sweep += 2 * PI
            for (i in 0..segments) {
                val t = s + sweep * i / segments
                val pLocal = geom.center + Vec2(cos(t) * geom.radius, sin(t) * geom.radius)
                val pScreen = viewModel.sketchToScreen(pLocal, plane, screenWidth, screenHeight)
                if (i == 0) path.moveTo(pScreen.x, pScreen.y) else path.lineTo(pScreen.x, pScreen.y)
            }
            drawScope.drawPath(path, color, style = Stroke(strokeWidth))
        }
        is SketchRect -> {
            val p1s = viewModel.sketchToScreen(geom.p1, plane, screenWidth, screenHeight)
            val p2s = viewModel.sketchToScreen(Vec2(geom.p2.x, geom.p1.y), plane, screenWidth, screenHeight)
            val p3s = viewModel.sketchToScreen(geom.p2, plane, screenWidth, screenHeight)
            val p4s = viewModel.sketchToScreen(Vec2(geom.p1.x, geom.p2.y), plane, screenWidth, screenHeight)
            drawScope.drawLine(color, p1s, p2s, strokeWidth)
            drawScope.drawLine(color, p2s, p3s, strokeWidth)
            drawScope.drawLine(color, p3s, p4s, strokeWidth)
            drawScope.drawLine(color, p4s, p1s, strokeWidth)
        }
        is Line -> {
            drawScope.drawLine(color, viewModel.worldToScreen(geom.startPoint, screenWidth, screenHeight), viewModel.worldToScreen(geom.endPoint, screenWidth, screenHeight), strokeWidth)
        }
    }
}
