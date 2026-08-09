package com.tamercad.ui.viewport

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.nativeCanvas
import com.tamercad.core.math.Point3
import com.tamercad.core.math.Vector3
import com.tamercad.core.math.Matrix4
import com.tamercad.ui.CADViewModel
import com.tamercad.ui.theme.TamerCadColors
import java.util.Locale
import kotlin.math.*

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Profesyonel 3D Manipülatör Sistemi (Gizmos).
 */
object Manipulator3D {

    val AxisX = Color(0xFFEB5757) // Red
    val AxisY = Color(0xFF27AE60) // Green
    val AxisZ = Color(0xFF4A90E2) // Blue

    fun drawTranslationGizmo(
        drawScope: DrawScope,
        viewModel: CADViewModel,
        center: Point3,
        screenWidth: Float,
        screenHeight: Float,
        activeAxis: String? = null,
        currentValue: Double? = null
    ) {
        val zoom = viewModel.zoom
        val handleLength = 100.0 / zoom
        val centerScreen = viewModel.worldToScreen(center, screenWidth, screenHeight)

        val axes = listOf(
            Triple("X", Point3(center.x + handleLength, center.y, center.z), AxisX),
            Triple("Y", Point3(center.x, center.y + handleLength, center.z), AxisY),
            Triple("Z", Point3(center.x, center.y, center.z + handleLength), AxisZ)
        )

        axes.forEach { triple ->
            val name = triple.first
            val endPt = triple.second
            val color = triple.third
            
            val endScreen = viewModel.worldToScreen(endPt, screenWidth, screenHeight)
            val isHovered = activeAxis == name
            val finalColor = if (isHovered) Color.White else color
            
            drawArrow(drawScope, centerScreen, endScreen, finalColor, zoom)
            
            if (isHovered && currentValue != null) {
                drawNumericLabel(drawScope, endScreen, "$name ${String.format(Locale.US, "%+.2f", currentValue)} mm", zoom)
            }
        }

        drawPlanarSquare(drawScope, viewModel, center, Vector3(1.0, 0.0, 0.0), Vector3(0.0, 1.0, 0.0), Color.Blue.copy(alpha = 0.5f), activeAxis == "XY", screenWidth, screenHeight)
        drawPlanarSquare(drawScope, viewModel, center, Vector3(1.0, 0.0, 0.0), Vector3(0.0, 0.0, 1.0), Color.Green.copy(alpha = 0.5f), activeAxis == "XZ", screenWidth, screenHeight)
        drawPlanarSquare(drawScope, viewModel, center, Vector3(0.0, 1.0, 0.0), Vector3(0.0, 0.0, 1.0), Color.Red.copy(alpha = 0.5f), activeAxis == "YZ", screenWidth, screenHeight)
    }

    fun drawRotationGizmo(
        drawScope: DrawScope,
        viewModel: CADViewModel,
        center: Point3,
        screenWidth: Float,
        screenHeight: Float,
        activeAxis: String? = null,
        currentAngle: Double? = null
    ) {
        val zoom = viewModel.zoom
        val radius = 80.0 / zoom
        val centerScreen = viewModel.worldToScreen(center, screenWidth, screenHeight)

        drawRotationRing(drawScope, centerScreen, radius.toFloat(), AxisX, activeAxis == "ROT_X", zoom)
        drawRotationRing(drawScope, centerScreen, radius.toFloat() * 1.1f, AxisY, activeAxis == "ROT_Y", zoom)
        drawRotationRing(drawScope, centerScreen, radius.toFloat() * 1.2f, AxisZ, activeAxis == "ROT_Z", zoom)

        if (activeAxis?.startsWith("ROT_") == true && currentAngle != null) {
            drawNumericLabel(drawScope, centerScreen, "Angle: ${String.format(Locale.US, "%.1f°", currentAngle)}", zoom)
        }
    }

    private fun drawRotationRing(drawScope: DrawScope, center: Offset, radius: Float, color: Color, isActive: Boolean, zoom: Float) {
        drawScope.drawCircle(
            color = if (isActive) Color.White else color,
            radius = radius,
            center = center,
            style = Stroke(width = (if (isActive) 4f else 2f) * zoom)
        )
    }

    private fun drawArrow(drawScope: DrawScope, start: Offset, end: Offset, color: Color, zoom: Float) {
        val arrowSize = 15f * zoom
        val angle = atan2(end.y - start.y, end.x - start.x)
        drawScope.apply {
            drawLine(color, start, end, strokeWidth = 4f * zoom)
            val path = Path().apply {
                moveTo(end.x, end.y)
                lineTo(end.x - arrowSize * cos(angle - 0.5f), end.y - arrowSize * sin(angle - 0.5f))
                lineTo(end.x - arrowSize * cos(angle + 0.5f), end.y - arrowSize * sin(angle + 0.5f))
                close()
            }
            drawPath(path, color)
        }
    }

    private fun drawNumericLabel(drawScope: DrawScope, position: Offset, text: String, zoom: Float) {
        val paint = android.graphics.Paint().apply {
            color = android.graphics.Color.WHITE
            textSize = 14f * zoom
            textAlign = android.graphics.Paint.Align.LEFT
            isAntiAlias = true
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            setShadowLayer(4f, 2f, 2f, android.graphics.Color.BLACK)
        }
        drawScope.drawContext.canvas.nativeCanvas.drawText(text, position.x + 10f, position.y - 10f, paint)
    }

    private fun drawPlanarSquare(drawScope: DrawScope, viewModel: CADViewModel, center: Point3, v1: Vector3, v2: Vector3, color: Color, isActive: Boolean, screenWidth: Float, screenHeight: Float) {
        val zoom = viewModel.zoom
        val size = 30.0 / zoom
        val p0 = center.add(v1.multiply(size)).add(v2.multiply(size))
        val p1 = p0.add(v1.multiply(size))
        val p2 = p1.add(v2.multiply(size))
        val p3 = p0.add(v2.multiply(size))
        val s0 = viewModel.worldToScreen(p0, screenWidth, screenHeight)
        val s1 = viewModel.worldToScreen(p1, screenWidth, screenHeight)
        val s2 = viewModel.worldToScreen(p2, screenWidth, screenHeight)
        val s3 = viewModel.worldToScreen(p3, screenWidth, screenHeight)
        val path = Path().apply {
            moveTo(s0.x, s0.y)
            lineTo(s1.x, s1.y)
            lineTo(s2.x, s2.y)
            lineTo(s3.x, s3.y)
            close()
        }
        drawScope.drawPath(path, if (isActive) Color.White else color)
    }

    fun drawFaceManipulator(drawScope: DrawScope, viewModel: CADViewModel, face: com.tamercad.core.geometry.Face3D, screenWidth: Float, screenHeight: Float, isActive: Boolean = false, currentValue: Double? = null) {
        val zoom = viewModel.zoom
        val handleLength = 120.0 / zoom
        val centroid = Point3(face.vertices.map { it.x }.average(), face.vertices.map { it.y }.average(), face.vertices.map { it.z }.average())
        val component = viewModel.mainAssembly.components.find { comp -> comp.features.any { feat -> (feat as? com.tamercad.core.features.ExtrudeFeature)?.generatedGeometry?.faces?.contains(face) == true } }
        val transform = component?.transform ?: Matrix4.identity()
        val worldCentroid = centroid.transform(transform)
        val normal = face.normal().transform(transform)
        val endPoint = worldCentroid.add(normal.multiply(handleLength))
        val startScreen = viewModel.worldToScreen(worldCentroid, screenWidth, screenHeight)
        val endScreen = viewModel.worldToScreen(endPoint, screenWidth, screenHeight)
        drawArrow(drawScope, startScreen, endScreen, if (isActive) Color.White else Color.Cyan, zoom)
        if (isActive && currentValue != null) drawNumericLabel(drawScope, endScreen, "L: ${String.format(Locale.US, "%.1f", currentValue)} mm", zoom)
    }

    fun drawEdgeManipulator(drawScope: DrawScope, viewModel: CADViewModel, edge: com.tamercad.core.geometry.Line, screenWidth: Float, screenHeight: Float, isActive: Boolean = false, currentValue: Double? = null) {
        val zoom = viewModel.zoom
        val component = viewModel.mainAssembly.components.find { comp -> comp.features.any { (it as? com.tamercad.core.features.ExtrudeFeature)?.generatedGeometry?.lines?.contains(edge) == true } }
        val transform = component?.transform ?: Matrix4.identity()
        val midPt = Point3((edge.startPoint.x + edge.endPoint.x) / 2.0, (edge.startPoint.y + edge.endPoint.y) / 2.0, (edge.startPoint.z + edge.endPoint.z) / 2.0).transform(transform)
        val screenMid = viewModel.worldToScreen(midPt, screenWidth, screenHeight)
        drawScope.drawCircle(color = if (isActive) Color.White else Color.Yellow, radius = 12f * zoom, center = screenMid)
        if (isActive && currentValue != null) drawNumericLabel(drawScope, screenMid, "R: ${String.format(Locale.US, "%.1f", currentValue)} mm", zoom)
    }

    fun hitTest(tapPos: Offset, viewModel: CADViewModel, screenWidth: Float, screenHeight: Float): String? {
        val selected = viewModel.selectionManager.firstOrNull() ?: return null
        val zoom = viewModel.zoom
        val handleLength = 100.0 / zoom
        
        if (selected is com.tamercad.core.geometry.Face3D) {
            val centroid = Point3(selected.vertices.map { it.x }.average(), selected.vertices.map { it.y }.average(), selected.vertices.map { it.z }.average())
            val component = viewModel.mainAssembly.components.find { comp -> comp.features.any { (it as? com.tamercad.core.features.ExtrudeFeature)?.generatedGeometry?.faces?.contains(selected) == true } }
            val transform = component?.transform ?: Matrix4.identity()
            val normal = selected.normal().transform(transform)
            val startScreen = viewModel.worldToScreen(centroid.transform(transform), screenWidth, screenHeight)
            val endScreen = viewModel.worldToScreen(centroid.transform(transform).add(normal.multiply(handleLength)), screenWidth, screenHeight)
            if (isPointNearLine(tapPos, startScreen, endScreen, 40f)) return "FACE_NORMAL"
            return null
        }
        
        if (selected is com.tamercad.core.geometry.Line && selected.parentFeatureId != null) {
            val component = viewModel.mainAssembly.components.find { comp -> comp.features.any { (it as? com.tamercad.core.features.ExtrudeFeature)?.generatedGeometry?.lines?.contains(selected) == true } }
            val transform = component?.transform ?: Matrix4.identity()
            val midPt = Point3((selected.startPoint.x + selected.endPoint.x) / 2.0, (selected.startPoint.y + selected.endPoint.y) / 2.0, (selected.startPoint.z + selected.endPoint.z) / 2.0).transform(transform)
            val screenMid = viewModel.worldToScreen(midPt, screenWidth, screenHeight)
            if (sqrt((tapPos.x - screenMid.x).pow(2) + (tapPos.y - screenMid.y).pow(2)) < 50f) return "EDGE_OFFSET"
        }

        val center = viewModel.getSelectedEntityCenter() ?: return null
        val centerScreen = viewModel.worldToScreen(center, screenWidth, screenHeight)
        
        val axes = listOf(
            "X" to center.add(Vector3(handleLength, 0.0, 0.0)),
            "Y" to center.add(Vector3(0.0, handleLength, 0.0)),
            "Z" to center.add(Vector3(0.0, 0.0, handleLength))
        )
        for (axisPair in axes) {
            val endScreen = viewModel.worldToScreen(axisPair.second, screenWidth, screenHeight)
            if (isPointNearLine(tapPos, centerScreen, endScreen, 40f)) return axisPair.first
        }
        
        val squareSize = 30.0 / zoom
        val planarChecks = listOf(
            "XY" to center.add(Vector3(1.0, 0.0, 0.0).multiply(squareSize * 1.5)).add(Vector3(0.0, 1.0, 0.0).multiply(squareSize * 1.5)),
            "XZ" to center.add(Vector3(1.0, 0.0, 0.0).multiply(squareSize * 1.5)).add(Vector3(0.0, 0.0, 1.0).multiply(squareSize * 1.5)),
            "YZ" to center.add(Vector3(0.0, 1.0, 0.0).multiply(squareSize * 1.5)).add(Vector3(0.0, 0.0, 1.0).multiply(squareSize * 1.5))
        )
        for (pPair in planarChecks) {
            val sp = viewModel.worldToScreen(pPair.second, screenWidth, screenHeight)
            if (sqrt((tapPos.x - sp.x).pow(2) + (tapPos.y - sp.y).pow(2)) < 30f) return pPair.first
        }

        val rotRadius = 80.0 / zoom
        val distToCenter = sqrt((tapPos.x - centerScreen.x).pow(2) + (tapPos.y - centerScreen.y).pow(2))
        if (abs(distToCenter - rotRadius) < 15f) return "ROT_X"
        if (abs(distToCenter - rotRadius * 1.1f) < 15f) return "ROT_Y"
        if (abs(distToCenter - rotRadius * 1.2f) < 15f) return "ROT_Z"

        return null
    }

    private fun isPointNearLine(pt: Offset, start: Offset, end: Offset, tolerance: Float): Boolean {
        val dx = end.x - start.x; val dy = end.y - start.y; val mag = sqrt(dx * dx + dy * dy)
        if (mag < 1f) return sqrt((pt.x-start.x).pow(2)+(pt.y-start.y).pow(2)) < tolerance
        val u = ((pt.x - start.x) * dx + (pt.y - start.y) * dy) / (mag * mag)
        if (u < 0 || u > 1) return sqrt((pt.x-start.x).pow(2)+(pt.y-start.y).pow(2)) < tolerance || sqrt((pt.x-end.x).pow(2)+(pt.y-end.y).pow(2)) < tolerance
        val ix = start.x + u * dx; val iy = start.y + u * dy
        return sqrt((pt.x - ix).pow(2) + (pt.y - iy).pow(2)) < tolerance
    }
}
