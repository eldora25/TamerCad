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
import com.tamercad.core.geometry.Solid3D
import com.tamercad.core.geometry.Face3D
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

import com.tamercad.core.math.Vector3
import com.tamercad.ui.viewport.Manipulator3D
import com.tamercad.ui.selection.SelectionManager

class CADViewModel : ViewModel() {
    // UI State
    var activeCategory by mutableStateOf(ToolbarCategory.INSPECT)
    
    val selectionManager = SelectionManager()
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
    var saveStatus by mutableStateOf("Saved") // "Saved", "Saving...", "Unsaved changes"
    
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
    var selectionPoint by mutableStateOf<Offset?>(null)
    var dragHandle by mutableIntStateOf(-1)
    var rawStroke by mutableStateOf<List<Point3>>(emptyList())
    var currentSnapType by mutableStateOf(SnapType.NONE)
    var dynamicExtrudeHeight by mutableFloatStateOf(0f)
    var activeManipulatorAxis by mutableStateOf<String?>(null)

    /**
     * 3D Nesne Seçimi (Ray-Casting)
     * Ekranda dokunulan noktadan 3D dünyaya bir ışın (Ray) gönderir ve kesişen en yakın nesneyi döner.
     */
    fun pick3DEntity(screenX: Float, screenY: Float, screenWidth: Float, screenHeight: Float): IGeometry? {
        val tapPos = Offset(screenX, screenY)
        
        // 1. Sketch Geometrileri (En öncelikli)
        val worldTap = screenToWorld(screenX, screenY, screenWidth, screenHeight)
        val sketchHit = activeSketch.pickGeometry(worldTap, 20.0 / zoom)
        if (sketchHit != null) return sketchHit

        // 2. Katı Model Geometrileri (Edge ve Face tespiti)
        var closestSolid: Solid3D? = null
        var closestFace: Face3D? = null
        var closestEdge: Line? = null
        var minDepth = Double.MAX_VALUE
        var minEdgeDist = 25.0 // Piksel bazlı tolerans

        mainAssembly.components.forEach { comp ->
            if (!comp.isVisible) return@forEach
            
            comp.features.forEach { feature ->
                val solid = (feature as? ExtrudeFeature)?.generatedGeometry ?: (feature as? RevolveFeature)?.generatedGeometry
                
                // KENAR (Edge) Tespiti
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

                // YÜZEY (Face) Tespiti
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
        
        // --- SELECTION DRILL-DOWN (Hiyerarşik Seçim) ---
        val currentSelection = selectionManager.firstOrNull()
        
        // Önce Kenar hassasiyeti (Eğer çok yakınsa kenarı seç)
        if (closestEdge != null && minEdgeDist < 15.0) {
            return closestEdge
        }

        if (closestSolid != null) {
            if (currentSelection == closestSolid && closestFace != null) {
                return closestFace
            }
            return closestSolid
        }
        
        return null
    }

    private fun distancePointToSegment(p: Offset, s1: Offset, s2: Offset): Float {
        val dx = s2.x - s1.x
        val dy = s2.y - s1.y
        val l2 = dx * dx + dy * dy
        if (l2 == 0f) return sqrt((p.x - s1.x).pow(2) + (p.y - s1.y).pow(2))
        var t = ((p.x - s1.x) * dx + (p.y - s1.y) * dy) / l2
        t = max(0f, min(1f, t))
        return sqrt((p.x - (s1.x + t * dx)).pow(2) + (p.y - (s1.y + t * dy)).pow(2))
    }

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
        if (saveStatus == "Saved") saveStatus = "Unsaved changes"
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
        val currentSelected = selectionManager.firstOrNull()
        if (currentSelected != null) {
            var isBubbleClicked = false
            when (val geom = currentSelected) {
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

        if (currentMode == CadMode.SMART_SKETCH || currentMode == CadMode.NAVIGATE) {
            val clickedGeom = pick3DEntity(offset.x, offset.y, screenWidth, screenHeight)
            activeSketch.clearSelection()
            if (clickedGeom != null) {
                selectionManager.select(clickedGeom)
                selectionPoint = offset
            } else {
                selectionManager.clear()
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
        // 0. Manipülatör Hiti Kontrolü
        val axis = Manipulator3D.hitTest(offset, this, screenWidth, screenHeight)
        if (axis != null) {
            activeManipulatorAxis = axis
            return
        }

        val rawPoint = screenToWorld(offset.x, offset.y, screenWidth, screenHeight)
        if (currentMode == CadMode.SMART_SKETCH && isPointInsideActiveSketch(rawPoint, screenWidth, screenHeight)) {
            currentMode = CadMode.EXTRUDE; dynamicExtrudeHeight = 0f
        } else if (currentMode == CadMode.TRIM || currentMode == CadMode.SKETCH_RECT_DIAG || currentMode == CadMode.SKETCH_POLYGON || currentMode == CadMode.SKETCH_SPLINE_FIT) {
            rawStroke = listOf(rawPoint)
        } else if (currentMode == CadMode.SMART_SKETCH) {
            var handled = false
            val geom = selectionManager.firstOrNull()
            if (geom is Line) {
                val dStart = sqrt((rawPoint.x - geom.startPoint.x).pow(2) + (rawPoint.y - geom.startPoint.y).pow(2))
                val dEnd = sqrt((rawPoint.x - geom.endPoint.x).pow(2) + (rawPoint.y - geom.endPoint.y).pow(2))
                if (dStart < 30.0 / zoom) { dragHandle = 0; handled = true }
                else if (dEnd < 30.0 / zoom) { dragHandle = 1; handled = true }
            }
            if (!handled) { rawStroke = listOf(rawPoint); dragHandle = -1; selectionManager.clear(); activeSketch.clearSelection() }
        } else if (currentMode == CadMode.EXTRUDE) { dynamicExtrudeHeight = 0f }
    }

    fun onSketchDrag(position: Offset, dragAmount: Offset, screenWidth: Float, screenHeight: Float, context: Context) {
        if (activeManipulatorAxis != null) {
            val delta = dragAmount.y * -0.5 / zoom
            val selected = selectionManager.firstOrNull()
            
            if (activeManipulatorAxis == "FACE_NORMAL" && selected is Face3D) {
                // Direct Modeling: Yüzeyi normali yönünde çekiştir
                val feat = mainAssembly.components.flatMap { it.features }.find { it.id == selected.parentFeatureId }
                if (feat is ExtrudeFeature) {
                    feat.depth += delta
                    feat.evaluate()
                    triggerUpdate()
                }
                return
            }
            
            if (activeManipulatorAxis == "EDGE_OFFSET" && selected is Line) {
                // Kenar yuvarlatma (Fillet) simülasyonu
                val existingFillet = mainAssembly.components.flatMap { it.features }
                    .filterIsInstance<com.tamercad.core.features.FilletFeature>()
                    .find { it.edgeIds.contains(selected.id) }
                
                if (existingFillet != null) {
                    existingFillet.radius = max(0.0, existingFillet.radius + delta)
                } else {
                    // Yeni bir Fillet özelliği ekle (Basitleştirilmiş: Sadece UI değerini değiştirir)
                    val newFillet = com.tamercad.core.features.FilletFeature(listOf(selected.id), max(0.0, delta))
                    // TODO: Bileşene ekle ve değerlendir
                }
                triggerUpdate()
                return
            }

            // Seçili nesneyi içeren bileşeni bul
            val component = mainAssembly.components.find { comp ->
                comp.features.any { feat ->
                    (feat as? ExtrudeFeature)?.generatedGeometry == selected ||
                    (feat as? RevolveFeature)?.generatedGeometry == selected
                }
            }
            
            component?.let {
                when (activeManipulatorAxis) {
                    "X" -> it.tx += delta
                    "Y" -> it.ty += delta
                    "Z" -> it.tz += delta
                }
                it.updateTransform()
            }
            
            triggerUpdate()
            return
        }

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
                    if (toRemove.contains(selectionManager.firstOrNull())) { selectionManager.clear(); selectionPoint = null }
                }
            }
            triggerUpdate()
        } else if (currentMode == CadMode.SMART_SKETCH) {
            val pt = screenToWorld(position.x, position.y, screenWidth, screenHeight)
            if (pencilDetector.checkDwellCondition()) {
                val straightened = PredictiveSketchEngine.straighten(rawStroke.first(), pt)
                rawStroke = listOf(rawStroke.first(), straightened.endPoint)
            } else {
                val geom = selectionManager.firstOrNull()
                if (dragHandle in 0..1 && geom is Line) {
                    val allGeoms = activeSketch.getGeometries().toMutableList()
                    allGeoms.remove(geom)
                    var newStart = geom.startPoint; var newEnd = geom.endPoint
                    if (dragHandle == 0) newStart = pt
                    if (dragHandle == 1) newEnd = pt
                    val newLine = Line(newStart, newEnd); allGeoms.add(newLine); activeSketch.clearWorkspace()
                    allGeoms.forEach { activeSketch.addGeometry(it) }; selectionManager.select(newLine)
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
        activeManipulatorAxis = null
        when (currentMode) {
            CadMode.TRIM -> { rawStroke = emptyList(); currentMode = CadMode.SMART_SKETCH; triggerUpdate() }
            CadMode.SMART_SKETCH -> {
                if (dragHandle == -1 && rawStroke.size > 2) {
                    val finalizedStroke = if (pencilDetector.checkDwellCondition()) {
                        val straightened = PredictiveSketchEngine.straighten(rawStroke.first(), rawStroke.last())
                        listOf(straightened.startPoint, straightened.endPoint)
                    } else rawStroke
                    
                    val predictedShapes = PredictiveSketchEngine.recognize(finalizedStroke, zoom)
                    predictedShapes.forEach { shape -> 
                        commandManager.execute(AddGeometryCommand(activeSketch, shape))
                        
                        // Otomatik Kısıtlama Ekleme (Smart Inference)
                        if (shape is Line) {
                            // H/V Inference
                            val dx = abs(shape.endPoint.x - shape.startPoint.x)
                            val dy = abs(shape.endPoint.y - shape.startPoint.y)
                            if (dy < 5.0 / zoom) {
                                commandManager.execute(com.tamercad.core.commands.AddConstraintCommand(activeSketch, gcsManager, com.tamercad.core.constraints.HorizontalConstraint(shape)))
                            } else if (dx < 5.0 / zoom) {
                                commandManager.execute(com.tamercad.core.commands.AddConstraintCommand(activeSketch, gcsManager, com.tamercad.core.constraints.VerticalConstraint(shape)))
                            }
                            
                            // Coincident Inference (Snapping to endpoints)
                            if (currentSnapType == SnapType.ENDPOINT) {
                                // Bulunan en yakın noktayı kısıtla (Basitleştirilmiş: Sadece mantık iskeleti)
                            }
                        }
                    }
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
        val geom = selectionManager.firstOrNull()
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

    fun getSelectedEntityCenter(): Point3? {
        val selected = selectionManager.firstOrNull() ?: return null
        return when (selected) {
            is Line -> Point3((selected.startPoint.x + selected.endPoint.x) / 2.0, (selected.startPoint.y + selected.endPoint.y) / 2.0, 0.0)
            is Circle3D -> selected.center
            is Solid3D -> {
                // Katının merkezini yaklaşık olarak bul
                val allVerts = selected.faces.flatMap { it.vertices }
                if (allVerts.isEmpty()) return Point3(0.0, 0.0, 0.0)
                Point3(allVerts.map { it.x }.average(), allVerts.map { it.y }.average(), allVerts.map { it.z }.average())
            }
            else -> null
        }
    }

    fun renameComponent() {
        showRenameDialog?.let { it.name = renameInput; showRenameDialog = null; triggerUpdate() }
    }
}
