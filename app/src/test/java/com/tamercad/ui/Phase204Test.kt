package com.tamercad.ui

import androidx.compose.ui.geometry.Offset
import com.tamercad.ui.sketch.SketchTool
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.PI

class Phase204Test {

    @Test
    fun testSecondLineAppends() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.LINE
        val w = 1000f
        val h = 1000f
        
        // Line 1
        viewModel.onSketchDragStart(Offset(100f, 100f), w, h, null)
        viewModel.onSketchDrag(Offset(200f, 200f), Offset(100f, 100f), w, h, null)
        viewModel.onSketchDragEnd(null)
        
        // Line 2
        viewModel.onSketchDragStart(Offset(300f, 300f), w, h, null)
        viewModel.onSketchDrag(Offset(400f, 400f), Offset(100f, 100f), w, h, null)
        viewModel.onSketchDragEnd(null)
        
        val entities = viewModel.currentActiveSketch!!.getGeometries()
        assertEquals(2, entities.size)
    }

    @Test
    fun testArcInteractionStages() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.ARC
        val w = 1000f
        val h = 1000f
        
        // Stage 1: P1 to P2
        viewModel.onSketchDragStart(Offset(100f, 100f), w, h, null)
        viewModel.onSketchDrag(Offset(200f, 100f), Offset(100f, 0f), w, h, null)
        viewModel.onSketchDragEnd(null)
        
        assertEquals(2, viewModel.rawSketchPoints.size) // Points saved for Stage 2
        assertEquals(0, viewModel.currentActiveSketch!!.getGeometries().size)
        
        // Stage 2: P3
        viewModel.onSketchDragStart(Offset(150f, 150f), w, h, null)
        viewModel.onSketchDrag(Offset(150f, 150f), Offset(0f, 0f), w, h, null)
        viewModel.onSketchDragEnd(null)
        
        val active = viewModel.currentActiveSketch!!
        assertEquals(1, active.getGeometries().size)
        assertTrue(active.getGeometries()[0] is com.tamercad.core.sketch.SketchArc)
        assertEquals(0, viewModel.rawSketchPoints.size) // Reset after commit
    }
}
