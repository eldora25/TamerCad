package com.tamercad.ui

import android.content.Context
import android.widget.Toast
import androidx.compose.runtime.*
import androidx.compose.ui.geometry.Offset
import androidx.lifecycle.ViewModel
import com.tamercad.core.assembly.*
import com.tamercad.core.features.*
import com.tamercad.core.geometry.*
import com.tamercad.core.math.*
import com.tamercad.core.sketch.*
import com.tamercad.core.commands.*
import com.tamercad.core.constraints.*
import com.tamercad.core.analysis.MeasurementEngine
import com.tamercad.ui.interaction.InteractionState
import com.tamercad.ui.interaction.StylusInputManager
import com.tamercad.ui.viewport.Manipulator3D
import com.tamercad.ui.selection.SelectionManager
import com.tamercad.ui.state.SettingsState
import com.tamercad.core.document.CADDocument
import com.tamercad.ui.components.PencilGestureDetector
import com.tamercad.ui.components.isPointInPolygon
import com.tamercad.ui.toolbar.ToolbarCategory
import java.util.*
import kotlin.math.*

class CADViewModel : ViewModel() {
    // UI State
    var activeCategory by mutableStateOf(ToolbarCategory.INSPECT)
    var interactionState by mutableStateOf(InteractionState.IDLE)
    
    val settings = SettingsState()
    val selectionManager = SelectionManager()
    val stylusInputManager = StylusInputManager()
    var isStylusInUse by mutableStateOf(false)
    
    // Core Document State
    val document = CADDocument()
    
    // Shortcuts
    val mainAssembly get() = document.assembly
    val gcsManager get() = document.gcsManager
    
    // Viewport & Camera State
    var cameraPitch by mutableFloatStateOf(0.5f)
    var cameraYaw by mutableFloatStateOf(-0.5f)
    var panX by mutableFloatStateOf(0f)
    var panY by mutableFloatStateOf(0f)
    var zoom by mutableFloatStateOf(1.5f)

    var currentMode by mutableStateOf(CadMode.NAVIGATE)
    val sidebarState = SidebarState()
    var browserOffset by mutableStateOf(Offset(250f, 100f)) 
    var saveStatus by mutableStateOf("Saved") 
    var isPerspective by mutableStateOf(false)
    
    // Sketch Mode State
    var isSketchMode by mutableStateOf(false)
    var selectedSketchPlane by mutableStateOf<String?>(null) 
    var showPlaneSelector by mutableStateOf(false)
    
    // Live Preview State
    var previewGeometry by mutableStateOf<IGeometry?>(null)
    var activeInference by mutableStateOf<String?>(null) 
    
    // Dialog States
    var showRenameDialog by mutableStateOf<Component3D?>(null)
    var renameInput by mutableStateOf("")
    var showInfoDialog by mutableStateOf(false)
    var showSettings by mutableStateOf(false)
    var showDimDialog by mutableStateOf(false)
    var dimInput by mutableStateOf("")
    
    var activeSketch by mutableStateOf(SketchFeature("Active Sketch"))
    var updateTrigger by mutableIntStateOf(0)

    // Selection & Gesture State
    var selectionPoint by mutableStateOf<Offset?>(null)
    var dragHandle by mutableIntStateOf(-1)
    var rawStroke by mutableStateOf<List<Point3>>(emptyList())
    var currentSnap by mutableStateOf<SnapResult?>(null)
    var startSnap by mutableStateOf<SnapResult?>(null)
    var dynamicExtrudeHeight by mutableFloatStateOf(0f)
    var isExtrudeSymmetric by mutableStateOf(false)
    var isExtrudeReversed by mutableStateOf(false)
    var extrudeOperation by mutableStateOf(ExtrudeOperation.NEW_BODY)
    var activeManipulatorAxis by mutableStateOf<String?>(null)
    var manipulationAnchorPoint by mutableStateOf<Point3?>(null)
    
    var currentMeasurement by mutableStateOf<MeasurementEngine.MeasurementResult?>(null)

    val componentMaterials = mutableStateMapOf<Component3D, RenderMaterial>()
    var draggedMaterial by mutableStateOf<RenderMaterial?>(null)
    var dragOffset by mutableStateOf(Offset.Zero)

    val pencilDetector = PencilGestureDetector()
    val commandManager = CommandManager()

    /**
     * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
     * 3D Nesne Seçimi (Ray-Casting) - Gelişmiş Hiyerarşik Öncelik
     */
    fun pick3DEntity(screenX: Float, screenY: Float, screenWidth: Float, screenHeight: Float): IGeometry? {
        val tapPos = Offset(screenX, screenY)
        
        if (selectionManager.showSketches) {
            val worldTap = screenToWorld(screenX, screenY, screenWidth, screenHeight)
            document.sketches.forEach { sketch ->
                val hit = sketch.pickGeometry(worldTap, 20.0 / zoom)
                if (hit != null) return hit
            }
        }

        var closestSolid: Solid3D? = null
        var closestFace: Face3D? = null
        var closestEdge: Line? = null
        
        var minDepth = Double.MAX_VALUE
        var minEdgeDist = 25.0 
        var minVertexDist = 30.0
        
        mainAssembly.components.forEach { comp ->
            if (!comp.isVisible) return@forEach
            
            comp.features.forEach { feature ->
                val solid = (feature as? ExtrudeFeature)?.generatedGeometry ?: (feature as? RevolveFeature)?.generatedGeometry
                
                if (selectionManager.showVertices) {
                    solid?.faces?.flatMap { it.vertices }?.forEach { v ->
                        val sv = worldToScreen(v.transform(comp.transform), screenWidth, screenHeight)
                        val d = sqrt((sv.x - tapPos.x).pow(2) + (sv.y - tapPos.y).pow(2))
                        if (d < minVertexDist) {
                            minVertexDist = d.toDouble()
                        }
                    }
                }

                if (selectionManager.showEdges) {
                    solid?.lines?.forEach { line ->
                        val p1 = worldToScreen(line.startPoint.transform(comp.transform), screenWidth, screenHeight)
                        val p2 = worldToScreen(line.endPoint.transform(comp.transform), screenWidth, screenHeight)
                        val dist = distancePointToSegment(tapPos, p1, p2)
                        if (dist < minEdgeDist) {
                            minEdgeDist = dist.toDouble()
                            closestEdge = line
                            closestEdge?.parentFeatureId = feature.id
                        }
                    }
                }

                if (selectionManager.showFaces || selectionManager.showBodies) {
                    solid?.faces?.forEach { face ->
                        val tVertices = face.vertices.map { project3DTo2D(it.transform(comp.transform)) }
                        val avgZ = tVertices.sumOf { it.z } / tVertices.size
                        val screenVerts = tVertices.map { worldToScreen(it, screenWidth, screenHeight) }
                        
                        if (isPointInPolygon(tapPos, screenVerts)) {
                            if (avgZ < minDepth) { 
                                minDepth = avgZ
                                closestSolid = solid
                                closestFace = face
                                closestFace?.parentFeatureId = feature.id
                            }
                        }
                    }
                }
            }
        }
        
        if (selectionManager.showEdges && minEdgeDist < 12.0 && closestEdge != null) {
            return closestEdge
        }

        val currentSelection = selectionManager.selectedEntities.firstOrNull()
        if (closestSolid != null) {
            if (selectionManager.showFaces && (currentSelection == closestSolid || !selectionManager.showBodies) && closestFace != null) {
                return closestFace
            }
            if (selectionManager.showBodies) return closestSolid
        }
        
        return null
    }

    private fun Offset.distanceTo(other: Offset): Float = sqrt((x - other.x).pow(2) + (y - other.y).pow(2))

    fun onHover(offset: Offset, screenWidth: Float, screenHeight: Float) {
        val hit = pick3DEntity(offset.x, offset.y, screenWidth, screenHeight)
        selectionManager.setHover(hit)
        if (hit != null) triggerUpdate()
    }

    private fun distancePointToSegment(p: Offset, s1: Offset, s2: Offset): Float {
        val dx = s2.x - s1.x; val dy = s2.y - s1.y; val l2 = dx * dx + dy * dy
        if (l2 == 0f) return sqrt((p.x - s1.x).pow(2) + (p.y - s1.y).pow(2))
        var t = ((p.x - s1.x) * dx + (p.y - s1.y) * dy) / l2
        t = max(0f, min(1f, t))
        return sqrt((p.x - (s1.x + t * dx)).pow(2) + (p.y - (s1.y + t * dy)).pow(2))
    }

    fun project3DTo2D(p: Point3): Point3 {
        val cosY = cos(cameraYaw.toDouble()); val sinY = sin(cameraYaw.toDouble())
        val cosP = cos(cameraPitch.toDouble()); val sinP = sin(cameraPitch.toDouble())
        val x1 = p.x * cosY - p.z * sinY; val z1 = p.x * sinY + p.z * cosY
        val y2 = p.y * cosP - z1 * sinP; val z2 = p.y * sinP + z1 * cosP
        return Point3(x1, y2, z2)
    }

    fun worldToScreen(point: Point3, screenWidth: Float, screenHeight: Float): Offset {
        val proj = project3DTo2D(point)
        val centerX = screenWidth / 2f
        val centerY = screenHeight / 2f
        return Offset((proj.x * zoom).toFloat() + panX + centerX, (centerY + panY) - (proj.y * zoom).toFloat())
    }

    fun screenToWorld(x: Float, y: Float, screenWidth: Float, screenHeight: Float): Point3 {
        val centerX = screenWidth / 2f
        val centerY = screenHeight / 2f
        val worldX = (x - centerX - panX) / zoom
        val worldY = (centerY + panY - y) / zoom
        return Point3(worldX.toDouble(), worldY.toDouble(), 0.0)
    }

    fun getRayFromScreen(offset: Offset, screenWidth: Float, screenHeight: Float): Ray {
        val cosY = cos(cameraYaw.toDouble()); val sinY = sin(cameraYaw.toDouble())
        val cosP = cos(cameraPitch.toDouble()); val sinP = sin(cameraPitch.toDouble())
        val dir = Vector3(sinY * cosP, sinP, cosY * cosP).normalize()
        val worldPt = screenToWorld(offset.x, offset.y, screenWidth, screenHeight)
        val origin = worldPt.add(dir.multiply(-1000.0))
        return Ray(origin, dir)
    }

    fun isPointInsideActiveSketch(pt: Point3, screenWidth: Float, screenHeight: Float): Boolean {
        val geometries = activeSketch.getGeometries().filterIsInstance<Line>()
        if (geometries.isEmpty()) return false
        val screenVerts = geometries.map { worldToScreen(it.startPoint, screenWidth, screenHeight) }
        return isPointInPolygon(worldToScreen(pt, screenWidth, screenHeight), screenVerts)
    }

    fun performMaterialHitTest(dropPoint: Offset, droppedMat: RenderMaterial, screenWidth: Float, screenHeight: Float, context: Context) {
        var hitComp: Component3D? = null; var highestZ = -Double.MAX_VALUE
        mainAssembly.components.forEach { comp ->
            if (!comp.isVisible) return@forEach
            comp.features.forEach { feature ->
                val solid = (feature as? ExtrudeFeature)?.generatedGeometry ?: (feature as? RevolveFeature)?.generatedGeometry
                solid?.faces?.forEach { face ->
                    val tVertices = face.vertices.map { project3DTo2D(it.transform(comp.transform)) }; val avgZ = tVertices.sumOf { it.z } / tVertices.size; val screenVerts = tVertices.map { p -> worldToScreen(p, screenWidth, screenHeight) }
                    if (isPointInPolygon(dropPoint, screenVerts)) { if (avgZ > highestZ) { highestZ = avgZ; hitComp = comp } }
                }
            }
        }
        if (hitComp != null) { componentMaterials[hitComp!!] = droppedMat; triggerUpdate(); Toast.makeText(context, "${droppedMat.name} uygulandı: ${hitComp!!.name}", Toast.LENGTH_SHORT).show() }
    }

    fun triggerUpdate() { updateTrigger++; if (saveStatus == "Saved") saveStatus = "Unsaved changes" }
    fun onUndo() { commandManager.undo(); triggerUpdate() }
    fun onRedo() { commandManager.redo(); triggerUpdate() }

    fun onTap(offset: Offset, screenWidth: Float, screenHeight: Float) {
        val pt = screenToWorld(offset.x, offset.y, screenWidth, screenHeight)
        val currentSelected = selectionManager.firstOrNull()
        if (currentSelected != null) {
            var isBubbleClicked = false
            when (val geom = currentSelected) {
                is Line -> {
                    val midPt = Point3((geom.startPoint.x + geom.endPoint.x) / 2, (geom.startPoint.y + geom.endPoint.y) / 2, 0.0); val midScreen = worldToScreen(midPt, screenWidth, screenHeight)
                    if (sqrt((offset.x - midScreen.x).pow(2) + (offset.y - (midScreen.y - 30f)).pow(2)) < 60f) { dimInput = String.format(Locale.US, "%.1f", geom.length()); showDimDialog = true; isBubbleClicked = true }
                }
                is Circle3D -> {
                    val angle = PI / 4; val edgePt = Point3(geom.center.x + geom.radius * cos(angle), geom.center.y + geom.radius * sin(angle), 0.0); val edgeScreen = worldToScreen(edgePt, screenWidth, screenHeight)
                    if (sqrt((offset.x - edgeScreen.x).pow(2) + (offset.y - edgeScreen.y).pow(2)) < 60f) { dimInput = String.format(Locale.US, "%.1f", geom.radius); showDimDialog = true; isBubbleClicked = true }
                }
            }
            if (isBubbleClicked) return
        }
        if (currentMode == CadMode.SMART_SKETCH || currentMode == CadMode.NAVIGATE) {
            val clickedGeom = pick3DEntity(offset.x, offset.y, screenWidth, screenHeight); activeSketch.clearSelection()
            if (clickedGeom != null) { selectionManager.select(clickedGeom); selectionPoint = offset; currentMeasurement = MeasurementEngine.measure(selectionManager.selectedEntities) }
            else { selectionManager.clear(); selectionPoint = null; currentMeasurement = null }
            triggerUpdate()
        }
    }

    fun onLongPress(context: Context) {
        if (activeSketch.getGeometries().isNotEmpty() && currentMode == CadMode.SMART_SKETCH) { currentMode = CadMode.EXTRUDE; dynamicExtrudeHeight = 0f; Toast.makeText(context, "Katılamaya Hazır! Yukarı Çekin.", Toast.LENGTH_SHORT).show() }
    }

    fun onSketchDragStart(offset: Offset, screenWidth: Float, screenHeight: Float, context: Context) {
        val axis = Manipulator3D.hitTest(offset, this, screenWidth, screenHeight)
        if (axis != null) {
            activeManipulatorAxis = axis; val ray = getRayFromScreen(offset, screenWidth, screenHeight); val center = getSelectedEntityCenter() ?: Point3.origin()
            manipulationAnchorPoint = when {
                axis == "X" -> ray.closestPointOnAxis(center, Vector3(1.0, 0.0, 0.0))
                axis == "Y" -> ray.closestPointOnAxis(center, Vector3(0.0, 1.0, 0.0))
                axis == "Z" -> ray.closestPointOnAxis(center, Vector3(0.0, 0.0, 1.0))
                axis == "XY" -> ray.intersectPlane(center, Vector3(0.0, 0.0, 1.0))
                axis == "XZ" -> ray.intersectPlane(center, Vector3(0.0, 1.0, 0.0))
                axis == "YZ" -> ray.intersectPlane(center, Vector3(1.0, 0.0, 0.0))
                axis == "ROT_X" -> ray.intersectPlane(center, Vector3(1.0, 0.0, 0.0))
                axis == "ROT_Y" -> ray.intersectPlane(center, Vector3(0.0, 1.0, 0.0))
                axis == "ROT_Z" -> ray.intersectPlane(center, Vector3(0.0, 0.0, 1.0))
                else -> null
            }
            interactionState = InteractionState.STYLUS_MANIPULATING; return
        }
        val rawPoint = screenToWorld(offset.x, offset.y, screenWidth, screenHeight); val snapResult = SnapEngine.snapPoint(rawPoint, null, activeSketch.getGeometries(), mainAssembly.components, zoom); val startPt = snapResult.point; startSnap = snapResult
        if (currentMode == CadMode.SMART_SKETCH && isPointInsideActiveSketch(rawPoint, screenWidth, screenHeight)) { currentMode = CadMode.EXTRUDE; dynamicExtrudeHeight = 0f; interactionState = InteractionState.STYLUS_MANIPULATING }
        else if (isSketchMode || currentMode.name.startsWith("SKETCH_") || currentMode == CadMode.TRIM) {
            rawStroke = listOf(startPt); interactionState = InteractionState.STYLUS_DRAWING; val geom = selectionManager.firstOrNull()
            if (geom is Line) {
                val dStart = sqrt((startPt.x - geom.startPoint.x).pow(2) + (startPt.y - geom.startPoint.y).pow(2)); val dEnd = sqrt((startPt.x - geom.endPoint.x).pow(2) + (startPt.y - geom.endPoint.y).pow(2))
                if (dStart < 30.0 / zoom) { dragHandle = 0 } else if (dEnd < 30.0 / zoom) { dragHandle = 1 } else { dragHandle = -1 }
            }
        } else if (currentMode == CadMode.EXTRUDE) { dynamicExtrudeHeight = 0f; interactionState = InteractionState.STYLUS_MANIPULATING }
    }

    fun onSketchDrag(position: Offset, dragAmount: Offset, screenWidth: Float, screenHeight: Float, context: Context) {
        if (activeManipulatorAxis != null && manipulationAnchorPoint != null) {
            val ray = getRayFromScreen(position, screenWidth, screenHeight); val center = getSelectedEntityCenter() ?: Point3.origin()
            val currentPt = when {
                activeManipulatorAxis == "X" -> ray.closestPointOnAxis(center, Vector3(1.0, 0.0, 0.0))
                activeManipulatorAxis == "Y" -> ray.closestPointOnAxis(center, Vector3(0.0, 1.0, 0.0))
                activeManipulatorAxis == "Z" -> ray.closestPointOnAxis(center, Vector3(0.0, 0.0, 1.0))
                activeManipulatorAxis == "XY" -> ray.intersectPlane(center, Vector3(0.0, 0.0, 1.0))
                activeManipulatorAxis == "XZ" -> ray.intersectPlane(center, Vector3(0.0, 1.0, 0.0))
                activeManipulatorAxis == "YZ" -> ray.intersectPlane(center, Vector3(1.0, 0.0, 0.0))
                activeManipulatorAxis == "ROT_X" -> ray.intersectPlane(center, Vector3(1.0, 0.0, 0.0))
                activeManipulatorAxis == "ROT_Y" -> ray.intersectPlane(center, Vector3(0.0, 1.0, 0.0))
                activeManipulatorAxis == "ROT_Z" -> ray.intersectPlane(center, Vector3(0.0, 0.0, 1.0))
                else -> null
            }
            if (currentPt != null) {
                val selected = selectionManager.firstOrNull()
                if (activeManipulatorAxis?.startsWith("ROT_") == true) {
                    val vOld = manipulationAnchorPoint!!.subtract(center).normalize(); val vNew = currentPt.subtract(center).normalize(); val dot = vOld.dot(vNew); val angle = acos(max(-1.0, min(1.0, dot))); val cross = vOld.cross(vNew)
                    val axisNormal = when(activeManipulatorAxis) { "ROT_X" -> Vector3(1.0, 0.0, 0.0); "ROT_Y" -> Vector3(0.0, 1.0, 0.0); else -> Vector3(0.0, 0.0, 1.0) }
                    val direction = if (cross.dot(axisNormal) > 0) 1.0 else -1.0; val finalAngle = angle * direction
                    val component = mainAssembly.components.find { comp -> comp.features.any { feat -> (feat as? ExtrudeFeature)?.generatedGeometry == selected || (feat as? RevolveFeature)?.generatedGeometry == selected } }
                    component?.let { val rotation = when(activeManipulatorAxis) { "ROT_X" -> Matrix4.rotationX(finalAngle); "ROT_Y" -> Matrix4.rotationY(finalAngle); else -> Matrix4.rotationZ(finalAngle) }; it.transform = it.transform.multiply(rotation) }
                } else {
                    val delta = Vector3(currentPt.x - manipulationAnchorPoint!!.x, currentPt.y - manipulationAnchorPoint!!.y, currentPt.z - manipulationAnchorPoint!!.z)
                    if (activeManipulatorAxis == "FACE_NORMAL" && selected is Face3D) { (mainAssembly.components.flatMap { it.features }.find { it.id == selected.parentFeatureId } as? ExtrudeFeature)?.let { it.depth += delta.length() * (if (delta.dot(selected.normal()) > 0) 1 else -1); it.evaluate() } }
                    else { val component = mainAssembly.components.find { comp -> comp.features.any { feat -> (feat as? ExtrudeFeature)?.generatedGeometry == selected || (feat as? RevolveFeature)?.generatedGeometry == selected } }; component?.let { it.tx += delta.x; it.ty += delta.y; it.tz += delta.z; it.updateTransform() } }
                }
                manipulationAnchorPoint = currentPt; triggerUpdate()
            }
            return
        }
        if (currentMode == CadMode.NAVIGATE) { cameraYaw += dragAmount.x * 0.005f; cameraPitch -= dragAmount.y * 0.005f; triggerUpdate() }
        else if (isSketchMode || currentMode.name.startsWith("SKETCH_") || currentMode == CadMode.TRIM) {
            val rawPt = screenToWorld(position.x, position.y, screenWidth, screenHeight); val snap = SnapEngine.snapPoint(rawPt, rawStroke.firstOrNull(), activeSketch.getGeometries(), mainAssembly.components, zoom); val pt = snap.point; currentSnap = snap; interactionState = InteractionState.STYLUS_DRAWING
            if (currentMode == CadMode.SMART_SKETCH && pencilDetector.checkDwellCondition()) { val straightened = PredictiveSketchEngine.straighten(rawStroke.first(), pt); previewGeometry = straightened; activeInference = if (abs(straightened.endPoint.y - rawStroke.first().y) < 0.1) "H" else "V" }
            else {
                rawStroke = rawStroke + pt
                when (currentMode) {
                    CadMode.SKETCH_LINE_MANUAL, CadMode.SMART_SKETCH -> { if (rawStroke.size >= 2) previewGeometry = Line(rawStroke.first(), pt) }
                    CadMode.SKETCH_CIRCLE -> { if (rawStroke.size >= 2) previewGeometry = Circle3D(rawStroke.first(), rawStroke.first().distanceTo(pt)) }
                    CadMode.SKETCH_RECT_DIAG -> { if (rawStroke.size >= 2) previewGeometry = Line(rawStroke.first(), pt) }
                    CadMode.SKETCH_RECT_CENTER -> { if (rawStroke.size >= 2) { val center = rawStroke.first(); val corner = pt; val dx = abs(corner.x - center.x); val dy = abs(corner.y - center.y); previewGeometry = Line(center, corner) } }
                    CadMode.SKETCH_POLYGON -> { if (rawStroke.size >= 2) previewGeometry = Circle3D(rawStroke.first(), rawStroke.first().distanceTo(pt)) }
                    CadMode.TRIM -> { val geoms = activeSketch.getGeometries().filterIsInstance<Line>().toMutableList(); val toRemove = geoms.filter { it.distanceToPoint(pt) < 15.0 / zoom }; if (toRemove.isNotEmpty()) { geoms.removeAll(toRemove); activeSketch.clearWorkspace(); geoms.forEach { activeSketch.addGeometry(it) } } }
                    else -> {}
                }
            }
            triggerUpdate()
        } else if (currentMode == CadMode.EXTRUDE) { dynamicExtrudeHeight -= dragAmount.y * 0.5f; triggerUpdate() }
    }

    fun onSketchDragEnd(context: Context) {
        val endSnapLocal = currentSnap; val startSnapLocal = startSnap
        activeManipulatorAxis = null; previewGeometry = null; activeInference = null; interactionState = InteractionState.IDLE
        when (currentMode) {
            CadMode.TRIM -> { rawStroke = emptyList(); currentMode = CadMode.SMART_SKETCH; triggerUpdate() }
            CadMode.SKETCH_LINE_MANUAL, CadMode.SMART_SKETCH -> {
                if (dragHandle == -1 && rawStroke.size >= 2) {
                    val line = Line(rawStroke.first(), rawStroke.last()); commandManager.execute(AddGeometryCommand(activeSketch, line))
                    if (endSnapLocal?.type == SnapType.HORIZONTAL) commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, HorizontalConstraint(line)))
                    else if (endSnapLocal?.type == SnapType.VERTICAL) commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, VerticalConstraint(line)))
                    startSnapLocal?.let { s -> if (s.type == SnapType.ENDPOINT && s.refGeometry is Line) { val ref = s.refGeometry as Line; val refPt = if (s.point.distanceTo(ref.startPoint) < 0.1) ref.startPoint else ref.endPoint; commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, CoincidentConstraint(line.startPoint, refPt))) } }
                    endSnapLocal?.let { e -> if (e.type == SnapType.ENDPOINT && e.refGeometry is Line) { val ref = e.refGeometry as Line; val refPt = if (e.point.distanceTo(ref.startPoint) < 0.1) ref.startPoint else ref.endPoint; commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, CoincidentConstraint(line.endPoint, refPt))) } }
                    if (endSnapLocal?.type == SnapType.PARALLEL && endSnapLocal.refGeometry is Line) commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, ParallelConstraint(line, endSnapLocal.refGeometry as Line)))
                    else if (endSnapLocal?.type == SnapType.PERPENDICULAR && endSnapLocal.refGeometry is Line) commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, PerpendicularConstraint(line, endSnapLocal.refGeometry as Line)))
                    else if (endSnapLocal?.type == SnapType.TANGENT && endSnapLocal.refGeometry is Circle3D) commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, TangentConstraint(line, endSnapLocal.refGeometry as Circle3D)))
                }
                rawStroke = emptyList(); dragHandle = -1; triggerUpdate()
            }
            CadMode.SKETCH_CIRCLE -> {
                if (rawStroke.size >= 2) { val center = rawStroke.first(); val radius = center.distanceTo(rawStroke.last()); val circle = Circle3D(center, radius); commandManager.execute(AddGeometryCommand(activeSketch, circle)); if (startSnapLocal?.type == SnapType.CENTER && startSnapLocal.refGeometry is Circle3D) commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, ConcentricConstraint(circle, startSnapLocal.refGeometry as Circle3D))) }
                rawStroke = emptyList(); triggerUpdate()
            }
            CadMode.SKETCH_RECT_DIAG -> {
                if (rawStroke.size >= 2) { val p1 = rawStroke.first(); val p2 = rawStroke.last(); PredictiveSketchEngine.generateRectangleDiagonal(p1, p2).forEach { commandManager.execute(AddGeometryCommand(activeSketch, it)) } }
                rawStroke = emptyList(); triggerUpdate()
            }
            CadMode.SKETCH_RECT_CENTER -> {
                if (rawStroke.size >= 2) { val center = rawStroke.first(); val corner = rawStroke.last(); val dx = abs(corner.x - center.x); val dy = abs(corner.y - center.y); val p1 = Point3(center.x - dx, center.y - dy, 0.0); val p2 = Point3(center.x + dx, center.y + dy, 0.0); PredictiveSketchEngine.generateRectangleDiagonal(p1, p2).forEach { commandManager.execute(AddGeometryCommand(activeSketch, it)) } }
                rawStroke = emptyList(); triggerUpdate()
            }
            CadMode.SKETCH_POLYGON -> {
                if (rawStroke.size >= 2) { val center = rawStroke.first(); val radius = center.distanceTo(rawStroke.last()); PredictiveSketchEngine.generatePolygon(center, radius).forEach { commandManager.execute(AddGeometryCommand(activeSketch, it)) } }
                rawStroke = emptyList(); triggerUpdate()
            }
            CadMode.SKETCH_ARC -> {
                if (rawStroke.size >= 3) { val arc = PredictiveSketchEngine.recognize(rawStroke, zoom).firstOrNull() as? Arc3D; if (arc != null) commandManager.execute(AddGeometryCommand(activeSketch, arc)) }
                rawStroke = emptyList(); triggerUpdate()
            }
            CadMode.EXTRUDE -> {
                if (activeSketch.getGeometries().isNotEmpty() && abs(dynamicExtrudeHeight) > 5f) { val extrude = ExtrudeFeature(sketch = activeSketch, depth = dynamicExtrudeHeight.toDouble(), name = "Extrude ${mainAssembly.components.size}"); val newComp = Component3D("Gövde ${mainAssembly.components.size + 1}").apply { features.add(extrude) }; commandManager.execute(AddComponentCommand(mainAssembly, newComp)); activeSketch.clearWorkspace(); dynamicExtrudeHeight = 0f; currentMode = CadMode.SMART_SKETCH; Toast.makeText(context, "3D Gövde Oluşturuldu!", Toast.LENGTH_SHORT).show() }
                triggerUpdate()
            }
            else -> { rawStroke = emptyList(); dragHandle = -1; triggerUpdate() }
        }
        pencilDetector.clearHistory(); currentSnap = null; startSnap = null
    }

    fun applyDimension(newVal: Double) {
        val geom = selectionManager.firstOrNull()
        if (geom != null && newVal > 0) { when (geom) { is Line -> { gcsManager.addConstraint(LengthConstraint(geom, newVal)); geom.isFullyDefined = true } is Circle3D -> { geom.radius = newVal; geom.isFullyDefined = true } }; triggerUpdate() }
        showDimDialog = false
    }

    fun getSelectedEntityCenter(): Point3? {
        val selected = selectionManager.firstOrNull() ?: return null
        return when (selected) { 
            is Line -> Point3((selected.startPoint.x + selected.endPoint.x) / 2.0, (selected.startPoint.y + selected.endPoint.y) / 2.0, 0.0) 
            is Circle3D -> selected.center 
            is Solid3D -> { val allVerts = selected.faces.flatMap { it.vertices }; if (allVerts.isEmpty()) Point3(0.0, 0.0, 0.0) else Point3(allVerts.map { it.x }.average(), allVerts.map { it.y }.average(), allVerts.map { it.z }.average()) } 
            else -> null 
        }
    }

    fun fitAll() {
        var minX = Double.MAX_VALUE; var maxX = -Double.MAX_VALUE; var minY = Double.MAX_VALUE; var maxY = -Double.MAX_VALUE; var anyVisible = false
        mainAssembly.components.forEach { comp -> if (!comp.isVisible) return@forEach; comp.features.forEach { feat -> val geom = (feat as? ExtrudeFeature)?.generatedGeometry ?: (feat as? RevolveFeature)?.generatedGeometry; geom?.faces?.flatMap { it.vertices }?.forEach { v -> val tv = v.transform(comp.transform); minX = min(minX, tv.x); maxX = max(maxX, tv.x); minY = min(minY, tv.y); maxY = max(maxY, tv.y); anyVisible = true } } }
        activeSketch.getGeometries().forEach { geom -> when (geom) { is Line -> { minX = min(minX, geom.startPoint.x); maxX = max(maxX, geom.startPoint.x); minY = min(minY, geom.startPoint.y); maxY = max(maxY, geom.startPoint.y); minX = min(minX, geom.endPoint.x); maxX = max(maxX, geom.endPoint.x); minY = min(minY, geom.endPoint.y); maxY = max(maxY, geom.endPoint.y); anyVisible = true } is Circle3D -> { minX = min(minX, geom.center.x - geom.radius); maxX = max(maxX, geom.center.x + geom.radius); minY = min(minY, geom.center.y - geom.radius); maxY = max(maxY, geom.center.y + geom.radius); anyVisible = true } } }
        if (anyVisible) { val width = maxX - minX; val height = maxY - minY; val centerX = (minX + maxX) / 2.0; val centerY = (minY + maxY) / 2.0; panX = -centerX.toFloat() * zoom; panY = -centerY.toFloat() * zoom; val scale = 500f / max(width, height).toFloat(); zoom = max(0.5f, min(5f, scale)); triggerUpdate() }
    }

    fun goHome() { cameraPitch = 0.5f; cameraYaw = -0.5f; panX = 0f; panY = 0f; zoom = 1.5f; triggerUpdate() }
    fun setFrontView() { cameraPitch = 0f; cameraYaw = 0f; triggerUpdate() }
    fun setBackView() { cameraPitch = 0f; cameraYaw = PI.toFloat(); triggerUpdate() }
    fun setTopView() { cameraPitch = PI.toFloat()/2f; cameraYaw = 0f; triggerUpdate() }
    fun setBottomView() { cameraPitch = -PI.toFloat()/2f; cameraYaw = 0f; triggerUpdate() }
    fun setLeftView() { cameraPitch = 0f; cameraYaw = -PI.toFloat()/2f; triggerUpdate() }
    fun setRightView() { cameraPitch = 0f; cameraYaw = PI.toFloat()/2f; triggerUpdate() }
    fun setIsometricView() { cameraPitch = 0.6f; cameraYaw = -0.6f; triggerUpdate() }

    fun startSketchFlow() { showPlaneSelector = true }

    fun enterSketchMode(plane: String) {
        selectedSketchPlane = plane; isSketchMode = true; showPlaneSelector = false; currentMode = CadMode.SMART_SKETCH; activeCategory = ToolbarCategory.SKETCH
        val newSketch = SketchFeature("Sketch ${document.sketches.size + 1}"); document.sketches.add(newSketch); activeSketch = newSketch
        when(plane) { "XY" -> { cameraPitch = 0f; cameraYaw = 0f }; "XZ" -> { cameraPitch = 1.57f; cameraYaw = 0f }; "YZ" -> { cameraPitch = 0f; cameraYaw = 1.57f } }
        triggerUpdate()
    }

    fun exitSketchMode(commit: Boolean) { isSketchMode = false; selectedSketchPlane = null; currentMode = CadMode.NAVIGATE; triggerUpdate() }

    fun renameComponent() { showRenameDialog?.let { it.name = renameInput; showRenameDialog = null; triggerUpdate() } }

    fun runCommand(cmdId: String, context: Context) {
        when (cmdId) {
            "sketch" -> startSketchFlow()
            "line" -> currentMode = CadMode.SKETCH_LINE_MANUAL
            "circle" -> currentMode = CadMode.SKETCH_CIRCLE
            "extrude" -> { val selected = selectionManager.firstOrNull(); if (selected != null) { currentMode = CadMode.EXTRUDE; dynamicExtrudeHeight = 10f } else { Toast.makeText(context, "Please select a sketch profile", Toast.LENGTH_SHORT).show() } }
            "confirm_extrude" -> { val sketchToUse = (selectionManager.firstOrNull() as? SketchFeature) ?: activeSketch; val extrude = ExtrudeFeature(sketch = sketchToUse, depth = dynamicExtrudeHeight.toDouble(), name = "Extrude ${mainAssembly.components.size + 1}", operation = extrudeOperation, isSymmetric = isExtrudeSymmetric, isReversed = isExtrudeReversed); val newComp = Component3D(extrude.name).apply { features.add(extrude) }; commandManager.execute(AddComponentCommand(mainAssembly, newComp)); currentMode = CadMode.NAVIGATE; dynamicExtrudeHeight = 0f; selectionManager.clear() }
            "fillet" -> currentMode = CadMode.FILLET
            "mate_coincident" -> { val selected = selectionManager.selectedEntities; if (selected.size >= 2) { val faceA = selected[0] as? Face3D; val faceB = selected[1] as? Face3D; val solidA = if (faceA != null) null else selected[0] as? Solid3D; val solidB = if (faceB != null) null else selected[1] as? Solid3D; val compA = mainAssembly.components.find { c -> c.features.any { (it as? ExtrudeFeature)?.generatedGeometry == (solidA ?: (selected[0] as? Solid3D)) } || c.features.any { (it as? ExtrudeFeature)?.generatedGeometry?.faces?.contains(faceA) == true } }; val compB = mainAssembly.components.find { c -> c.features.any { (it as? ExtrudeFeature)?.generatedGeometry == (solidB ?: (selected[1] as? Solid3D)) } || c.features.any { (it as? ExtrudeFeature)?.generatedGeometry?.faces?.contains(faceB) == true } }; if (compA != null && compB != null && compA != compB) { mainAssembly.addMate(CoincidentMate(compA, compB, faceA, faceB)); Toast.makeText(context, "Mate Applied!", Toast.LENGTH_SHORT).show(); selectionManager.clear() } } }
            "delete" -> { selectionManager.selectedEntities.forEach { entity -> if (activeSketch.getGeometries().contains(entity)) { activeSketch.removeGeometry(entity) } }; selectionManager.clear() }
        }
        triggerUpdate()
    }
}
