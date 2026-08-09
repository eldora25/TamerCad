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
import com.tamercad.ui.interaction.*
import com.tamercad.ui.selection.SelectionManager
import com.tamercad.ui.state.SettingsState
import com.tamercad.core.document.CADDocument
import com.tamercad.ui.components.PencilGestureDetector
import com.tamercad.ui.components.isPointInPolygon
import com.tamercad.ui.toolbar.ToolbarCategory
import java.util.*
import kotlin.math.*

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Zırhlı ViewModel Mimarisi - Build 71 - Phase 1.1 Recovery.
 */
class CADViewModel : ViewModel() {
    
    // UI & Etkileşim State'leri
    var activeCategory by mutableStateOf(ToolbarCategory.INSPECT)
    var interactionState by mutableStateOf(InteractionState.IDLE)
    
    val settings = SettingsState()
    val selectionManager = SelectionManager()
    val stylusInputManager = StylusInputManager()
    var isStylusInUse by mutableStateOf(false)
    var pointerCount by mutableIntStateOf(0)
    
    // Core Document
    val document = CADDocument()
    val mainAssembly get() = document.assembly
    val gcsManager get() = document.gcsManager
    val commandManager = CommandManager()
    
    // Kamera (Navigation)
    var cameraPitch by mutableFloatStateOf(0.5f)
    var cameraYaw by mutableFloatStateOf(-0.5f)
    var panX by mutableFloatStateOf(0f)
    var panY by mutableFloatStateOf(0f)
    var zoom by mutableFloatStateOf(1.5f)

    var currentMode by mutableStateOf(CadMode.NAVIGATE)
    var isSketchMode by mutableStateOf(false)
    var selectedSketchPlane by mutableStateOf<String?>(null)
    var showPlaneSelector by mutableStateOf(false)
    var isPerspective by mutableStateOf(false)
    
    // Modelleme State'leri
    var previewGeometry by mutableStateOf<IGeometry?>(null)
    var activeInference by mutableStateOf<String?>(null)
    var rawStroke by mutableStateOf<List<Point3>>(emptyList())
    var currentSnap by mutableStateOf<SnapResult?>(null)
    var startSnap by mutableStateOf<SnapResult?>(null)
    var activeManipulatorAxis by mutableStateOf<String?>(null)
    var manipulationAnchorPoint by mutableStateOf<Point3?>(null)
    
    // Extrude & Direct Modeling
    var dynamicExtrudeHeight by mutableFloatStateOf(0f)
    var isExtrudeSymmetric by mutableStateOf(false)
    var isExtrudeReversed by mutableStateOf(false)
    var extrudeOperation by mutableStateOf(ExtrudeOperation.NEW_BODY)

    // Dialog & UI
    var showRenameDialog by mutableStateOf<Component3D?>(null)
    var renameInput by mutableStateOf("")
    var showInfoDialog by mutableStateOf(false)
    var showSettings by mutableStateOf(false)
    var showDimDialog by mutableStateOf(false)
    var dimInput by mutableStateOf("")
    var browserOffset by mutableStateOf(Offset(250f, 100f))
    var selectionPoint by mutableStateOf<Offset?>(null)
    var saveStatus by mutableStateOf("Saved")
    var activeSketch by mutableStateOf(SketchFeature("Active Sketch"))
    var updateTrigger by mutableIntStateOf(0)
    var currentMeasurement by mutableStateOf<MeasurementEngine.MeasurementResult?>(null)

    // Materials
    val componentMaterials = mutableStateMapOf<Component3D, RenderMaterial>()

    // Math Helpers
    fun worldToScreen(point: Point3, screenWidth: Float, screenHeight: Float): Offset {
        val proj = project3DTo2D(point)
        val centerX = screenWidth / 2f
        val centerY = screenHeight / 2f
        return Offset((proj.x * zoom).toFloat() + panX + centerX, (centerY + panY) - (proj.y * zoom).toFloat())
    }

    fun screenToWorld(x: Float, y: Float, screenWidth: Float, screenHeight: Float): Point3 {
        val centerX = screenWidth / 2f; val centerY = screenHeight / 2f
        val worldX = (x - centerX - panX) / zoom; val worldY = (centerY + panY - y) / zoom
        return Point3(worldX.toDouble(), worldY.toDouble(), 0.0)
    }

    fun getRayFromScreen(offset: Offset, screenWidth: Float, screenHeight: Float): Ray {
        val cosY = cos(cameraYaw.toDouble()); val sinY = sin(cameraYaw.toDouble())
        val cosP = cos(cameraPitch.toDouble()); val sinP = sin(cameraPitch.toDouble())
        val dir = Vector3(sinY * cosP, sinP, cosY * cosP).normalize()
        val worldPt = screenToWorld(offset.x, offset.y, screenWidth, screenHeight)
        return Ray(worldPt.add(dir.multiply(-1000.0)), dir)
    }

    fun project3DTo2D(p: Point3): Point3 {
        val cosY = cos(cameraYaw.toDouble()); val sinY = sin(cameraYaw.toDouble())
        val cosP = cos(cameraPitch.toDouble()); val sinP = sin(cameraPitch.toDouble())
        val x1 = p.x * cosY - p.z * sinY; val z1 = p.x * sinY + p.z * cosY
        val y2 = p.y * cosP - z1 * sinP
        return Point3(x1, y2, 0.0)
    }

    // --- INTERACTION HANDLERS ---

    fun onSketchDragStart(offset: Offset, screenWidth: Float, screenHeight: Float, context: Context) {
        val rawPoint = screenToWorld(offset.x, offset.y, screenWidth, screenHeight)
        val snapResult = SnapEngine.snapPoint(rawPoint, null, activeSketch.getGeometries(), mainAssembly.components, zoom)
        startSnap = snapResult
        rawStroke = listOf(snapResult.point)
        interactionState = if (isSketchMode) InteractionState.STYLUS_DRAWING else InteractionState.STYLUS_MANIPULATING
    }

    fun onSketchDrag(position: Offset, dragAmount: Offset, screenWidth: Float, screenHeight: Float, context: Context) {
        val rawPt = screenToWorld(position.x, position.y, screenWidth, screenHeight)
        val snap = SnapEngine.snapPoint(rawPt, rawStroke.firstOrNull(), activeSketch.getGeometries(), mainAssembly.components, zoom)
        currentSnap = snap
        
        if (interactionState == InteractionState.STYLUS_DRAWING) {
            when (currentMode) {
                CadMode.SKETCH_LINE_MANUAL, CadMode.SMART_SKETCH -> {
                    if (rawStroke.isNotEmpty()) previewGeometry = Line(rawStroke.first(), snap.point)
                }
                CadMode.SKETCH_CIRCLE -> {
                    if (rawStroke.isNotEmpty()) previewGeometry = Circle3D(rawStroke.first(), rawStroke.first().distanceTo(snap.point))
                }
                else -> {}
            }
        }
        triggerUpdate()
    }

    fun onSketchDragEnd(context: Context) {
        val snapEnd = currentSnap ?: return
        if (interactionState == InteractionState.STYLUS_DRAWING && rawStroke.isNotEmpty()) {
            val startPoint = rawStroke.first()
            val endPoint = snapEnd.point
            
            when (currentMode) {
                CadMode.SKETCH_LINE_MANUAL, CadMode.SMART_SKETCH -> {
                    val line = Line(startPoint, endPoint)
                    commandManager.execute(AddGeometryCommand(activeSketch, line))
                    applyAdvancedConstraints(line, snapEnd)
                }
                CadMode.SKETCH_CIRCLE -> {
                    val circle = Circle3D(startPoint, startPoint.distanceTo(endPoint))
                    commandManager.execute(AddGeometryCommand(activeSketch, circle))
                }
                else -> {}
            }
        }
        previewGeometry = null; rawStroke = emptyList(); interactionState = InteractionState.IDLE; triggerUpdate()
    }

    private fun applyAdvancedConstraints(line: Line, snapEnd: SnapResult?) {
        // 1. Horizontal / Vertical Inferences
        if (snapEnd?.type == SnapType.HORIZONTAL) {
            commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, HorizontalConstraint(line)))
        } else if (snapEnd?.type == SnapType.VERTICAL) {
            commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, VerticalConstraint(line)))
        }

        // 2. Parallel / Perpendicular Inferences
        if (snapEnd?.type == SnapType.PARALLEL && snapEnd.refGeometry is Line) {
            commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, ParallelConstraint(line, snapEnd.refGeometry)))
        } else if (snapEnd?.type == SnapType.PERPENDICULAR && snapEnd.refGeometry is Line) {
            commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, PerpendicularConstraint(line, snapEnd.refGeometry)))
        }
        
        // 3. Basic H/V check for non-inference snaps
        if (snapEnd?.type == SnapType.NONE || snapEnd?.type == SnapType.GRID || snapEnd?.type == SnapType.ENDPOINT) {
            val dx = abs(line.endPoint.x - line.startPoint.x)
            val dy = abs(line.endPoint.y - line.startPoint.y)
            if (dy < 5.0 / zoom) commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, HorizontalConstraint(line)))
            else if (dx < 5.0 / zoom) commandManager.execute(AddConstraintCommand(activeSketch, gcsManager, VerticalConstraint(line)))
        }
    }

    fun pick3DEntity(screenX: Float, screenY: Float, screenWidth: Float, screenHeight: Float): IGeometry? {
        val tapPos = Offset(screenX, screenY)
        if (selectionManager.showSketches) {
            val worldTap = screenToWorld(screenX, screenY, screenWidth, screenHeight)
            document.sketches.forEach { sketch ->
                val hit = sketch.pickGeometry(worldTap, 20.0 / zoom)
                if (hit != null) return hit
            }
        }
        return null
    }

    fun triggerUpdate() { updateTrigger++ }
    fun onUndo() { commandManager.undo(); triggerUpdate() }
    fun onRedo() { commandManager.redo(); triggerUpdate() }
    fun goHome() { cameraPitch = 0.5f; cameraYaw = -0.5f; panX = 0f; panY = 0f; zoom = 1.5f; triggerUpdate() }
    fun fitAll() { cameraPitch = 0.5f; cameraYaw = -0.5f; panX = 0f; panY = 0f; zoom = 1.5f; triggerUpdate() }
    fun getSelectedEntityCenter(): Point3? = null
    fun onHover(offset: Offset, w: Float, h: Float) {}
    fun setFrontView() { cameraPitch = 0f; cameraYaw = 0f; triggerUpdate() }
    fun setBackView() { cameraPitch = 0f; cameraYaw = PI.toFloat(); triggerUpdate() }
    fun setTopView() { cameraPitch = PI.toFloat()/2f; cameraYaw = 0f; triggerUpdate() }
    fun setBottomView() { cameraPitch = -PI.toFloat()/2f; cameraYaw = 0f; triggerUpdate() }
    fun setLeftView() { cameraPitch = 0f; cameraYaw = -PI.toFloat()/2f; triggerUpdate() }
    fun setRightView() { cameraPitch = 0f; cameraYaw = PI.toFloat()/2f; triggerUpdate() }
    fun setIsometricView() { cameraPitch = 0.6f; cameraYaw = -0.6f; triggerUpdate() }
    fun startSketchFlow() { showPlaneSelector = true }
    fun enterSketchMode(plane: String) {
        selectedSketchPlane = plane; isSketchMode = true; showPlaneSelector = false; currentMode = CadMode.SMART_SKETCH
        val newSketch = SketchFeature("Sketch ${document.sketches.size + 1}"); document.sketches.add(newSketch); activeSketch = newSketch
        triggerUpdate()
    }
    fun exitSketchMode(commit: Boolean) { isSketchMode = false; currentMode = CadMode.NAVIGATE; triggerUpdate() }
    fun renameComponent() { showRenameDialog?.let { it.name = renameInput; showRenameDialog = null; triggerUpdate() } }
    fun runCommand(id: String, ctx: Context) {}
    fun applyDimension(v: Double) {}
}
