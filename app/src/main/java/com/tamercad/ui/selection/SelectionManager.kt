package com.tamercad.ui.selection

import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.tamercad.core.geometry.IGeometry
import com.tamercad.ui.contextual.SelectionType

enum class SelectionMode { SINGLE, MULTI }

/**
 * TamerCAD Merkezi Seçim Yöneticisi.
 * Nesnelerin seçim durumlarını, filtrelerini ve çoklu seçim mantığını yönetir.
 */
class SelectionManager {

    // Seçili nesnelerin listesi (Gözlemlenebilir)
    val selectedEntities = mutableStateListOf<IGeometry>()
    
    // Seçim Modu (Single / Multi)
    var selectionMode by mutableStateOf(SelectionMode.SINGLE)

    // Authoritative Selection State
    var selectedEntityId by mutableStateOf<String?>(null)
    var selectedSketchId by mutableStateOf<String?>(null)

    // Hover durumundaki nesne
    var hoveredEntity by mutableStateOf<IGeometry?>(null)
    var hitDistance by mutableDoubleStateOf(0.0)

    // Seçim Modu
    var isMultiSelectMode by mutableStateOf(false)

    // Seçim Filtreleri (TamerCAD Standartları)
    var showVertices by mutableStateOf(true)
    var showEdges by mutableStateOf(true)
    var showFaces by mutableStateOf(true)
    var showBodies by mutableStateOf(true)
    var showSketches by mutableStateOf(true)

    /**
     * Tekil seçim yapar.
     */
    fun selectSingle(entity: IGeometry, sketchId: String?) {
        clear()
        entity.isSelected = true
        selectedEntities.add(entity)
        selectedEntityId = entity.id
        selectedSketchId = sketchId
    }

    /**
     * Çoklu seçim için listeye ekler veya listeden çıkarır.
     * Sadece aynı skeç içindeki nesnelere izin verir.
     */
    fun toggleInSketch(entity: IGeometry, sketchId: String?) {
        // Absolute Cross-Sketch Rule: Different sketch clears previous group
        if (selectedSketchId != null && sketchId != null && selectedSketchId != sketchId) {
            selectSingle(entity, sketchId)
            return
        }

        if (selectedEntities.contains(entity)) {
            deselect(entity)
            if (selectedEntities.isEmpty()) {
                selectedSketchId = null
                selectedEntityId = null
            }
        } else {
            entity.isSelected = true
            selectedEntities.add(entity)
            selectedEntityId = entity.id 
            selectedSketchId = sketchId
        }
    }

    /**
     * Belirli bir nesneyi seçimden çıkarır.
     */
    fun deselect(entity: IGeometry) {
        entity.isSelected = false
        selectedEntities.remove(entity)
    }

    /**
     * Tüm seçimi temizler.
     */
    fun clear() {
        selectedEntities.forEach { it.isSelected = false }
        selectedEntities.clear()
        selectedEntityId = null
        selectedSketchId = null
    }

    /**
     * Mevcut seçimin tipini belirler (ContextToolbar için).
     */
    fun getSelectionType(): SelectionType {
        if (selectedEntities.isEmpty()) return SelectionType.NONE
        if (selectedEntities.size > 1) return SelectionType.MULTIPLE

        val first = selectedEntities.first()
        return when (first.type) {
            "Vertex" -> SelectionType.VERTEX
            "Line", "SketchLine" -> SelectionType.EDGE
            "Face3D" -> SelectionType.FACE
            "Solid3D" -> SelectionType.BODY
            "Circle3D", "SketchCircle", "Arc3D", "SketchArc", "SketchRect" -> SelectionType.SKETCH
            "Feature" -> SelectionType.FEATURE
            else -> SelectionType.NONE
        }
    }
    
    fun isEmpty() = selectedEntities.isEmpty()
    
    fun firstOrNull() = selectedEntities.firstOrNull()
}
