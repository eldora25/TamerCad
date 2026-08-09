package com.tamercad.ui.navigation

import androidx.compose.ui.geometry.Offset
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Test

class GestureHardenEngineTest {

    @Test
    fun testIdleToOrbit() {
        val engine = GestureHardenEngine()
        
        // Initial state
        var res = engine.process(0, emptyList())
        assertEquals(NavigationMode.IDLE, res.mode)
        
        // One finger down
        res = engine.process(1, listOf(Offset(100f, 100f)))
        assertEquals(NavigationMode.ORBIT, res.mode)
        assertEquals(0f, res.yawDelta) // First frame of transition should be 0 delta
        
        // Move one finger
        res = engine.process(1, listOf(Offset(110f, 100f)))
        assertEquals(NavigationMode.ORBIT, res.mode)
        assertNotEquals(0f, res.yawDelta)
    }

    @Test
    fun testOrbitToPanZoom() {
        val engine = GestureHardenEngine()
        
        // Start Orbit
        engine.process(1, listOf(Offset(100f, 100f)))
        
        // Add second finger
        val res = engine.process(2, listOf(Offset(100f, 100f), Offset(200f, 100f)))
        assertEquals(NavigationMode.PAN_ZOOM, res.mode)
        assertEquals(Offset.Zero, res.panDelta) // Rebase frame
        assertEquals(1f, res.zoomScale)
        
        // Move centroid
        val res2 = engine.process(2, listOf(Offset(110f, 110f), Offset(210f, 110f)))
        assertEquals(NavigationMode.PAN_ZOOM, res2.mode)
        assertEquals(Offset(10f, 10f), res2.panDelta)
        assertEquals(1f, res2.zoomScale) // Distance remained same
    }

    @Test
    fun testPinchZoom() {
        val engine = GestureHardenEngine()
        
        // Start multi-touch
        engine.process(2, listOf(Offset(100f, 100f), Offset(200f, 100f)))
        
        // Increase distance (Pinch out -> Zoom IN)
        val res = engine.process(2, listOf(Offset(50f, 100f), Offset(250f, 100f)))
        assertEquals(NavigationMode.PAN_ZOOM, res.mode)
        assertEquals(2f, res.zoomScale, 0.001f)
        assertEquals(Offset.Zero, res.panDelta) // Centroid remained at 150, 100
    }

    @Test
    fun testPanZoomToOrbitRebase() {
        val engine = GestureHardenEngine()
        
        // In Pan/Zoom
        engine.process(2, listOf(Offset(100f, 100f), Offset(200f, 100f)))
        
        // Remove one finger
        val res = engine.process(1, listOf(Offset(150f, 150f)))
        assertEquals(NavigationMode.ORBIT, res.mode)
        assertEquals(0f, res.yawDelta) // Rebase frame
        
        // Move remaining finger
        val res2 = engine.process(1, listOf(Offset(160f, 150f)))
        assertEquals(NavigationMode.ORBIT, res2.mode)
        assertNotEquals(0f, res2.yawDelta)
    }
}
