package com.tamercad.ui

import androidx.compose.ui.geometry.Offset
import com.tamercad.core.math.Vec2
import com.tamercad.ui.navigation.GestureHardenEngine
import com.tamercad.ui.navigation.NavigationMode
import org.junit.Assert.assertEquals
import org.junit.Test

class Phase201Test {

    @Test
    fun testIdleToOrbitRebase() {
        val engine = GestureHardenEngine()
        
        // IDLE
        engine.process(0, emptyList())
        
        // First touch at arbitrary location
        val res = engine.process(1, listOf(Offset(500f, 500f)))
        
        assertEquals(NavigationMode.ORBIT, res.mode)
        assertEquals(0f, res.yawDelta, 0.001f)
        assertEquals(0f, res.pitchDelta, 0.001f)
    }

    @Test
    fun testCoordinateRoundTrip() {
        val viewModel = CADViewModel()
        val w = 1920f
        val h = 1080f
        
        // Test points
        val testPoints = listOf(
            Offset(w/2, h/2),
            Offset(w/4, h/4),
            Offset(3*w/4, h/4)
        )
        
        for (s in testPoints) {
            val sketchPt = viewModel.screenToSketchPoint(s.x, s.y, w, h)
            if (sketchPt != null) {
                val s2 = viewModel.sketchToScreen(sketchPt, w, h)
                assertEquals("X round-trip failed at $s", s.x, s2.x, 0.5f)
                assertEquals("Y round-trip failed at $s", s.y, s2.y, 0.5f)
            }
        }
    }

    @Test
    fun testLineCommitDoesNotMutateOnNextDown() {
        val viewModel = CADViewModel()
        viewModel.isSketchMode = true
        viewModel.activeSketchTool = com.tamercad.ui.sketch.SketchTool.LINE
        val w = 1000f
        val h = 1000f
        
        // Draw Line 1
        viewModel.onSketchDragStart(Offset(100f, 100f), w, h, null) 
        // Moving updates currentSnap
        viewModel.onSketchDrag(Offset(200f, 200f), Offset(100f, 100f), w, h, null)
        viewModel.onSketchDragEnd(null)
        
        val geometries = viewModel.activeSketch.getGeometries()
        assertEquals(1, geometries.size)
        val line1 = geometries[0] as com.tamercad.core.sketch.SketchLine
        val oldEnd = line1.end
        
        // New stylus DOWN at different location
        viewModel.onSketchDragStart(Offset(500f, 500f), w, h, null)
        
        // PREVIOUS line should NOT have moved
        assertEquals("Previous line endpoint mutated on next DOWN!", oldEnd, line1.end)
    }
}
