package com.tamercad.ui

import androidx.compose.ui.geometry.Offset
import org.junit.Assert.assertEquals
import org.junit.Test

class Phase201Test {

    @Test
    fun testScreenToSketchToScreenAlignment() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        
        val w = 1000f
        val h = 1000f
        
        // Pick a screen point
        val s1 = Offset(200f, 300f)
        
        // Project to sketch plane
        val sketchPt = viewModel.screenToSketchPoint(s1.x, s1.y, w, h)
        
        // Project back to screen
        val s2 = viewModel.sketchToScreen(sketchPt!!, w, h)
        
        assertEquals("X coordinate mismatch", s1.x, s2.x, 0.1f)
        assertEquals("Y coordinate mismatch", s1.y, s2.y, 0.1f)
    }

    @Test
    fun testLineCommitAppendsToDocument() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = com.tamercad.ui.sketch.SketchTool.LINE
        val w = 1000f
        val h = 1000f
        
        // Simulate Line draw
        viewModel.onStylusDown(100f, 100f, w, h)
        viewModel.onStylusMove(200f, 200f, w, h)
        viewModel.onStylusUp(200f, 200f, w, h)
        
        val geometries = viewModel.currentActiveSketch!!.getGeometries()
        assertEquals(1, geometries.size)
        assertTrue(geometries[0] is com.tamercad.core.sketch.SketchLine)
    }

    @Test
    fun testLineCommitDoesNotMutateOnNextDown() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = com.tamercad.ui.sketch.SketchTool.LINE
        val w = 1000f
        val h = 1000f
        
        // Draw Line 1
        viewModel.onStylusDown(100f, 100f, w, h) 
        viewModel.onStylusMove(200f, 200f, w, h)
        viewModel.onStylusUp(200f, 200f, w, h)
        
        val sketch = viewModel.currentActiveSketch!!
        val geometries = sketch.getGeometries()
        assertEquals(1, geometries.size)
        val line1 = geometries[0] as com.tamercad.core.sketch.SketchLine
        val oldEnd = line1.end
        
        // New stylus DOWN at different location
        viewModel.onStylusDown(500f, 500f, w, h)
        
        // PREVIOUS line should NOT have moved
        assertEquals("Previous line endpoint mutated on next DOWN!", oldEnd, line1.end)
    }

    private fun assertTrue(condition: Boolean) {
        org.junit.Assert.assertTrue(condition)
    }
}
