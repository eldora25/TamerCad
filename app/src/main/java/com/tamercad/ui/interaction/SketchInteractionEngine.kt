package com.tamercad.ui.interaction

import androidx.compose.runtime.*
import com.tamercad.core.geometry.IGeometry
import com.tamercad.core.math.Vec2
import com.tamercad.ui.sketch.SketchTool

/**
 * TAMERCAD — AUTHORITATIVE SKETCH INTERACTION ENGINE
 * Manages tool state machines and preview generation.
 */
class SketchInteractionEngine {
    
    var activeTool by mutableStateOf(SketchTool.NONE)
    var interactionState by mutableStateOf(InteractionState.IDLE)
    var previewGeometry by mutableStateOf<IGeometry?>(null)
    
    // Internal state for multi-stage commands
    private val points = mutableStateListOf<Vec2>()
    
    fun onHover(localPt: Vec2) {
        // Future: Update hover diagnostics or snap preview
    }
    
    fun onDown(localPt: Vec2) {
        // Implementation for Tap detection or start of drag
    }
    
    fun onMove(localPt: Vec2) {
        // Implementation for live preview
    }
    
    fun onUp(localPt: Vec2) {
        // Implementation for commit or next stage
    }

    fun reset() {
        points.clear()
        previewGeometry = null
        interactionState = InteractionState.IDLE
    }
}
