package com.tamercad.ui

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.PI

class CameraHardeningTest {

    @Test
    fun testCameraPitchClamping() {
        val viewModel = CADViewModel()
        
        // Pitch limit is PI/2 - 0.01
        val limit = (PI / 2.0 - 0.01).toFloat()
        
        // Try to exceed positive limit
        viewModel.updateCamera(0f, 10f, 1f, 0f, 0f)
        assertEquals(limit, viewModel.cameraPitch, 0.001f)
        
        // Try to exceed negative limit
        viewModel.updateCamera(0f, -20f, 1f, 0f, 0f)
        assertEquals(-limit, viewModel.cameraPitch, 0.001f)
    }

    @Test
    fun testCameraZoomBounds() {
        val viewModel = CADViewModel()
        
        // Try to zoom out excessively (MIN_ZOOM = 0.1f)
        viewModel.updateCamera(0f, 0f, 0.0001f, 0f, 0f)
        assertEquals(0.1f, viewModel.zoom, 0.001f)
        
        // Try to zoom in excessively (MAX_ZOOM = 50.0f)
        viewModel.updateCamera(0f, 0f, 1000f, 0f, 0f)
        assertEquals(50.0f, viewModel.zoom, 0.001f)
    }

    @Test
    fun testCameraStateFiniteness() {
        val viewModel = CADViewModel()
        
        viewModel.updateCamera(Float.NaN, Float.POSITIVE_INFINITY, Float.NaN, Float.NEGATIVE_INFINITY, Float.NaN)
        
        // After CoerceIn, it should still be finite if coerceIn handles it, 
        // but coerceIn on NaN might behave differently. 
        // The implementation coerced pitch and zoom.
        
        assertTrue(viewModel.cameraPitch.isFinite())
        assertTrue(viewModel.zoom.isFinite())
    }
}
