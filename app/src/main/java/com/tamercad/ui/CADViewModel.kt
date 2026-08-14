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
import com.tamercad.TamerCadApplication
import java.util.*
import kotlin.math.*

enum class InteractionIntent { PENDING, TAP, DRAG }

data class PickResult(
    val sketchId: String,
    val entity: IGeometry,
    val screenDistance: Float,
    val depth: Double = 0.0
)

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
    
    var objectTreeOffsetDp by mutableStateOf(Offset(0f, 0f))
    var objectTreePinned by mutableStateOf(false)
    var isObjectTreeVisible by mutableStateOf(false)

    // --- DEBUG PROBES FOR PHASE 2.0.8.2.3 ---
    var objectTreeComposed by mutableStateOf(false)
    var objectTreeMeasured by mutableStateOf(false)
    var objectTreeMeasuredWidth by mutableFloatStateOf(0f)
    var objectTreeMeasuredHeight by mutableFloatStateOf(0f)
    var objectTreeItemCount by mutableIntStateOf(0)
    
    var selectionPoint by mutableStateOf<Offset?>(null)
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
            interactionIntent = InteractionIntent.TAP; onPointSelected(pt, w, h)
        } else { onPointSelected(pt, w, h) }
        interactionIntent = InteractionIntent.PENDING
    }

    fun onPointSelected(localPt: Vec2, w: Float, h: Float) {
        val sketch = currentActiveSketch ?: return
        if (activeSketchTool == SketchTool.SELECT) {
            // Document-wide screen-space picking
            // FALLBACK: If stylusDownPos is zero (e.g. in tests calling this directly), 
            // use the projected screen position of localPt.
            val screenPos = if (stylusDownPos == Offset.Zero) {
                sketchToScreen(localPt, w, h)
            } else {
                stylusDownPos
            }
            val pick = findEntityAt(screenPos.x, screenPos.y, w, h)
            
            if (pick != null) {
                if (selectionManager.selectionMode == com.tamercad.ui.selection.SelectionMode.MULTI) {
                    selectionManager.toggleInSketch(pick.entity, pick.sketchId)
                } else {
                    selectionManager.selectSingle(pick.entity, pick.sketchId)
                }
                
                // Active Sketch Selection Policy: owner sketch becomes active
                // CRITICAL: Changing activeSketchId here MUST NOT call alignCameraToPlane
                activeSketchId = pick.sketchId
                selectionManager.hitDistance = pick.screenDistance.toDouble()
            } else {
                selectionManager.clear()
            }
            triggerUpdate()
            return
        }
        if (activeSketchTool == SketchTool.NONE) return
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

    fun deleteSelectedEntity() {
        val selected = selectionManager.selectedEntities.toList()
        if (selected.isEmpty()) return
        
        val sketchId = selectionManager.selectedSketchId ?: return
        val sketch = document.sketches.find { it.id == sketchId } ?: return
        
        selected.forEach { entity ->
            commandManager.execute(RemoveGeometryCommand(sketch, entity))
        }
        
        selectionManager.clear()
        triggerUpdate()
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
        // --- UI CONTEXT POLICY ---
        // Creation tools clear selection to avoid interference
        if (id in listOf("line", "circle", "rect", "arc", "spline")) {
            selectionManager.clear()
        }

        resetActiveToolInteraction()
        when(id) {
            "line" -> activeSketchTool = SketchTool.LINE
            "circle" -> activeSketchTool = SketchTool.CIRCLE
            "rect" -> activeSketchTool = SketchTool.RECTANGLE
            "arc" -> activeSketchTool = SketchTool.ARC
            "select" -> { 
                activeSketchTool = SketchTool.SELECT
                selectionManager.selectionMode = com.tamercad.ui.selection.SelectionMode.SINGLE
            }
            "multi_select" -> {
                activeSketchTool = SketchTool.SELECT
                selectionManager.selectionMode = com.tamercad.ui.selection.SelectionMode.MULTI
            }
            "sketch" -> startSketchFlow()
            "delete" -> deleteSelectedEntity()
            "browser" -> toggleObjectTree()
            "inspect" -> {
                activeCategory = ToolbarCategory.INSPECT
                openObjectTree()
            }
            else -> {}
        }
        triggerUpdate()
    }

    fun openObjectTree() {
        isObjectTreeVisible = true
        saveUiState()
    }

    fun closeObjectTree() {
        isObjectTreeVisible = false
        saveUiState()
    }

    fun toggleObjectTree() {
        isObjectTreeVisible = !isObjectTreeVisible
        saveUiState()
    }

    fun setObjectTreePositionDp(offsetDp: Offset) {
        objectTreeOffsetDp = offsetDp
        // Note: Final clamping occurs during persistence or after measurement
    }

    fun saveObjectTreeDragEnd() {
        saveUiState()
    }

    fun toggleObjectTreePin() {
        objectTreePinned = !objectTreePinned
        saveUiState()
    }

    // Terminology Aliases for compatibility
    fun toggleBrowser() = toggleObjectTree()
    fun openBrowser() = openObjectTree()
    fun closeBrowser() = closeObjectTree()
    fun toggleBrowserPin() = toggleObjectTreePin()

    fun saveUiState() {
        try {
            val prefs = TamerCadApplication.instance.getSharedPreferences("ui_state", Context.MODE_PRIVATE)
            prefs.edit().apply {
                putFloat("browser_x_dp", objectTreeOffsetDp.x)
                putFloat("browser_y_dp", objectTreeOffsetDp.y)
                putBoolean("browser_pinned", objectTreePinned)
                apply()
            }
        } catch (e: Exception) {
            Log.w("CADViewModel", "Failed to save UI state: ${e.message}")
        }
    }

    fun loadUiState(screenWidthDp: Float, screenHeightDp: Float) {
        val defaultX = screenWidthDp - 280f 
        val defaultY = 220f
        
        var x = -1f
        var y = -1f
        
        try {
            val prefs = TamerCadApplication.instance.getSharedPreferences("ui_state", Context.MODE_PRIVATE)
            x = prefs.getFloat("browser_x_dp", -1f)
            y = prefs.getFloat("browser_y_dp", -1f)
            objectTreePinned = prefs.getBoolean("browser_pinned", false)
        } catch (e: Exception) {
            Log.w("CADViewModel", "Failed to load UI state: ${e.message}")
        }
        
        isObjectTreeVisible = false 
        
        if (x < 0f || y < 0f) {
            objectTreeOffsetDp = Offset(defaultX, defaultY)
        } else {
            clampObjectTreePosition(x, y, screenWidthDp, screenHeightDp)
        }
    }

    fun clampObjectTreePosition(xDp: Float, yDp: Float, screenWidthDp: Float, screenHeightDp: Float) {
        val panelWidth = 260f 
        // Ensure header is reachable (at least top 40dp)
        val safeX = xDp.coerceIn(0f, max(0f, screenWidthDp - 40f))
        val safeY = yDp.coerceIn(0f, max(0f, screenHeightDp - 40f))
        
        objectTreeOffsetDp = Offset(safeX, safeY)
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

    private fun findEntityAt(screenX: Float, screenY: Float, w: Float, h: Float): PickResult? {
        val candidates = mutableListOf<PickResult>()
        val tolerancePx = 24f // Tablet/Stylus appropriate tolerance

        document.sketches.forEach { sketch ->
            // Only search visible sketches
            sketch.getGeometries().forEach { geom ->
                val distPx = getScreenDistanceToGeometry(screenX, screenY, geom, sketch.plane, w, h)
                if (distPx != null && distPx <= tolerancePx) {
                    candidates.add(PickResult(sketch.id, geom, distPx))
                }
            }
        }

        // Rank by smallest screen-space distance
        // Deterministic tie-breaker using entity ID
        return candidates.sortedWith(compareBy({ it.screenDistance }, { it.entity.id })).firstOrNull()
    }

    private fun getScreenDistanceToGeometry(sx: Float, sy: Float, geom: IGeometry, plane: SketchPlane, w: Float, h: Float): Float? {
        val mouse = Offset(sx, sy)
        
        return when (geom) {
            is SketchLine -> {
                val p1 = sketchToScreen(geom.start, plane, w, h)
                val p2 = sketchToScreen(geom.end, plane, w, h)
                distanceToSegmentPx(mouse, p1, p2)
            }
            is SketchCircle -> {
                // Approximate circle with points for screen-space accuracy in oblique views
                val segments = 32
                var minDist = Float.MAX_VALUE
                for (i in 0 until segments) {
                    val angle = 2.0 * PI * i / segments
                    val p = geom.center + Vec2(cos(angle) * geom.radius, sin(angle) * geom.radius)
                    val sp = sketchToScreen(p, plane, w, h)
                    val dist = (mouse - sp).getDistance()
                    if (dist < minDist) minDist = dist
                }
                minDist
            }
            is SketchArc -> {
                // Approximate arc
                val segments = 16
                var minDist = Float.MAX_VALUE
                fun norm(a: Double) = (a % (2 * PI) + (2 * PI)) % (2 * PI)
                val s = norm(geom.startAngle); val e = norm(geom.endAngle)
                var sweep = e - s
                if (geom.isClockwise && sweep > 0) sweep -= 2 * PI
                if (!geom.isClockwise && sweep < 0) sweep += 2 * PI
                
                for (i in 0..segments) {
                    val t = s + sweep * i / segments
                    val p = geom.center + Vec2(cos(t) * geom.radius, sin(t) * geom.radius)
                    val sp = sketchToScreen(p, plane, w, h)
                    val dist = (mouse - sp).getDistance()
                    if (dist < minDist) minDist = dist
                }
                minDist
            }
            is SketchRect -> {
                val p1 = sketchToScreen(geom.p1, plane, w, h)
                val p2 = sketchToScreen(Vec2(geom.p2.x, geom.p1.y), plane, w, h)
                val p3 = sketchToScreen(geom.p2, plane, w, h)
                val p4 = sketchToScreen(Vec2(geom.p1.x, geom.p2.y), plane, w, h)
                val d1 = distanceToSegmentPx(mouse, p1, p2)
                val d2 = distanceToSegmentPx(mouse, p2, p3)
                val d3 = distanceToSegmentPx(mouse, p3, p4)
                val d4 = distanceToSegmentPx(mouse, p4, p1)
                min(min(d1, d2), min(d3, d4))
            }
            else -> null
        }
    }

    private fun distanceToSegmentPx(p: Offset, a: Offset, b: Offset): Float {
        val dx = b.x - a.x; val dy = b.y - a.y
        val l2 = dx*dx + dy*dy
        if (l2 == 0f) return (p - a).getDistance()
        var t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2
        t = max(0f, min(1f, t))
        return (p - Offset(a.x + t * dx, a.y + t * dy)).getDistance()
    }
}
