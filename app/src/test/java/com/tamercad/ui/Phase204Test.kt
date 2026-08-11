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
        viewModel.onStylusDown(100f, 100f, w, h)
        viewModel.onStylusMove(200f, 200f, w, h)
        viewModel.onStylusUp(200f, 200f, w, h)
        
        // Line 2
        viewModel.onStylusDown(300f, 300f, w, h)
        viewModel.onStylusMove(400f, 400f, w, h)
        viewModel.onStylusUp(400f, 400f, w, h)
        
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
        
        // Stage 1: P1
        viewModel.onStylusDown(100f, 100f, w, h)
        viewModel.onStylusUp(100f, 100f, w, h)
        assertEquals(1, viewModel.rawSketchPoints.size) 
        
        // Stage 2: P2
        viewModel.onStylusDown(200f, 100f, w, h)
        viewModel.onStylusUp(200f, 100f, w, h)
        assertEquals(2, viewModel.rawSketchPoints.size) 
        
        // Stage 3: P3
        viewModel.onStylusDown(150f, 150f, w, h)
        viewModel.onStylusUp(150f, 150f, w, h)
        
        val active = viewModel.currentActiveSketch!!
        assertEquals(1, active.getGeometries().size)
        assertTrue(active.getGeometries()[0] is com.tamercad.core.sketch.SketchArc)
        assertEquals(0, viewModel.rawSketchPoints.size) 
    }
}
