package com.tamercad.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.tamercad.ui.sketch.SketchTool
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.interaction.InteractionState
import com.tamercad.ui.navigation.GestureHardenEngine
import com.tamercad.ui.navigation.NavigationMode
import com.tamercad.ui.viewport.ViewportPolicy
import androidx.compose.material3.Text
import java.util.Locale
import kotlin.math.*

/**
 * TAMERCAD — PHASE 2.0.6.2 — STYLUS ROBUSTNESS & PLANE ALIGNMENT
 */
@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun CADCanvas(viewModel: CADViewModel) {
    var viewportSize by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(Size.Zero) }
    var lastInputX by androidx.compose.runtime.remember { androidx.compose.runtime.mutableFloatStateOf(0f) }
    var lastInputY by androidx.compose.runtime.remember { androidx.compose.runtime.mutableFloatStateOf(0f) }
    val density = androidx.compose.ui.platform.LocalDensity.current

    Box(modifier = Modifier
        .fillMaxSize()
        .onGloballyPositioned { coords ->
            val newSize = Size(coords.size.width.toFloat(), coords.size.height.toFloat())
            if (viewportSize == Size.Zero && newSize.width > 0) {
                with(density) {
                    viewModel.loadUiState(newSize.width.toDp().value, newSize.height.toDp().value)
                }
            }
            viewportSize = newSize
        }
    ) {
        val sw = viewportSize.width
        val sh = viewportSize.height

        if (sw > 0 && sh > 0) {
            Canvas(
                modifier = Modifier
                    .fillMaxSize()
                    .background(if (viewModel.isSketchMode) TamerCadColors.SketchBgColor else TamerCadColors.BgColor)
                    // 1. STYLUS INPUT ARBITRATION (RAW)
                    .pointerInteropFilter { motionEvent ->
                        val stylusEvent = viewModel.stylusInputManager.resolveEvent(motionEvent)
                        viewModel.rawPointerCount = motionEvent.pointerCount
                        viewModel.isStylusInUse = stylusEvent.isStylus
                        
                        lastInputX = motionEvent.x; lastInputY = motionEvent.y
                        
                        if (stylusEvent.isStylus) {
                            when (motionEvent.actionMasked) {
                                android.view.MotionEvent.ACTION_HOVER_MOVE -> viewModel.onStylusHover(motionEvent.x, motionEvent.y, sw, sh)
                                android.view.MotionEvent.ACTION_DOWN -> viewModel.onStylusDown(motionEvent.x, motionEvent.y, sw, sh)
                                android.view.MotionEvent.ACTION_MOVE -> viewModel.onStylusMove(motionEvent.x, motionEvent.y, sw, sh)
                                android.view.MotionEvent.ACTION_UP -> viewModel.onStylusUp(motionEvent.x, motionEvent.y, sw, sh)
                                android.view.MotionEvent.ACTION_CANCEL -> viewModel.isStylusDown = false
                            }
                            return@pointerInteropFilter true
                        }
                        if (viewModel.stylusInputManager.isTouchForbidden(stylusEvent)) return@pointerInteropFilter true
                        false
                    }
                    // 2. FINGER NAVIGATION
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
                                } else { engine.reset(); viewModel.activeFingerCount = 0; viewModel.gestureMode = "IDLE (STYLUS)" }
                            }
                        }
                    }
            ) {
                drawWorldGrid(this, viewModel)
                drawWorldAxes(this, viewModel)

                // A. COMMITTED GEOMETRY
                viewModel.document.sketches.forEach { sketch ->
                    sketch.getGeometries().forEach { geom ->
                        drawGeometry(this, viewModel, geom, sketch.plane, Color.Blue, 2f)
                    }
                }

                // B. LIVE PREVIEW
                viewModel.previewGeometry?.let { geom ->
                    val plane = viewModel.currentActiveSketch?.plane ?: viewModel.activeSketchPlane
                    drawGeometry(this, viewModel, geom, plane, TamerCadColors.Primary, 4f)
                }
                
                // C. SNAP INDICATOR
                viewModel.currentSnap?.let { snap ->
                    if (snap.type != SnapType.NONE) drawSnapMarker(this, viewModel, snap)
                }
                
                // D. ALIGNMENT CROSSHAIR
                drawLine(Color.Red, Offset(lastInputX - 15f, lastInputY), Offset(lastInputX + 15f, lastInputY), 1f)
                drawLine(Color.Red, Offset(lastInputX, lastInputY - 15f), Offset(lastInputX, lastInputY + 15f), 1f)
            }
        }

        // --- ENHANCED DIAGNOSTIC OVERLAY (PHASE 2.0.8.1) ---
        Column(
            modifier = Modifier
                .align(androidx.compose.ui.Alignment.BottomStart)
                .padding(start = ViewportPolicy.DiagnosticsStart, bottom = ViewportPolicy.DiagnosticsBottom)
                .background(Color.Black.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                .padding(8.dp)
                .width(180.dp)
                .wrapContentHeight()
        ) {
            DebugText("INPUT: ${if (viewModel.isStylusInUse) "STYLUS" else "FINGER"} DOWN: ${viewModel.isStylusDown}")
            DebugText("MODE: ${viewModel.selectionManager.selectionMode}")
            
            DebugText("--- DOCUMENT ---")
            DebugText("SKETCHES: ${viewModel.document.sketches.size} ENTITIES: ${viewModel.document.sketches.sumOf { it.getGeometries().size }}")
            
            DebugText("--- SELECTION ---")
            DebugText("COUNT: ${viewModel.selectionManager.selectedEntities.size}")
            DebugText("ACTIVE SKETCH: ${viewModel.activeSketchId?.take(8) ?: "NONE"}")
            DebugText("HIT DIST: ${String.format(Locale.US, "%.1f px", viewModel.selectionManager.hitDistance)}")

            DebugText("--- INTERACTION ---")
            DebugText("TOOL: ${viewModel.activeSketchTool}")
            DebugText("SNAP: ${viewModel.currentSnap?.type ?: "NONE"}")

            DebugText("--- OBJECT TREE ---")
            DebugText("VISIBLE: ${viewModel.isObjectTreeVisible}")
            DebugText("PINNED: ${viewModel.objectTreePinned}")
            DebugText("COMPOSED: ${viewModel.objectTreeComposed}")
            DebugText("MEASURED: ${viewModel.objectTreeMeasured}")
            DebugText("ITEMS: ${viewModel.objectTreeItemCount}")
            DebugText("X_DP: ${String.format(Locale.US, "%.1f", viewModel.objectTreeOffsetDp.x)}")
            DebugText("Y_DP: ${String.format(Locale.US, "%.1f", viewModel.objectTreeOffsetDp.y)}")
            DebugText("SIZE: ${viewModel.objectTreeMeasuredWidth.toInt()}x${viewModel.objectTreeMeasuredHeight.toInt()}")
            DebugText("CAT: ${viewModel.activeCategory}")
        }
    }
}

@Composable
fun DebugText(text: String) {
    Text(text, color = Color.Green, fontSize = 8.sp, fontWeight = FontWeight.Bold, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
}

fun drawWorldGrid(drawScope: DrawScope, viewModel: CADViewModel) {
    val sw = drawScope.size.width; val sh = drawScope.size.height
    val targetPixelSpacing = 80f
    val approxWorldSpacing = targetPixelSpacing / viewModel.zoom
    val levels = doubleArrayOf(0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 50.0, 100.0, 200.0, 500.0, 1000.0)
    var worldSpacing = 100.0
    for (level in levels) { if (level >= approxWorldSpacing) { worldSpacing = level; break } }
    viewModel.currentGridSpacing = worldSpacing
    val gridCount = 20
    val plane = viewModel.currentActiveSketch?.plane ?: viewModel.activeSketchPlane
    for (i in -gridCount..gridCount) {
        val sX = Vec2(i * worldSpacing, -gridCount * worldSpacing); val eX = Vec2(i * worldSpacing, gridCount * worldSpacing)
        val sY = Vec2(-gridCount * worldSpacing, i * worldSpacing); val eY = Vec2(gridCount * worldSpacing, i * worldSpacing)
        drawScope.drawLine(Color.Gray.copy(alpha = 0.15f), viewModel.sketchToScreen(sX, plane, sw, sh), viewModel.sketchToScreen(eX, plane, sw, sh), 1f)
        drawScope.drawLine(Color.Gray.copy(alpha = 0.15f), viewModel.sketchToScreen(sY, plane, sw, sh), viewModel.sketchToScreen(eY, plane, sw, sh), 1f)
    }
}

fun drawWorldAxes(drawScope: DrawScope, viewModel: CADViewModel) {
    val sw = drawScope.size.width; val sh = drawScope.size.height
    val axisLength = 200.0
    val originScreen = viewModel.worldToScreen(Point3(0.0, 0.0, 0.0), sw, sh)
    drawScope.drawLine(TamerCadColors.AxisX, originScreen, viewModel.worldToScreen(Point3(axisLength, 0.0, 0.0), sw, sh), 3f)
    drawScope.drawLine(TamerCadColors.AxisY, originScreen, viewModel.worldToScreen(Point3(0.0, axisLength, 0.0), sw, sh), 3f)
    drawScope.drawLine(TamerCadColors.AxisZ, originScreen, viewModel.worldToScreen(Point3(0.0, 0.0, axisLength), sw, sh), 3f)
}

fun drawSnapMarker(drawScope: DrawScope, viewModel: CADViewModel, snap: SnapResult) {
    val plane = viewModel.currentActiveSketch?.plane ?: viewModel.activeSketchPlane
    val screenPos = viewModel.sketchToScreen(snap.point, plane, drawScope.size.width, drawScope.size.height)
    val color = TamerCadColors.SnapColor; val size = 12f
    when (snap.type) {
        SnapType.ENDPOINT -> drawScope.drawRect(color, Offset(screenPos.x - size/2, screenPos.y - size/2), Size(size, size), style = Stroke(2f))
        SnapType.MIDPOINT -> {
            val path = Path().apply {
                moveTo(screenPos.x, screenPos.y - size/2); lineTo(screenPos.x - size/2, screenPos.y + size/2)
                lineTo(screenPos.x + size/2, screenPos.y + size/2); close()
            }
            drawScope.drawPath(path, color, style = Stroke(2f))
        }
        SnapType.CENTER -> drawScope.drawCircle(color, size/2, screenPos, style = Stroke(2f))
        SnapType.GRID -> drawScope.drawCircle(color.copy(alpha = 0.5f), 4f, screenPos)
        SnapType.HORIZONTAL, SnapType.VERTICAL -> {
            viewModel.rawSketchPoints.lastOrNull()?.let { start ->
                val startScreen = viewModel.sketchToScreen(start, plane, drawScope.size.width, drawScope.size.height)
                drawScope.drawLine(color = color, start = startScreen, end = screenPos, strokeWidth = 2f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f))
            }
            drawScope.drawCircle(color, 6f, screenPos, style = Stroke(2f))
        }
        else -> drawScope.drawCircle(color, 8f, screenPos, style = Stroke(2f))
    }
}

fun drawGeometry(drawScope: DrawScope, viewModel: CADViewModel, geom: IGeometry, plane: SketchPlane, color: Color, strokeWidth: Float) {
    val sw = drawScope.size.width; val sh = drawScope.size.height
    val finalColor = if (geom.isSelected) TamerCadColors.SelectionColor else color
    val finalStroke = if (geom.isSelected) strokeWidth * 2f else strokeWidth
    
    when (geom) {
        is SketchLine -> drawScope.drawLine(finalColor, viewModel.sketchToScreen(geom.start, plane, sw, sh), viewModel.sketchToScreen(geom.end, plane, sw, sh), finalStroke)
        is SketchCircle -> {
            val path = Path(); val segments = 64
            for (i in 0..segments) {
                val t = 2.0 * PI * i / segments
                val p = geom.center + Vec2(cos(t) * geom.radius, sin(t) * geom.radius)
                val s = viewModel.sketchToScreen(p, plane, sw, sh)
                if (i == 0) path.moveTo(s.x, s.y) else path.lineTo(s.x, s.y)
            }
            drawScope.drawPath(path, finalColor, style = Stroke(finalStroke))
        }
        is SketchArc -> {
            val path = Path(); val segments = 32
            fun norm(a: Double) = (a % (2 * PI) + (2 * PI)) % (2 * PI)
            val s = norm(geom.startAngle); val e = norm(geom.endAngle)
            var sweep = e - s
            if (geom.isClockwise && sweep > 0) sweep -= 2 * PI
            if (!geom.isClockwise && sweep < 0) sweep += 2 * PI
            for (i in 0..segments) {
                val t = s + sweep * i / segments
                val p = geom.center + Vec2(cos(t) * geom.radius, sin(t) * geom.radius)
                val ps = viewModel.sketchToScreen(p, plane, sw, sh)
                if (i == 0) path.moveTo(ps.x, ps.y) else path.lineTo(ps.x, ps.y)
            }
            drawScope.drawPath(path, finalColor, style = Stroke(finalStroke))
        }
        is SketchRect -> {
            val p1s = viewModel.sketchToScreen(geom.p1, plane, sw, sh)
            val p2s = viewModel.sketchToScreen(Vec2(geom.p2.x, geom.p1.y), plane, sw, sh)
            val p3s = viewModel.sketchToScreen(geom.p2, plane, sw, sh)
            val p4s = viewModel.sketchToScreen(Vec2(geom.p1.x, geom.p2.y), plane, sw, sh)
            drawScope.drawLine(finalColor, p1s, p2s, finalStroke); drawScope.drawLine(finalColor, p2s, p3s, finalStroke)
            drawScope.drawLine(finalColor, p3s, p4s, finalStroke); drawScope.drawLine(finalColor, p4s, p1s, finalStroke)
        }
        is Line -> drawScope.drawLine(finalColor, viewModel.worldToScreen(geom.startPoint, sw, sh), viewModel.worldToScreen(geom.endPoint, sw, sh), finalStroke)
    }
}
