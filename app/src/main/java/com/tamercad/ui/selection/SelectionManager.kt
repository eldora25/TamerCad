package com.tamercad.ui.selection

import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.tamercad.core.geometry.IGeometry
import com.tamercad.ui.contextual.SelectionType

/**
 * TamerCAD Merkezi Seçim Yöneticisi.
 * Nesnelerin seçim durumlarını, filtrelerini ve çoklu seçim mantığını yönetir.
 */
class SelectionManager {

    // Seçili nesnelerin listesi (Gözlemlenebilir)
    val selectedEntities = mutableStateListOf<IGeometry>()

    // Seçim Filtreleri
    var isVertexSelectionEnabled by mutableStateOf(true)
    var isEdgeSelectionEnabled by mutableStateOf(true)
    var isFaceSelectionEnabled by mutableStateOf(true)
    var isBodySelectionEnabled by mutableStateOf(true)

    /**
     * Tekil seçim yapar. Mevcut seçimi temizler.
     */
    fun select(entity: IGeometry) {
        clear()
        entity.isSelected = true
        selectedEntities.add(entity)
    }

    /**
     * Çoklu seçim için listeye ekler veya listeden çıkarır.
     */
    fun toggle(entity: IGeometry) {
        if (selectedEntities.contains(entity)) {
            deselect(entity)
        } else {
            entity.isSelected = true
            selectedEntities.add(entity)
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
    }

    /**
     * Mevcut seçimin tipini belirler (ContextToolbar için).
     */
    fun getSelectionType(): SelectionType {
        if (selectedEntities.isEmpty()) return SelectionType.NONE
        if (selectedEntities.size > 1) return SelectionType.MULTIPLE

        return when (selectedEntities.first().type) {
            "Vertex" -> SelectionType.VERTEX
            "Line" -> SelectionType.EDGE
            "Face3D" -> SelectionType.FACE
            "Solid3D" -> SelectionType.BODY
            "Circle3D", "Arc3D" -> SelectionType.SKETCH
            else -> SelectionType.NONE
        }
    }
    
    fun isEmpty() = selectedEntities.isEmpty()
    
    fun firstOrNull() = selectedEntities.firstOrNull()
}
