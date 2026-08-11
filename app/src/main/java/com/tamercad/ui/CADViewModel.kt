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

enum class InteractionIntent { PENDING, TAP, DRAG }

/**
 * TAMERCAD — PHASE 2.0.6.2 — STYLUS ROBUSTNESS & PLANE ALIGNMENT
 */
class CADViewModel : ViewModel() {
    
    var activeCategory by mutableStateOf(ToolbarCategory.INSPECT)
    var interactionState by mutableStateOf(InteractionState.IDLE)
    
    val settings = SettingsState()
    val selectionManager = SelectionManager()
    val stylusInputManager = StylusInputManager()
    var isStylusInUse by mutableStateOf(false)
    
    val document = CADDocument()
    val mainAssembly get() = document.assembly
    val gcsManager get() = document.gcsManager
    val commandManager = CommandManager()
    
    var cameraPitch by mutableFloatStateOf(0.5f)
    var cameraYaw by mutableFloatStateOf(-0.5f)
    var panX by mutableFloatStateOf(0f)
    var panY by mutableFloatStateOf(0f)
    var zoom by mutableFloatStateOf(1.5f)
    
    var activeSketchId by mutableStateOf<String?>(null)
    var activeSketchTool by mutableStateOf(SketchTool.NONE)
    var isSketchMode by mutableStateOf(false)
    var activeSketchPlane by mutableStateOf(SketchPlane.XY)
    
    val currentActiveSketch: SketchFeature? get() = document.sketches.find { it.id == activeSketchId }

    var stylusPressure by mutableFloatStateOf(0f)
    var isStylusDown by mutableStateOf(false)
    var gestureMode by mutableStateOf("IDLE")
    var rawPointerCount by mutableIntStateOf(0)
    var activeFingerCount by mutableIntStateOf(0)
    var hoverPointWorld by mutableStateOf<Vec3?>(null)
    var hoverPointLocal by mutableStateOf<Vec2?>(null)
    var currentGridSpacing by mutableDoubleStateOf(100.0)
    var lastCommitInfo by mutableStateOf("")

    // Gesture Robustness
    var interactionIntent by mutableStateOf(InteractionIntent.PENDING)
    var stylusMaxMoveDist by mutableFloatStateOf(0f)
    private var stylusDownPos = Offset.Zero
    private val tapSlopPx = 10f 
    private val dragStartSlopPx = 18f

    private val MIN_ZOOM = 0.1f; private val MAX_ZOOM = 50.0f
    private val PITCH_LIMIT = (PI / 2.0 - 0.01).toFloat()

    fun updateCamera(deltaYaw: Float, deltaPitch: Float, deltaZoom: Float, deltaPanX: Float, deltaPanY: Float) {
        if (!deltaYaw.isFinite() || !deltaPitch.isFinite() || !deltaZoom.isFinite() || !deltaPanX.isFinite() || !deltaPanY.isFinite()) return
        cameraYaw += deltaYaw; cameraPitch = (cameraPitch + deltaPitch).coerceIn(-PITCH_LIMIT, PITCH_LIMIT)
        zoom = (zoom * deltaZoom).coerceIn(MIN_ZOOM, MAX_ZOOM); panX += deltaPanX; panY += deltaPanY; triggerUpdate()
    }

    var currentMode by mutableStateOf(CadMode.NAVIGATE)
    var selectedSketchPlane by mutableStateOf<String?>(null)
    var showPlaneSelector by mutableStateOf(false)
    var isPerspective by mutableStateOf(false)
    
    var previewGeometry by mutableStateOf<IGeometry?>(null)
    val rawSketchPoints = mutableStateListOf<Vec2>()
    var currentSnap by mutableStateOf<SnapResult?>(null)
    var startSnap by mutableStateOf<SnapResult?>(null)

    // RESTORED PROPERTIES
    var dynamicExtrudeHeight by mutableFloatStateOf(0f)
    var isExtrudeSymmetric by mutableStateOf(false)
    var isExtrudeReversed by mutableStateOf(false)
    var extrudeOperation by mutableStateOf(ExtrudeOperation.NEW_BODY)

    var renameInput by mutableStateOf(""); var showRenameDialog by mutableStateOf<Component3D?>(null)
    var showInfoDialog by mutableStateOf(false); var showSettings by mutableStateOf(false)
    var showDimDialog by mutableStateOf(false); var dimInput by mutableStateOf("")
    var browserOffset by mutableStateOf(Offset(250f, 100f)); var selectionPoint by mutableStateOf<Offset?>(null)
    var saveStatus by mutableStateOf("Saved"); var updateTrigger by mutableIntStateOf(0)
    var currentMeasurement by mutableStateOf<MeasurementEngine.MeasurementResult?>(null)

    val componentMaterials = mutableStateMapOf<Component3D, RenderMaterial>()

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
        val proj = project3DTo2D(point); val centerX = screenWidth / 2f; val centerY = screenHeight / 2f
        return Offset((proj.x * zoom).toFloat() + panX + centerX, (centerY + panY) - (proj.y * zoom).toFloat())
    }

    fun project3DTo2D(p: Point3): Point3 {
        val cosY = cos(cameraYaw.toDouble()); val sinY = sin(cameraYaw.toDouble())
        val cosP = cos(cameraPitch.toDouble()); val sinP = sin(cameraPitch.toDouble())
        val x1 = p.x * cosY - p.z * sinY; val z1 = p.x * sinY + p.z * cosY
        val y2 = p.y * cosP - z1 * sinP
        return Point3(x1, y2, 0.0)
    }

    // --- INTERACTION ENGINE ---

    fun onStylusHover(x: Float, y: Float, w: Float, h: Float) {
        val pt = screenToSketchPoint(x, y, w, h) ?: return
        hoverPointLocal = pt; val sketch = currentActiveSketch ?: return
        hoverPointWorld = sketch.plane.localToWorld(pt); updatePreview(pt)
    }

    fun onStylusDown(x: Float, y: Float, w: Float, h: Float) {
        stylusDownPos = Offset(x, y); stylusMaxMoveDist = 0f; interactionIntent = InteractionIntent.PENDING
        isStylusDown = true; val pt = screenToSketchPoint(x, y, w, h) ?: return
        updatePreview(pt)
    }

    fun onStylusMove(x: Float, y: Float, w: Float, h: Float) {
        val dist = (Offset(x, y) - stylusDownPos).getDistance()
        if (dist > stylusMaxMoveDist) stylusMaxMoveDist = dist
        if (interactionIntent == InteractionIntent.PENDING && stylusMaxMoveDist > dragStartSlopPx) {
            interactionIntent = InteractionIntent.DRAG
            if (rawSketchPoints.isEmpty() && activeSketchTool != SketchTool.NONE && activeSketchTool != SketchTool.SELECT) {
                val startPt = screenToSketchPoint(stylusDownPos.x, stylusDownPos.y, w, h)
                if (startPt != null) rawSketchPoints.add(startPt)
            }
        }
        val pt = screenToSketchPoint(x, y, w, h) ?: return
        hoverPointLocal = pt; updatePreview(pt)
    }

    fun onStylusUp(x: Float, y: Float, w: Float, h: Float) {
        isStylusDown = false; val pt = screenToSketchPoint(x, y, w, h) ?: return
        if (stylusMaxMoveDist < dragStartSlopPx) {
            interactionIntent = InteractionIntent.TAP; onPointSelected(pt)
        } else { onPointSelected(pt) }
        interactionIntent = InteractionIntent.PENDING
    }

    fun onPointSelected(localPt: Vec2) {
        val sketch = currentActiveSketch ?: return
        if (activeSketchTool == SketchTool.NONE || activeSketchTool == SketchTool.SELECT) return
        val snap = SnapEngine.snapPoint(localPt, rawSketchPoints.lastOrNull(), sketch.getGeometries(), zoom, currentGridSpacing)
        val finalPt = snap.point
        when (activeSketchTool) {
            SketchTool.LINE -> {
                if (rawSketchPoints.isEmpty()) { rawSketchPoints.add(finalPt) } 
                else {
                    val p1 = rawSketchPoints.last()
                    if (p1.distanceTo(finalPt) > CadTolerance.MIN_LENGTH) {
                        commitEntity(SketchLine(p1, finalPt))
                        rawSketchPoints.clear(); rawSketchPoints.add(finalPt) 
                    }
                }
            }
            SketchTool.CIRCLE -> {
                if (rawSketchPoints.isEmpty()) { rawSketchPoints.add(finalPt) }
                else {
                    val center = rawSketchPoints[0]; val r = center.distanceTo(finalPt)
                    if (r > CadTolerance.MIN_LENGTH) commitEntity(SketchCircle(center, r))
                    rawSketchPoints.clear()
                }
            }
            SketchTool.RECTANGLE -> {
                if (rawSketchPoints.isEmpty()) { rawSketchPoints.add(finalPt) }
                else {
                    val p1 = rawSketchPoints[0]
                    if (abs(p1.x - finalPt.x) > CadTolerance.MIN_LENGTH && abs(p1.y - finalPt.y) > CadTolerance.MIN_LENGTH) {
                        commitEntity(SketchRect(p1, finalPt))
                    }
                    rawSketchPoints.clear()
                }
            }
            SketchTool.ARC -> {
                if (rawSketchPoints.size < 2) { rawSketchPoints.add(finalPt) }
                else {
                    val p1 = rawSketchPoints[0]; val p2 = rawSketchPoints[1]
                    val center = Vec2.calculateCircumcenter(p1, p2, finalPt)
                    if (center != null) {
                        val r = center.distanceTo(p1)
                        val sA = atan2(p1.y - center.y, p1.x - center.x)
                        val eA = atan2(p2.y - center.y, p2.x - center.x)
                        val mA = atan2(finalPt.y - center.y, finalPt.x - center.x)
                        commitEntity(SketchArc(center, r, sA, eA, isPointClockwise(sA, mA, eA)))
                    }
                    rawSketchPoints.clear()
                }
            }
            else -> {}
        }
        triggerUpdate()
    }

    private fun updatePreview(localPt: Vec2) {
        val sketch = currentActiveSketch ?: return
        val snap = SnapEngine.snapPoint(localPt, rawSketchPoints.lastOrNull(), sketch.getGeometries(), zoom, currentGridSpacing)
        currentSnap = snap
        val finalPt = snap.point
        if (rawSketchPoints.isNotEmpty()) {
            val pStart = rawSketchPoints.last()
            when (activeSketchTool) {
                SketchTool.LINE -> previewGeometry = SketchLine(pStart, finalPt)
                SketchTool.CIRCLE -> previewGeometry = SketchCircle(rawSketchPoints[0], rawSketchPoints[0].distanceTo(finalPt))
                SketchTool.RECTANGLE -> previewGeometry = SketchRect(rawSketchPoints[0], finalPt)
                SketchTool.ARC -> {
                    if (rawSketchPoints.size == 1) previewGeometry = SketchLine(rawSketchPoints[0], finalPt)
                    else if (rawSketchPoints.size == 2) {
                        val center = Vec2.calculateCircumcenter(rawSketchPoints[0], rawSketchPoints[1], finalPt)
                        if (center != null) {
                            val r = center.distanceTo(rawSketchPoints[0])
                            val sA = atan2(rawSketchPoints[0].y - center.y, rawSketchPoints[0].x - center.x)
                            val eA = atan2(rawSketchPoints[1].y - center.y, rawSketchPoints[1].x - center.x)
                            val mA = atan2(finalPt.y - center.y, finalPt.x - center.x)
                            previewGeometry = SketchArc(center, r, sA, eA, isPointClockwise(sA, mA, eA))
                        }
                    }
                }
                else -> { previewGeometry = null }
            }
        } else { previewGeometry = null }
        triggerUpdate()
    }

    private fun commitEntity(entity: SketchEntity) {
        val sketch = currentActiveSketch ?: return
        if (entity is SketchRect) {
            val p1 = entity.p1; val p2 = entity.p2
            val c2 = Vec2(p2.x, p1.y); val c4 = Vec2(p1.x, p2.y)
            commandManager.execute(AddGeometryCommand(sketch, SketchLine(p1, c2)))
            commandManager.execute(AddGeometryCommand(sketch, SketchLine(c2, p2)))
            commandManager.execute(AddGeometryCommand(sketch, SketchLine(p2, c4)))
            commandManager.execute(AddGeometryCommand(sketch, SketchLine(c4, p1)))
        } else { commandManager.execute(AddGeometryCommand(sketch, entity)) }
        lastCommitInfo = "${entity.type} COUNT: ${sketch.getGeometries().size}"; triggerUpdate()
    }

    fun resetActiveToolInteraction() {
        previewGeometry = null; rawSketchPoints.clear(); currentSnap = null; startSnap = null; interactionState = InteractionState.IDLE; triggerUpdate()
    }

    // CAMERA UTILS
    fun alignCameraToPlane(plane: SketchPlane) {
        val n = plane.normal; cameraPitch = asin(n.y).toFloat(); cameraYaw = atan2(n.x, n.z).toFloat(); triggerUpdate()
    }
    fun goHome() { cameraPitch = 0.5f; cameraYaw = -0.5f; panX = 0f; panY = 0f; zoom = 1.5f; triggerUpdate() }
    fun fitAll() { goHome() }
    fun getSelectedEntityCenter(): Point3? = null
    fun setFrontView() { cameraPitch = 0f; cameraYaw = 0f; triggerUpdate() }
    fun setBackView() { cameraPitch = 0f; cameraYaw = PI.toFloat(); triggerUpdate() }
    fun setTopView() { cameraPitch = PI.toFloat()/2f; cameraYaw = 0f; triggerUpdate() }
    fun setBottomView() { cameraPitch = -PI.toFloat()/2f; cameraYaw = 0f; triggerUpdate() }
    fun setLeftView() { cameraPitch = 0f; cameraYaw = -PI.toFloat()/2f; triggerUpdate() }
    fun setRightView() { cameraPitch = 0f; cameraYaw = PI.toFloat()/2f; triggerUpdate() }
    fun setIsometricView() { cameraPitch = 0.6f; cameraYaw = -0.6f; triggerUpdate() }

    // SKETCH SESSION
    fun startSketchFlow() { showPlaneSelector = true }
    fun enterSketchMode(plane: String) {
        selectedSketchPlane = plane
        val planeObj = when(plane) { "XY" -> SketchPlane.XY; "XZ" -> SketchPlane.XZ; "YZ" -> SketchPlane.YZ; else -> SketchPlane.XY }
        activeSketchPlane = planeObj; isSketchMode = true; showPlaneSelector = false; activeSketchTool = SketchTool.SELECT
        val newSketch = SketchFeature("Sketch ${document.sketches.size + 1}", planeObj)
        document.sketches.add(newSketch); activeSketchId = newSketch.id
        alignCameraToPlane(planeObj); resetActiveToolInteraction(); triggerUpdate()
    }
    fun exitSketchMode(commit: Boolean) { 
        isSketchMode = false; activeSketchTool = SketchTool.NONE; activeSketchId = null; resetActiveToolInteraction(); triggerUpdate() 
    }

    fun runCommand(id: String, ctx: Context) {
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
    fun triggerUpdate() { updateTrigger++ }
    fun onUndo() { commandManager.undo(); triggerUpdate() }
    fun onRedo() { commandManager.redo(); triggerUpdate() }

    private fun isPointClockwise(start: Double, mid: Double, end: Double): Boolean {
        fun norm(a: Double) = (a % (2 * PI) + (2 * PI)) % (2 * PI)
        val s = norm(start); val m = norm(mid); val e = norm(end)
        return if (s < e) { m < s || m > e } else { m > e && m < s }
    }
}
