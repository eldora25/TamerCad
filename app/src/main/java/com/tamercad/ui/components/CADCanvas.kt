package com.tamercad.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.input.pointer.PointerType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.pointerInteropFilter
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import com.tamercad.core.features.ExtrudeFeature
import com.tamercad.core.features.RevolveFeature
import com.tamercad.core.geometry.Face3D
import com.tamercad.core.geometry.Line
import com.tamercad.core.geometry.Circle3D
import com.tamercad.core.geometry.Arc3D
import com.tamercad.core.math.Point3
import com.tamercad.core.math.Vector3
import com.tamercad.core.rendering.VisualEngine
import com.tamercad.core.sketch.SnapType
import com.tamercad.ui.CADViewModel
import com.tamercad.ui.CadMode
import com.tamercad.ui.theme.TamerCadColors
import java.util.Locale
import kotlin.math.*

import com.tamercad.ui.viewport.Manipulator3D

import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.pointerInput

/**
 * TamerCAD Akıllı Çizim Alanı.
 */
@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun CADCanvas(viewModel: CADViewModel) {
    val context = LocalContext.current

    Canvas(
        modifier = Modifier
            .fillMaxSize()
            .background(if (viewModel.currentMode == CadMode.NAVIGATE) TamerCadColors.BgColor else TamerCadColors.SketchBgColor)
            // HOVER TESPİTİ
            .pointerInput(Unit) {
                awaitPointerEventScope {
                    while (true) {
                        val event = awaitPointerEvent()
                        if (event.type == PointerEventType.Move) {
                            val pos = event.changes.first().position
                            viewModel.onHover(pos, size.width.toFloat(), size.height.toFloat())
                        }
                    }
                }
            }
            .pointerInteropFilter { motionEvent ->
                val stylusEvent = viewModel.stylusInputManager.resolveEvent(motionEvent)
                viewModel.isStylusInUse = stylusEvent.type == PointerType.Stylus
                viewModel.pencilDetector.processMotionEvent(motionEvent)
                
                if (viewModel.isStylusInUse) {
                    if (viewModel.currentMode == CadMode.NAVIGATE) viewModel.currentMode = CadMode.SMART_SKETCH
                }
                false
            }
            // 1. NAVİGASYON (Sadece Parmak / Touch)
            .pointerInput(Unit) {
                detectTransformGestures { _, pan, zoomDelta, _ ->
                    if (!viewModel.isStylusInUse) {
                        viewModel.panX += pan.x
                        viewModel.panY += pan.y
                        viewModel.zoom *= zoomDelta
                        viewModel.triggerUpdate()
                    }
                }
            }
            // 2. ÜRETİM (Sadece Kalem / Stylus)
            .pointerInput(viewModel.currentMode) {
                detectTapGestures(
                    onTap = { offset -> 
                        if (viewModel.isStylusInUse) {
                            viewModel.onTap(offset, size.width.toFloat(), size.height.toFloat()) 
                        }
                    },
                    onLongPress = { 
                        if (viewModel.isStylusInUse) {
                            viewModel.onLongPress(context) 
                        }
                    }
                )
            }
            .pointerInput(viewModel.currentMode) {
                detectDragGestures(
                    onDragStart = { offset -> 
                        if (viewModel.isStylusInUse) {
                            viewModel.onSketchDragStart(offset, size.width.toFloat(), size.height.toFloat(), context) 
                        }
                    },
                    onDrag = { change, dragAmount -> 
                        if (viewModel.isStylusInUse) {
                            viewModel.onSketchDrag(change.position, dragAmount, size.width.toFloat(), size.height.toFloat(), context) 
                        }
                    },
                    onDragEnd = { 
                        viewModel.onSketchDragEnd(context) 
                    }
                )
            }
    ) {
        val screenWidth = size.width
        val screenHeight = size.height
        val gridSize = 50f * viewModel.zoom
        val offsetX = viewModel.panX % gridSize
        val offsetY = viewModel.panY % gridSize
        val isSketchMode = viewModel.currentMode != CadMode.NAVIGATE

        // 1. Grid Rendering
        for (i in -1..(size.width / gridSize).toInt() + 1) {
            val color = if (isSketchMode) TamerCadColors.Grid.copy(alpha = 0.5f) else (if (i % 5 == 0) TamerCadColors.GridThick else TamerCadColors.Grid)
            drawLine(color, Offset(offsetX + i * gridSize, 0f), Offset(offsetX + i * gridSize, size.height), if (i % 5 == 0) 2f else 1f)
        }
        for (i in -1..(size.height / gridSize).toInt() + 1) {
            val color = if (isSketchMode) TamerCadColors.Grid.copy(alpha = 0.5f) else (if (i % 5 == 0) TamerCadColors.GridThick else TamerCadColors.Grid)
            drawLine(color, Offset(0f, offsetY + i * gridSize), Offset(size.width, offsetY + i * gridSize), if (i % 5 == 0) 2f else 1f)
        }

        // 2. Axes
        val origin = viewModel.worldToScreen(Point3(0.0, 0.0, 0.0), screenWidth, screenHeight)
        drawLine(TamerCadColors.AxisX.copy(alpha = 0.8f), origin, viewModel.worldToScreen(Point3(500.0, 0.0, 0.0), screenWidth, screenHeight), 2f)
        drawLine(TamerCadColors.AxisY.copy(alpha = 0.8f), origin, viewModel.worldToScreen(Point3(0.0, 500.0, 0.0), screenWidth, screenHeight), 2f)
        drawLine(TamerCadColors.AxisZ.copy(alpha = 0.8f), origin, viewModel.worldToScreen(Point3(0.0, 0.0, 500.0), screenWidth, screenHeight), 2f)

        // --- SOLID BODY RENDERING ---
        val lightDirection = Vector3(0.5, 0.5, 1.0).normalize()
        val facesToRender = mutableListOf<Triple<Face3D, com.tamercad.core.assembly.Component3D, Color>>()
        val linesToRender = mutableListOf<Pair<Line, Boolean>>()

        viewModel.mainAssembly.components.forEach { comp ->
            if (comp.isVisible) {
                comp.features.forEach { feature ->
                    val solid = (feature as? ExtrudeFeature)?.generatedGeometry ?: (feature as? RevolveFeature)?.generatedGeometry
                    solid?.let { s ->
                        val isSolidSelected = viewModel.selectionManager.selectedEntities.contains(s)
                        val isSolidHovered = viewModel.selectionManager.hoveredEntity == s
                        
                        val compMaterial = viewModel.componentMaterials[comp]?.color ?: VisualEngine.MaterialType.POLISHED_ALUMINUM.baseColor
                        
                        s.faces.forEach { face ->
                            val isFaceSelected = viewModel.selectionManager.selectedEntities.contains(face)
                            val isFaceHovered = viewModel.selectionManager.hoveredEntity == face
                            
                            val highlightColor = when {
                                isFaceSelected -> TamerCadColors.Primary.copy(alpha = 0.8f)
                                isFaceHovered -> TamerCadColors.Primary.copy(alpha = 0.4f)
                                isSolidSelected -> TamerCadColors.Primary.copy(alpha = 0.2f)
                                isSolidHovered -> TamerCadColors.Primary.copy(alpha = 0.1f)
                                else -> null
                            }
                            
                            facesToRender.add(Triple(Face3D(face.vertices.map { it.transform(comp.transform) }), comp, highlightColor ?: compMaterial))
                        }
                        
                        s.lines.forEach { line ->
                            val isEdgeSelected = viewModel.selectionManager.selectedEntities.contains(line)
                            val isEdgeHovered = viewModel.selectionManager.hoveredEntity == line
                            
                            val edgeHighlight = isEdgeSelected || isEdgeHovered || isSolidSelected || isSolidHovered
                            linesToRender.add(Pair(Line(line.startPoint.transform(comp.transform), line.endPoint.transform(comp.transform)), edgeHighlight))
                        }
                    }
                }
            }
        }

        facesToRender.sortBy { (face, _, _) -> face.vertices.sumOf { viewModel.project3DTo2D(it).z } / face.vertices.size }
        facesToRender.forEach { (face, comp, baseColor) ->
            val normal = face.normal()
            val lightIntensity = max(0.3, normal.dot(lightDirection))
            
            // Highlight selected Face
            val isFaceSelected = viewModel.selectionManager.selectedEntities.contains(face)
            val isFaceHovered = viewModel.selectionManager.hoveredEntity == face
            
            val finalColor = when {
                isFaceSelected -> TamerCadColors.Primary.copy(alpha = 0.8f)
                isFaceHovered -> TamerCadColors.Primary.copy(alpha = 0.4f)
                else -> baseColor
            }
            
            val shadedColor = Color(
                red = finalColor.red * lightIntensity.toFloat(),
                green = finalColor.green * lightIntensity.toFloat(),
                blue = finalColor.blue * lightIntensity.toFloat(),
                alpha = finalColor.alpha
            )
            
            val path = Path()
            face.vertices.forEachIndexed { index, vertex ->
                val screenPt = viewModel.worldToScreen(vertex.transform(comp.transform), screenWidth, screenHeight)
                if (index == 0) path.moveTo(screenPt.x, screenPt.y) else path.lineTo(screenPt.x, screenPt.y)
            }
            path.close()
            drawPath(path = path, color = shadedColor)
            
            // Draw Face Outline if selected
            if (isFaceSelected) {
                drawPath(path = path, color = TamerCadColors.Primary, style = Stroke(width = 4f * viewModel.zoom))
            }
        }
        linesToRender.forEach { (line, isSelected) ->
            drawLine(if (isSelected) TamerCadColors.ActiveColor else (if (isSketchMode) Color.DarkGray else Color.Cyan.copy(alpha = 0.6f)), viewModel.worldToScreen(line.startPoint, screenWidth, screenHeight), viewModel.worldToScreen(line.endPoint, screenWidth, screenHeight), if (isSelected) 4f * viewModel.zoom else 2f * viewModel.zoom)
        }

        // --- SKETCH RENDERING (Blueprints Logic) ---
        val sketchGeoms = viewModel.activeSketch.getGeometries()
        sketchGeoms.forEach { geometry ->
            val isSelected = viewModel.selectionManager.selectedEntities.contains(geometry)
            val isHovered = viewModel.selectionManager.hoveredEntity == geometry
            
            val baseColor = if (geometry.isFullyDefined) Color.Black else Color.Blue
            val color = when {
                isSelected -> TamerCadColors.AccentBlue
                isHovered -> TamerCadColors.AccentBlue.copy(alpha = 0.5f)
                else -> baseColor
            }
            
            when (geometry) {
                is Line -> {
                    val constraints = viewModel.gcsManager.getConstraintsForEntity(geometry.id)
                    val isBlack = geometry.isFullyDefined || constraints.isNotEmpty()
                    val lineCol = if (isSelected) TamerCadColors.AccentBlue else (if (isBlack) Color.Black else Color.Blue)

                    drawLine(lineCol, viewModel.worldToScreen(geometry.startPoint, screenWidth, screenHeight), viewModel.worldToScreen(geometry.endPoint, screenWidth, screenHeight), if (isSelected) 6f * viewModel.zoom else 3f * viewModel.zoom)
                    if (isSelected) renderDimensionBubble(viewModel, geometry.startPoint, geometry.endPoint, "${String.format(Locale.US, "%.1f", geometry.length())} mm", screenWidth, screenHeight)
                    
                    // Kısıtlama Rozetleri
                    val midPt = Point3((geometry.startPoint.x + geometry.endPoint.x) / 2.0, (geometry.startPoint.y + geometry.endPoint.y) / 2.0, 0.0)
                    val midScreen = viewModel.worldToScreen(midPt, screenWidth, screenHeight)
                    constraints.forEachIndexed { index, constraint ->
                        val symbol = when (constraint.type) {
                            "HorizontalConstraint" -> "H"
                            "VerticalConstraint" -> "V"
                            "ParallelConstraint" -> "//"
                            "PerpendicularConstraint" -> "T"
                            else -> ""
                        }
                        if (symbol.isNotEmpty()) {
                            drawBadge(this, symbol, Offset(midScreen.x + (index * 24f * viewModel.zoom), midScreen.y - 24f * viewModel.zoom), viewModel.zoom)
                        }
                    }
                }
                is Circle3D -> {
                    val centerScreen = viewModel.worldToScreen(geometry.center, screenWidth, screenHeight)
                    val radiusScreen = geometry.radius * viewModel.zoom
                    drawCircle(color = color, radius = radiusScreen.toFloat(), center = centerScreen, style = Stroke(width = if (isSelected) 6f * viewModel.zoom else 3f * viewModel.zoom))
                    if (isSelected) {
                        val angle = PI / 4
                        val edgePt = Point3(geometry.center.x + geometry.radius * cos(angle), geometry.center.y + geometry.radius * sin(angle), 0.0)
                        renderDimensionBubble(viewModel, geometry.center, edgePt, "R: ${String.format(Locale.US, "%.1f", geometry.radius)} mm", screenWidth, screenHeight, isRadius = true)
                    }
                }
                is Arc3D -> {
                    val centerScreen = viewModel.worldToScreen(geometry.center, screenWidth, screenHeight)
                    val radiusScreen = (geometry.radius * viewModel.zoom).toFloat()
                    val startAngleDeg = Math.toDegrees(geometry.startAngle).toFloat()
                    var sweepAngleDeg = Math.toDegrees(geometry.endAngle - geometry.startAngle).toFloat()
                    if (sweepAngleDeg < 0) sweepAngleDeg += 360f
                    
                    drawArc(
                        color = color,
                        startAngle = -startAngleDeg,
                        sweepAngle = -sweepAngleDeg,
                        useCenter = false,
                        topLeft = Offset(centerScreen.x - radiusScreen, centerScreen.y - radiusScreen),
                        size = Size(radiusScreen * 2, radiusScreen * 2),
                        style = Stroke(width = if (isSelected) 6f * viewModel.zoom else 3f * viewModel.zoom)
                    )
                }
            }
        }

        // --- ACTIVE STROKE RENDERING ---
        if (viewModel.rawStroke.isNotEmpty()) {
            val path = Path()
            viewModel.rawStroke.forEachIndexed { index, point3 ->
                val screenPt = viewModel.worldToScreen(point3, screenWidth, screenHeight)
                if (index == 0) path.moveTo(screenPt.x, screenPt.y) else path.lineTo(screenPt.x, screenPt.y)
            }
            val strokeColor = if (viewModel.currentMode == CadMode.TRIM) Color.Red.copy(alpha = 0.7f) else Color.Blue.copy(alpha = 0.5f)
            drawPath(path, color = strokeColor, style = Stroke(width = 4f * viewModel.zoom))
        }

        // --- MANIPULATOR (GIZMO) ---
        val selected = viewModel.selectionManager.firstOrNull()
        if (selected is com.tamercad.core.geometry.Face3D) {
            Manipulator3D.drawFaceManipulator(this, viewModel, selected, screenWidth, screenHeight)
        } else if (selected is com.tamercad.core.geometry.Line && selected.parentFeatureId != null) {
            Manipulator3D.drawEdgeManipulator(this, viewModel, selected, screenWidth, screenHeight)
        } else {
            viewModel.getSelectedEntityCenter()?.let { center ->
                Manipulator3D.drawTranslationGizmo(this, viewModel, center, screenWidth, screenHeight)
            }
        }
    }
}

private fun androidx.compose.ui.graphics.drawscope.DrawScope.renderDimensionBubble(
    viewModel: CADViewModel,
    p1: Point3,
    p2: Point3,
    text: String,
    screenWidth: Float,
    screenHeight: Float,
    isRadius: Boolean = false
) {
    val pos1 = viewModel.worldToScreen(p1, screenWidth, screenHeight)
    val pos2 = viewModel.worldToScreen(p2, screenWidth, screenHeight)
    val midX = if (isRadius) pos2.x else (pos1.x + pos2.x) / 2f
    val midY = if (isRadius) pos2.y else (pos1.y + pos2.y) / 2f
    
    val textPaint = android.graphics.Paint().apply {
        setColor(0xFF007AFF.toInt())
        textSize = 16f * viewModel.zoom; textAlign = android.graphics.Paint.Align.CENTER; isAntiAlias = true; typeface = android.graphics.Typeface.DEFAULT_BOLD
    }
    val textWidth = textPaint.measureText(text)
    drawRoundRect(color = Color.White, topLeft = Offset(midX - (textWidth / 2) - 15f, midY - 45f), size = Size(textWidth + 30f, 40f), cornerRadius = androidx.compose.ui.geometry.CornerRadius(20f, 20f))
    drawRoundRect(color = TamerCadColors.AccentBlue, topLeft = Offset(midX - (textWidth / 2) - 15f, midY - 45f), size = Size(textWidth + 30f, 40f), cornerRadius = androidx.compose.ui.geometry.CornerRadius(20f, 20f), style = Stroke(width = 2f))
    drawContext.canvas.nativeCanvas.drawText(text, midX, midY - 18f, textPaint)
}

private fun drawBadge(
    drawScope: androidx.compose.ui.graphics.drawscope.DrawScope,
    symbol: String,
    position: Offset,
    zoom: Float
) {
    val size = 18f * zoom
    val paint = android.graphics.Paint().apply {
        color = 0xFF4A90E2.toInt()
        textSize = 12f * zoom
        textAlign = android.graphics.Paint.Align.CENTER
        isAntiAlias = true
        typeface = android.graphics.Typeface.DEFAULT_BOLD
    }
    
    drawScope.drawCircle(
        color = Color.White,
        radius = size / 2,
        center = position
    )
    drawScope.drawCircle(
        color = TamerCadColors.Primary,
        radius = size / 2,
        center = position,
        style = Stroke(width = 1f * zoom)
    )
    drawScope.drawContext.canvas.nativeCanvas.drawText(
        symbol,
        position.x,
        position.y + (size / 4),
        paint
    )
}
