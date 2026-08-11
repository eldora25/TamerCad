package com.tamercad.ui

import androidx.compose.ui.geometry.Offset
import com.tamercad.core.math.SketchPlane
import com.tamercad.core.math.Vec2
import com.tamercad.ui.navigation.GestureHardenEngine
import com.tamercad.ui.navigation.NavigationMode
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class Phase203Test {

    @Test
    fun testXZPlaneAlignment() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XZ")
        
        val w = 1000f
        val h = 1000f
        
        // Test screen center
        val s = Offset(500f, 500f)
        val sketchPt = viewModel.screenToSketchPoint(s.x, s.y, w, h)
        
        assertTrue("Ray-Plane intersection failed on XZ", sketchPt != null)
        
        val s2 = viewModel.sketchToScreen(sketchPt!!, viewModel.activeSketchPlane, w, h)
        
        assertEquals("X alignment error on XZ", s.x, s2.x, 0.5f)
        assertEquals("Y alignment error on XZ", s.y, s2.y, 0.5f)
    }

    @Test
    fun testEntityRenderProjectionChangesWithOrbit() {
        val viewModel = CADViewModel()
        val w = 1000f
        val h = 1000f
        val p = Vec2(100.0, 100.0)
        val plane = SketchPlane.XY
        
        // Original projection
        val s1 = viewModel.sketchToScreen(p, plane, w, h)
        
        // Orbit camera
        viewModel.updateCamera(0.5f, 0.5f, 1f, 0f, 0f)
        
        val s2 = viewModel.sketchToScreen(p, plane, w, h)
        
        // Screen coordinates MUST change
        assertTrue("Projected screen point did not change after orbit!", s1 != s2)
    }

    @Test
    fun testIndependentSketchesOnDifferentPlanes() {
        val viewModel = CADViewModel()
        
        // Sketch 1 on XY
        viewModel.enterSketchMode("XY")
        val sketch1 = viewModel.currentActiveSketch!!
        assertEquals(SketchPlane.XY, sketch1.plane)
        
        // Sketch 2 on XZ
        viewModel.enterSketchMode("XZ")
        val sketch2 = viewModel.currentActiveSketch!!
        assertEquals(SketchPlane.XZ, sketch2.plane)
        
        // They should be different instances and both in document
        assertTrue(sketch1 !== sketch2)
        assertTrue(viewModel.document.sketches.contains(sketch1))
        assertTrue(viewModel.document.sketches.contains(sketch2))
    }
}
