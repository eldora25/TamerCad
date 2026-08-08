package com.tamercad.ui

import android.content.Context
import android.widget.Toast
import androidx.compose.runtime.*
import androidx.compose.ui.geometry.Offset
import androidx.lifecycle.ViewModel
import com.tamercad.core.assembly.Assembly3D
import com.tamercad.core.assembly.Component3D
import com.tamercad.core.features.ExtrudeFeature
import com.tamercad.core.features.RevolveFeature
import com.tamercad.core.geometry.IGeometry
import com.tamercad.core.geometry.Line
import com.tamercad.core.geometry.Circle3D
import com.tamercad.core.math.Point3
import com.tamercad.core.sketch.PredictiveSketchEngine
import com.tamercad.core.sketch.SketchFeature
import com.tamercad.core.sketch.SnapEngine
import com.tamercad.core.sketch.SnapType
import com.tamercad.core.commands.CommandManager
import com.tamercad.core.commands.AddGeometryCommand
import com.tamercad.core.commands.AddComponentCommand
import com.tamercad.core.constraints.GCSManager
import com.tamercad.core.constraints.LengthConstraint
import com.tamercad.ui.components.PencilGestureDetector
import com.tamercad.ui.components.isPointInPolygon
import java.util.*
import kotlin.math.*

import com.tamercad.ui.toolbar.ToolbarCategory
import com.tamercad.ui.contextual.SelectionType
import com.tamercad.ui.interaction.StylusInputManager
import com.tamercad.ui.interaction.StylusEvent
import androidx.compose.ui.input.pointer.PointerType

class CADViewModel : ViewModel() {
    // UI State
    var activeCategory by mutableStateOf(ToolbarCategory.INSPECT) // Browser başlangıçta açık
    var selectionType by mutableStateOf(SelectionType.NONE)

    val stylusInputManager = StylusInputManager()
    var isStylusInUse by mutableStateOf(false)
    // Camera & Viewport State
    var cameraPitch by mutableFloatStateOf(0.5f)
    var cameraYaw by mutableFloatStateOf(-0.5f)
    var panX by mutableFloatStateOf(0f)
    var panY by mutableFloatStateOf(0f)
    var zoom by mutableFloatStateOf(1.5f)

    // Mode & UI State
    var currentMode by mutableStateOf(CadMode.NAVIGATE)
    val sidebarState = SidebarState()
    var browserOffset by mutableStateOf(Offset(250f, 100f)) // Toolbar'dan iyice uzaklaştırıldı (Pixel cinsinden)
    
    // Dialog States
    var showRenameDialog by mutableStateOf<Component3D?>(null)
    var renameInput by mutableStateOf("")
    var showInfoDialog by mutableStateOf(false)
    var showDimDialog by mutableStateOf(false)
    var dimInput by mutableStateOf("")
    
    // Core Design State
    val activeSketch = SketchFeature("Active Sketch")
    val mainAssembly = Assembly3D("Untitled_Design")
    var updateTrigger by mutableIntStateOf(0)

    // Selection & Gesture State
    var selectedGeometry by mutableStateOf<IGeometry?>(null)
    var selectionPoint by mutableStateOf<Offset?>(null)
    var dragHandle by mutableIntStateOf(-1)
    var rawStroke by mutableStateOf<List<Point3>>(emptyList())
    var currentSnapType by mutableStateOf(SnapType.NONE)
    var dynamicExtrudeHeight by mutableFloatStateOf(0f)

    // Materials
    val componentMaterials = mutableStateMapOf<Component3D, RenderMaterial>()
    var draggedMaterial by mutableStateOf<RenderMaterial?>(null)
    var dragOffset by mutableStateOf(Offset.Zero)

    val pencilDetector = PencilGestureDetector()
    val commandManager = CommandManager()
    val gcsManager = GCSManager()

    // MATH HELPERS (KALİBRASYON DÜZELTİLDİ)
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
        return Offset(
            (proj.x * zoom).toFloat() + panX + centerX,
            (centerY + panY) - (proj.y * zoom).toFloat()
        )
    }

    fun screenToWorld(x: Float, y: Float, screenWidth: Float, screenHeight: Float): Point3 {
        val centerX = screenWidth / 2f
        val centerY = screenHeight / 2f
        val worldX = (x - centerX - panX) / zoom
        val worldY = (centerY + panY - y) / zoom
        return Point3(worldX.toDouble(), worldY.toDouble(), 0.0)
    }

    fun isPointInsideActiveSketch(pt: Point3, screenWidth: Float, screenHeight: Float): Boolean {
        val geometries = activeSketch.getGeometries().filterIsInstance<Line>()
        if (geometries.isEmpty()) return false
        val screenVerts = geometries.map { worldToScreen(it.startPoint, screenWidth, screenHeight) }
        return isPointInPolygon(worldToScreen(pt, screenWidth, screenHeight), screenVerts)
    }

    fun performMaterialHitTest(dropPoint: Offset, droppedMat: RenderMaterial, screenWidth: Float, screenHeight: Float, context: Context) {
        var hitComp: Component3D? = null
        var highestZ = -Double.MAX_VALUE
        mainAssembly.components.forEach { comp ->
            if (!comp.isVisible) return@forEach
            comp.features.forEach { feature ->
                val solid = (feature as? ExtrudeFeature)?.generatedGeometry ?: (feature as? RevolveFeature)?.generatedGeometry
                solid?.faces?.forEach { face ->
                    val tVertices = face.vertices.map { project3DTo2D(it.transform(comp.transform)) }
                    val avgZ = tVertices.sumOf { it.z } / tVertices.size
                    val screenVerts = tVertices.map { p -> worldToScreen(p, screenWidth, screenHeight) }
                    if (isPointInPolygon(dropPoint, screenVerts)) {
                        if (avgZ > highestZ) { highestZ = avgZ; hitComp = comp }
                    }
                }
            }
        }
        if (hitComp != null) {
            componentMaterials[hitComp!!] = droppedMat
            triggerUpdate()
            Toast.makeText(context, "${droppedMat.name} uygulandı: ${hitComp!!.name}", Toast.LENGTH_SHORT).show()
        }
    }

    fun triggerUpdate() {
        updateTrigger++
    }

    fun onUndo() {
        commandManager.undo()
        triggerUpdate()
    }

    fun onRedo() {
        commandManager.redo()
        triggerUpdate()
    }

    // GESTURE HANDLERS
    fun onTap(offset: Offset, screenWidth: Float, screenHeight: Float) {
        val pt = screenToWorld(offset.x, offset.y, screenWidth, screenHeight)
        
        // Ölçü Balonuna Tıklama Kontrolü
        if (selectedGeometry != null) {
            var isBubbleClicked = false
            when (val geom = selectedGeometry) {
                is Line -> {
                    val midPt = Point3((geom.startPoint.x + geom.endPoint.x) / 2, (geom.startPoint.y + geom.endPoint.y) / 2, 0.0)
                    val midScreen = worldToScreen(midPt, screenWidth, screenHeight)
                    if (sqrt((offset.x - midScreen.x).pow(2) + (offset.y - (midScreen.y - 30f)).pow(2)) < 60f) {
                        dimInput = String.format(Locale.US, "%.1f", geom.length())
                        showDimDialog = true; isBubbleClicked = true
                    }
                }
                is Circle3D -> {
                    // Dairenin yarıçap balonunu merkezden 45 derece açıyla gösterelim
                    val angle = PI / 4
                    val edgePt = Point3(geom.center.x + geom.radius * cos(angle), geom.center.y + geom.radius * sin(angle), 0.0)
                    val edgeScreen = worldToScreen(edgePt, screenWidth, screenHeight)
                    if (sqrt((offset.x - edgeScreen.x).pow(2) + (offset.y - edgeScreen.y).pow(2)) < 60f) {
                        dimInput = String.format(Locale.US, "%.1f", geom.radius)
                        showDimDialog = true; isBubbleClicked = true
                    }
                }
            }
            if (isBubbleClicked) return
        }

        if (currentMode == CadMode.SMART_SKETCH) {
            val clickedGeom = activeSketch.pickGeometry(pt, 20.0 / zoom)
            activeSketch.clearSelection()
            if (clickedGeom != null) {
                selectedGeometry = clickedGeom
                clickedGeom.isSelected = true
                selectionPoint = offset
            } else {
                selectedGeometry = null
                selectionPoint = null
            }
            triggerUpdate()
        }
    }

    fun onLongPress(context: Context) {
        if (activeSketch.getGeometries().isNotEmpty() && currentMode == CadMode.SMART_SKETCH) {
            currentMode = CadMode.EXTRUDE; dynamicExtrudeHeight = 0f
            Toast.makeText(context, "Katılamaya Hazır! Yukarı Çekin.", Toast.LENGTH_SHORT).show()
        }
    }

    fun onSketchDragStart(offset: Offset, screenWidth: Float, screenHeight: Float, context: Context) {
        val rawPoint = screenToWorld(offset.x, offset.y, screenWidth, screenHeight)
        if (currentMode == CadMode.SMART_SKETCH && isPointInsideActiveSketch(rawPoint, screenWidth, screenHeight)) {
            currentMode = CadMode.EXTRUDE; dynamicExtrudeHeight = 0f
        } else if (currentMode == CadMode.TRIM || currentMode == CadMode.SKETCH_RECT_DIAG || currentMode == CadMode.SKETCH_POLYGON || currentMode == CadMode.SKETCH_SPLINE_FIT) {
            rawStroke = listOf(rawPoint)
        } else if (currentMode == CadMode.SMART_SKETCH) {
            var handled = false
            val geom = selectedGeometry
            if (geom is Line) {
                val dStart = sqrt((rawPoint.x - geom.startPoint.x).pow(2) + (rawPoint.y - geom.startPoint.y).pow(2))
                val dEnd = sqrt((rawPoint.x - geom.endPoint.x).pow(2) + (rawPoint.y - geom.endPoint.y).pow(2))
                if (dStart < 30.0 / zoom) { dragHandle = 0; handled = true }
                else if (dEnd < 30.0 / zoom) { dragHandle = 1; handled = true }
            }
            if (!handled) { rawStroke = listOf(rawPoint); dragHandle = -1; selectedGeometry = null; activeSketch.clearSelection() }
        } else if (currentMode == CadMode.EXTRUDE) { dynamicExtrudeHeight = 0f }
    }

    fun onSketchDrag(position: Offset, dragAmount: Offset, screenWidth: Float, screenHeight: Float, context: Context) {
        if (currentMode == CadMode.NAVIGATE) {
            cameraYaw += dragAmount.x * 0.005f; cameraPitch -= dragAmount.y * 0.005f; triggerUpdate()
        } else if (currentMode == CadMode.TRIM || currentMode == CadMode.SMART_SKETCH || currentMode == CadMode.SKETCH_RECT_DIAG || currentMode == CadMode.SKETCH_POLYGON || currentMode == CadMode.SKETCH_SPLINE_FIT) {
            val pt = screenToWorld(position.x, position.y, screenWidth, screenHeight)
            rawStroke = rawStroke + pt
            if (currentMode == CadMode.SMART_SKETCH && rawStroke.size > 8) {
                val lastPoints = rawStroke.takeLast(6)
                var directionSwitches = 0
                for (i in 0 until lastPoints.size - 2) {
                    val v1 = lastPoints[i+1].x - lastPoints[i].x
                    val v2 = lastPoints[i+2].x - lastPoints[i+1].x
                    if (v1 * v2 < 0) directionSwitches++
                }
                if (directionSwitches >= 3) { currentMode = CadMode.TRIM; Toast.makeText(context, "Budama Modu Aktif", Toast.LENGTH_SHORT).show() }
            }
            if (currentMode == CadMode.TRIM) {
                val geoms = activeSketch.getGeometries().filterIsInstance<Line>().toMutableList()
                val toRemove = geoms.filter { line -> line.distanceToPoint(pt) < 15.0 / zoom }
                if (toRemove.isNotEmpty()) {
                    geoms.removeAll(toRemove); activeSketch.clearWorkspace()
                    geoms.forEach { activeSketch.addGeometry(it) }
                    if (toRemove.contains(selectedGeometry)) { selectedGeometry = null; selectionPoint = null }
                }
            }
            triggerUpdate()
        } else if (currentMode == CadMode.SMART_SKETCH) {
            val pt = screenToWorld(position.x, position.y, screenWidth, screenHeight)
            if (pencilDetector.checkDwellCondition()) {
                val straightened = PredictiveSketchEngine.straighten(rawStroke.first(), pt)
                rawStroke = listOf(rawStroke.first(), straightened.endPoint)
            } else {
                val geom = selectedGeometry
                if (dragHandle in 0..1 && geom is Line) {
                    val allGeoms = activeSketch.getGeometries().toMutableList()
                    allGeoms.remove(geom)
                    var newStart = geom.startPoint; var newEnd = geom.endPoint
                    if (dragHandle == 0) newStart = pt
                    if (dragHandle == 1) newEnd = pt
                    val newLine = Line(newStart, newEnd); allGeoms.add(newLine); activeSketch.clearWorkspace()
                    allGeoms.forEach { activeSketch.addGeometry(it) }; selectedGeometry = newLine; newLine.isSelected = true
                } else {
                    val snap = SnapEngine.snapPoint(pt, rawStroke.firstOrNull(), activeSketch.getGeometries().filterIsInstance<Line>(), zoom)
                    currentSnapType = snap.type; rawStroke = rawStroke + snap.point
                }
            }
            triggerUpdate()
        } else if (currentMode == CadMode.EXTRUDE) {
            dynamicExtrudeHeight -= dragAmount.y * 0.5f; triggerUpdate()
        }
    }

    fun onSketchDragEnd(context: Context) {
        when (currentMode) {
            CadMode.TRIM -> { rawStroke = emptyList(); currentMode = CadMode.SMART_SKETCH; triggerUpdate() }
            CadMode.SMART_SKETCH -> {
                if (dragHandle == -1 && rawStroke.size > 2) {
                    val finalizedStroke = if (pencilDetector.checkDwellCondition()) {
                        val straightened = PredictiveSketchEngine.straighten(rawStroke.first(), rawStroke.last())
                        listOf(straightened.startPoint, straightened.endPoint)
                    } else rawStroke
                    val predictedShapes = PredictiveSketchEngine.recognize(finalizedStroke, zoom)
                    predictedShapes.forEach { shape -> commandManager.execute(AddGeometryCommand(activeSketch, shape)) }
                    rawStroke = emptyList()
                }
                dragHandle = -1; triggerUpdate()
            }
            CadMode.EXTRUDE -> {
                if (activeSketch.getGeometries().isNotEmpty() && abs(dynamicExtrudeHeight) > 5f) {
                    val extrude = ExtrudeFeature(activeSketch, dynamicExtrudeHeight.toDouble(), "Extrude ${mainAssembly.components.size}")
                    val newComp = Component3D("Gövde ${mainAssembly.components.size + 1}").apply { features.add(extrude) }
                    commandManager.execute(AddComponentCommand(mainAssembly, newComp))
                    activeSketch.clearWorkspace(); dynamicExtrudeHeight = 0f; currentMode = CadMode.SMART_SKETCH
                    Toast.makeText(context, "3D Gövde Oluşturuldu!", Toast.LENGTH_SHORT).show()
                }
                triggerUpdate()
            }
            else -> { rawStroke = emptyList(); dragHandle = -1; triggerUpdate() }
        }
        pencilDetector.clearHistory(); currentSnapType = SnapType.NONE
    }

    fun applyDimension(newVal: Double) {
        val geom = selectedGeometry
        if (geom != null && newVal > 0) {
            when (geom) {
                is Line -> {
                    gcsManager.addConstraint(LengthConstraint(geom, newVal))
                    geom.isFullyDefined = true // Ölçü girilince tam tanımlı kabul et (basitleştirilmiş)
                }
                is Circle3D -> {
                    geom.radius = newVal
                    geom.isFullyDefined = true
                }
            }
            triggerUpdate()
        }
        showDimDialog = false
    }

    fun renameComponent() {
        showRenameDialog?.let { it.name = renameInput; showRenameDialog = null; triggerUpdate() }
    }
}
