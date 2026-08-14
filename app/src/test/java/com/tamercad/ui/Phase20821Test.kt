package com.tamercad.ui

import androidx.compose.ui.geometry.Offset
import org.junit.Assert.*
import org.junit.Test

class Phase20821Test {

    @Test
    fun testBrowserNegativePositionIsClamped() {
        val viewModel = CADViewModel()
        // Simulate load with negative position on a 1000x1000 screen
        viewModel.clampObjectTreePosition(-50f, -50f, 1000f, 1000f)
        
        assertEquals(0f, viewModel.objectTreeOffsetDp.x)
        assertEquals(0f, viewModel.objectTreeOffsetDp.y)
    }

    @Test
    fun testBrowserPositionBeyondRightEdgeIsClamped() {
        val viewModel = CADViewModel()
        val screenWidth = 1000f
        
        viewModel.clampObjectTreePosition(1100f, 100f, screenWidth, 1000f)
        
        // Should be clamped to screenWidth - 40f (header visible policy)
        assertEquals(960f, viewModel.objectTreeOffsetDp.x)
    }

    @Test
    fun testBrowserPinDoesNotHideBrowser() {
        val viewModel = CADViewModel()
        viewModel.isObjectTreeVisible = true
        assertFalse(viewModel.objectTreePinned)
        
        viewModel.toggleBrowserPin()
        assertTrue(viewModel.objectTreePinned)
        assertTrue("Browser should remain visible when pinned", viewModel.isObjectTreeVisible)
    }

    @Test
    fun testBrowserDefaultPositionOnFreshLaunch() {
        val viewModel = CADViewModel()
        // No prefs mocked, so it should use default calculation
        viewModel.loadUiState(2000f, 1000f)
        
        // defaultX = screenWidthDp - 280f = 1720f
        assertEquals(1720f, viewModel.objectTreeOffsetDp.x)
        assertFalse(viewModel.isObjectTreeVisible)
    }
}
