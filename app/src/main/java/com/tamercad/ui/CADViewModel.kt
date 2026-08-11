package com.tamercad.ui

import android.content.Context
import android.util.Log
import androidx.compose.runtime.*
import androidx.compose.ui.geometry.Offset
import androidx.lifecycle.ViewModel
import com.tamercad.core.assembly.*
import com.tamercad.core.features.*
import com.tamercad.core.geometry.*
import com.tamercad.core.math.*
import com.tamercad.core.math.Vec2
import com.tamercad.core.math.Vec3
import com.tamercad.core.math.Ray3
import com.tamercad.core.math.SketchPlane
import com.tamercad.ui.sketch.SketchTool
import com.tamercad.core.sketch.*
import com.tamercad.core.commands.*
import com.tamercad.core.constraints.*
import com.tamercad.core.analysis.MeasurementEngine
import com.tamercad.ui.interaction.*
import com.tamercad.ui.selection.SelectionManager
import com.tamercad.ui.state.SettingsState
import com.tamercad.core.document.CADDocument
import com.tamercad.ui.toolbar.ToolbarCategory
import java.util.*
import kotlin.math.*

/**
 * TAMERCAD — PHASE 2.0.6 — CAD-GRADE INTERACTION ENGINE
 */
class CADViewModel : ViewModel() {
    
    // UI & Interaction States
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
    
    // Camera
    var cameraPitch by mutableFloatStateOf(0.5f)
    var cameraYaw by mutableFloatStateOf(-0.5f)
    var panX by mutableFloatStateOf(0f)
    var panY by mutableFloatStateOf(0f)
    var zoom by mutableFloatStateOf(1.5f)
    
    // Authoritative Sketch Session
    var activeSketchId by mutableStateOf<String?>(null)
    var activeSketchTool by mutableStateOf(SketchTool.NONE)
    var isSketchMode by mutableStateOf(false)
    var activeSketchPlane by mutableStateOf(SketchPlane.XY)
    
    val currentActiveSketch: SketchFeature? get() = document.sketches.find { it.id == activeSketchId }

    // Diagnostics
    var stylusPressure by mutableFloatStateOf(0f)
    var isStylusDown by mutableStateOf(false)
    var gestureMode by mutableStateOf("IDLE")
    var diagnosticPanDelta by mutableStateOf(Offset.Zero)
    var diagnosticZoomScale by mutableFloatStateOf(1f)
    var rawPointerCount by mutableIntStateOf(0)
    var activeFingerCount by mutableIntStateOf(0)
    var hoverPointWorld by mutableStateOf<Vec3?>(null)
    var hoverPointLocal by mutableStateOf<Vec2?>(null)
    var currentGridSpacing by mutableDoubleStateOf(100.0)
    
    var lastCommitInfo by mutableStateOf("")

    private val MIN_ZOOM = 0.1f
    private val MAX_ZOOM = 50.0f
    private val PITCH_LIMIT = (PI / 2.0 - 0.01).toFloat()

    fun updateCamera(deltaYaw: Float, deltaPitch: Float, deltaZoom: Float, deltaPanX: Float, deltaPanY: Float) {
        if (!deltaYaw.isFinite() || !deltaPitch.isFinite() || !deltaZoom.isFinite() || 
            !deltaPanX.isFinite() || !deltaPanY.isFinite()) return
        cameraYaw += deltaYaw
        cameraPitch = (cameraPitch + deltaPitch).coerceIn(-PITCH_LIMIT, PITCH_LIMIT)
        zoom = (zoom * deltaZoom).coerceIn(MIN_ZOOM, MAX_ZOOM)
        panX += deltaPanX; panY += deltaPanY
        triggerUpdate()
    }

    var currentMode by mutableStateOf(CadMode.NAVIGATE)
    var selectedSketchPlane by mutableStateOf<String?>(null)
    var showPlaneSelector by mutableStateOf(false)
    var isPerspective by mutableStateOf(false)
    
    // Interaction Engine State
    var previewGeometry by mutableStateOf<IGeometry?>(null)
    var rawSketchPoints = mutableStateListOf<Vec2>()
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
    var renameInput by mutableStateOf("")
    var showRenameDialog by mutableStateOf<Component3D?>(null)
    var showInfoDialog by mutableStateOf(false)
    var showSettings by mutableStateOf(false)
    var showDimDialog by mutableStateOf(false)
    var dimInput by mutableStateOf("")
    var browserOffset by mutableStateOf(Offset(250f, 100f))
    var selectionPoint by mutableStateOf<Offset?>(null)
    var saveStatus by mutableStateOf("Saved")
    var updateTrigger by mutableIntStateOf(0)
    var currentMeasurement by mutableStateOf<MeasurementEngine.MeasurementResult?>(null)

    val componentMaterials = mutableStateMapOf<Component3D, RenderMaterial>()

    // Authoritative Coordinate Pipeline
    fun getPickRay(screenX: Float, screenY: Float, screenWidth: Float, screenHeight: Float): Ray3 {
        val centerX = screenWidth / 2f; val centerY = screenHeight / 2f
        val vx = (screenX - panX - centerX) / zoom.toDouble(); val vy = (centerY + panY - screenY) / zoom.toDouble()
        val cosY = cos(cameraYaw.toDouble()); val sinY = sin(cameraYaw.toDouble())
        val cosP = cos(cameraPitch.toDouble()); val sinP = sin(cameraPitch.toDouble())
        val rayOrigin = Vec3(vx * cosY - vy * sinP * sinY, vy * cosP, -vx * sinY - vy * sinP * cosY)
        val rayDir = Vec3(sinY * cosP, sinP, cosY * cosP)
        return Ray3(rayOrigin - (rayDir * 10000.0), rayDir)
    }

    fun screenToSketchPoint(screenX: Float, screenY: Float, screenWidth: Float, screenHeight: Float): Vec2? {
        val plane = currentActiveSketch?.plane ?: activeSketchPlane
        val ray = getPickRay(screenX, screenY, screenWidth, screenHeight)
        return plane.intersectRay(ray)?.let { plane.worldToLocal(it) }
    }

    fun sketchToScreen(point: Vec2, plane: SketchPlane, screenWidth: Float, screenHeight: Float): Offset {
        val world = plane.localToWorld(point)
        return worldToScreen(world.toPoint3(), screenWidth, screenHeight)
    }

    fun sketchToScreen(point: Vec2, screenWidth: Float, screenHeight: Float): Offset {
        val plane = currentActiveSketch?.plane ?: activeSketchPlane
        return sketchToScreen(point, plane, screenWidth, screenHeight)
    }

    fun worldToScreen(point: Point3, screenWidth: Float, screenHeight: Float): Offset {
        val proj = project3DTo2D(point)
        val centerX = screenWidth / 2f; val centerY = screenHeight / 2f
        return Offset((proj.x * zoom).toFloat() + panX + centerX, (centerY + panY) - (proj.y * zoom).toFloat())
    }

    fun project3DTo2D(p: Point3): Point3 {
        val cosY = cos(cameraYaw.toDouble()); val sinY = sin(cameraYaw.toDouble())
        val cosP = cos(cameraPitch.toDouble()); val sinP = sin(cameraPitch.toDouble())
        val x1 = p.x * cosY - p.z * sinY; val z1 = p.x * sinY + p.z * cosY
        val y2 = p.y * cosP - z1 * sinP
        return Point3(x1, y2, 0.0)
    }

    // --- CAD-GRADE INTERACTION ENGINE ---

    fun onStylusHover(x: Float, y: Float, w: Float, h: Float) {
        val pt = screenToSketchPoint(x, y, w, h) ?: return
        hoverPointLocal = pt
        val sketch = currentActiveSketch ?: return
        hoverPointWorld = sketch.plane.localToWorld(pt)
        
        // Professional hover-preview even without drag
        if (rawSketchPoints.isNotEmpty()) {
            updatePreview(pt, w, h)
        }
    }

    fun onSketchDragStart(offset: Offset, w: Float, h: Float, context: Context?) {
        val sketch = currentActiveSketch ?: return
        if (activeSketchTool == SketchTool.NONE || activeSketchTool == SketchTool.SELECT) {
            interactionState = InteractionState.IDLE; return
        }

        val localPt = screenToSketchPoint(offset.x, offset.y, w, h) ?: return
        val worldPt = sketch.plane.localToWorld(localPt).toPoint3()
        val snapResult = SnapEngine.snapPoint(worldPt, null, sketch.getGeometries(), mainAssembly.components, zoom)
        val finalLocalPt = sketch.plane.worldToLocal(Vec3.fromPoint3(snapResult.point))

        if ((activeSketchTool == SketchTool.ARC && rawSketchPoints.size >= 1) || 
            (activeSketchTool == SketchTool.LINE && rawSketchPoints.size >= 1)) {
            // Continue existing command
        } else {
            rawSketchPoints.clear()
            rawSketchPoints.add(finalLocalPt)
        }
        
        interactionState = InteractionState.STYLUS_DRAWING
        updatePreview(finalLocalPt, w, h)
    }

    fun onSketchDrag(pos: Offset, dragAmount: Offset, w: Float, h: Float, context: Context?) {
        val pt = screenToSketchPoint(pos.x, pos.y, w, h) ?: return
        updatePreview(pt, w, h)
    }

    private fun updatePreview(localPt: Vec2, w: Float, h: Float) {
        val sketch = currentActiveSketch ?: return
        val worldPt = sketch.plane.localToWorld(localPt).toPoint3()
        val snap = SnapEngine.snapPoint(worldPt, null, sketch.getGeometries(), mainAssembly.components, zoom)
        currentSnap = snap
        val finalLocalPt = sketch.plane.worldToLocal(Vec3.fromPoint3(snap.point))

        if (rawSketchPoints.isNotEmpty()) {
            val p1 = rawSketchPoints.first()
            when (activeSketchTool) {
                SketchTool.LINE -> previewGeometry = SketchLine(p1, finalLocalPt)
                SketchTool.CIRCLE -> previewGeometry = SketchCircle(p1, p1.distanceTo(finalLocalPt))
                SketchTool.RECTANGLE -> previewGeometry = SketchRect(p1, finalLocalPt)
                SketchTool.ARC -> {
                    if (rawSketchPoints.size == 1) {
                        previewGeometry = SketchLine(p1, finalLocalPt)
                    } else if (rawSketchPoints.size == 2) {
                        val p2 = rawSketchPoints[1]
                        val center = Vec2.calculateCircumcenter(p1, p2, finalLocalPt)
                        if (center != null) {
                            val r = center.distanceTo(p1)
                            val sA = atan2(p1.y - center.y, p1.x - center.x)
                            val eA = atan2(p2.y - center.y, p2.x - center.x)
                            val mA = atan2(finalLocalPt.y - center.y, finalLocalPt.x - center.x)
                            previewGeometry = SketchArc(center, r, sA, eA, isPointClockwise(sA, mA, eA))
                        }
                    }
                }
                else -> { previewGeometry = null }
            }
        }
        triggerUpdate()
    }

    fun onSketchDragEnd(context: Context?) {
        val sketch = currentActiveSketch ?: return
        if (interactionState != InteractionState.STYLUS_DRAWING) return

        val snapEnd = currentSnap ?: return
        val pEnd = sketch.plane.worldToLocal(Vec3.fromPoint3(snapEnd.point))

        if (rawSketchPoints.isNotEmpty()) {
            val p1 = rawSketchPoints.first()
            when (activeSketchTool) {
                SketchTool.LINE -> {
                    if (p1.distanceTo(pEnd) > CadTolerance.MIN_LENGTH) {
                        commitEntity(SketchLine(p1, pEnd))
                        rawSketchPoints.clear(); rawSketchPoints.add(pEnd)
                    } else { resetActiveToolInteraction() }
                }
                SketchTool.CIRCLE -> {
                    val r = p1.distanceTo(pEnd)
                    if (r > CadTolerance.MIN_LENGTH) commitEntity(SketchCircle(p1, r))
                    resetActiveToolInteraction()
                }
                SketchTool.RECTANGLE -> {
                    if (abs(p1.x - pEnd.x) > CadTolerance.MIN_LENGTH && abs(p1.y - pEnd.y) > CadTolerance.MIN_LENGTH) {
                        commitEntity(SketchRect(p1, pEnd))
                    }
                    resetActiveToolInteraction()
                }
                SketchTool.ARC -> {
                    if (rawSketchPoints.size == 1) {
                        if (p1.distanceTo(pEnd) > CadTolerance.MIN_LENGTH) {
                            rawSketchPoints.add(pEnd) // Now have P1 and P2
                        } else { resetActiveToolInteraction() }
                    } else if (rawSketchPoints.size == 2) {
                        val pb = rawSketchPoints[1]
                        val center = Vec2.calculateCircumcenter(p1, pb, pEnd)
                        if (center != null) {
                            val r = center.distanceTo(p1)
                            val sA = atan2(p1.y - center.y, p1.x - center.x)
                            val eA = atan2(pb.y - center.y, pb.x - center.x)
                            val mA = atan2(pEnd.y - center.y, pEnd.x - center.x)
                            commitEntity(SketchArc(center, r, sA, eA, isPointClockwise(sA, mA, eA)))
                        }
                        resetActiveToolInteraction()
                    }
                }
                else -> { resetActiveToolInteraction() }
            }
        }
        interactionState = InteractionState.IDLE
    }

    private fun commitEntity(entity: SketchEntity) {
        val sketch = currentActiveSketch ?: return
        val before = sketch.getGeometries().size
        if (entity is SketchRect) {
            val p1 = entity.p1; val p2 = entity.p2
            val c2 = Vec2(p2.x, p1.y); val c4 = Vec2(p1.x, p2.y)
            commandManager.execute(AddGeometryCommand(sketch, SketchLine(p1, c2)))
            commandManager.execute(AddGeometryCommand(sketch, SketchLine(c2, p2)))
            commandManager.execute(AddGeometryCommand(sketch, SketchLine(p2, c4)))
            commandManager.execute(AddGeometryCommand(sketch, SketchLine(c4, p1)))
        } else {
            commandManager.execute(AddGeometryCommand(sketch, entity))
        }
        val after = sketch.getGeometries().size
        lastCommitInfo = "${entity.type} ID=${entity.id.take(4)} COUNT: $before -> $after"
        triggerUpdate()
    }

    private fun resetActiveToolInteraction() {
        previewGeometry = null; rawSketchPoints.clear()
        currentSnap = null; startSnap = null; interactionState = InteractionState.IDLE
        triggerUpdate()
    }

    fun triggerUpdate() { updateTrigger++ }
    fun onUndo() { commandManager.undo(); triggerUpdate() }
    fun onRedo() { commandManager.redo(); triggerUpdate() }
    fun goHome() { cameraPitch = 0.5f; cameraYaw = -0.5f; panX = 0f; panY = 0f; zoom = 1.5f; triggerUpdate() }
    fun fitAll() { goHome() }
    fun setFrontView() { cameraPitch = 0f; cameraYaw = 0f; triggerUpdate() }
    fun setBackView() { cameraPitch = 0f; cameraYaw = PI.toFloat(); triggerUpdate() }
    fun setTopView() { cameraPitch = PI.toFloat()/2f; cameraYaw = 0f; triggerUpdate() }
    fun setBottomView() { cameraPitch = -PI.toFloat()/2f; cameraYaw = 0f; triggerUpdate() }
    fun setLeftView() { cameraPitch = 0f; cameraYaw = -PI.toFloat()/2f; triggerUpdate() }
    fun setRightView() { cameraPitch = 0f; cameraYaw = PI.toFloat()/2f; triggerUpdate() }
    fun setIsometricView() { cameraPitch = 0.6f; cameraYaw = -0.6f; triggerUpdate() }
    
    fun pick3DEntity(screenX: Float, screenY: Float, screenWidth: Float, screenHeight: Float): IGeometry? {
        if (selectionManager.showSketches) {
            val ray = getPickRay(screenX, screenY, screenWidth, screenHeight)
            document.sketches.forEach { sketch ->
                val hitWorld = sketch.plane.intersectRay(ray)
                if (hitWorld != null) {
                    val hit = sketch.pickGeometry(hitWorld.toPoint3(), 20.0 / zoom)
                    if (hit != null) return hit
                }
            }
        }
        return null
    }

    fun getSelectedEntityCenter(): Point3? = null
    fun startSketchFlow() { showPlaneSelector = true }

    fun enterSketchMode(plane: String) {
        selectedSketchPlane = plane
        val planeObj = when(plane) {
            "XY" -> SketchPlane.XY; "XZ" -> SketchPlane.XZ; "YZ" -> SketchPlane.YZ
            else -> SketchPlane.XY
        }
        activeSketchPlane = planeObj; isSketchMode = true; showPlaneSelector = false; activeSketchTool = SketchTool.SELECT
        val newSketch = SketchFeature("Sketch ${document.sketches.size + 1}", planeObj)
        document.sketches.add(newSketch); activeSketchId = newSketch.id
        resetActiveToolInteraction(); triggerUpdate()
    }

    fun exitSketchMode(commit: Boolean) { 
        isSketchMode = false; activeSketchTool = SketchTool.NONE; activeSketchId = null; resetActiveToolInteraction(); triggerUpdate() 
    }

    fun runCommand(id: String, ctx: Context) {
        Log.d("TAMERCAD_UI", "TOOL_BUTTON_CLICK: $id")
        resetActiveToolInteraction()
        when(id) {
            "line" -> activeSketchTool = SketchTool.LINE
            "circle" -> activeSketchTool = SketchTool.CIRCLE
            "rect" -> activeSketchTool = SketchTool.RECTANGLE
            "arc" -> activeSketchTool = SketchTool.ARC
            "select" -> activeSketchTool = SketchTool.SELECT
            "sketch" -> startSketchFlow()
            else -> {}
        }
        triggerUpdate()
    }

    fun renameComponent() { showRenameDialog?.let { it.name = renameInput; showRenameDialog = null; triggerUpdate() } }
    fun applyDimension(v: Double) {}

    private fun isPointClockwise(start: Double, mid: Double, end: Double): Boolean {
        fun norm(a: Double) = (a % (2 * PI) + (2 * PI)) % (2 * PI)
        val s = norm(start); val m = norm(mid); val e = norm(end)
        return if (s < e) { m < s || m > e } else { m > e && m < s }
    }
}
