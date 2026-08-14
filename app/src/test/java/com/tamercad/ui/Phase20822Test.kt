package com.tamercad.ui

import com.tamercad.ui.toolbar.ToolbarCategory
import org.junit.Assert.*
import org.junit.Test

class Phase20822Test {

    @Test
    fun testBrowserExplicitOpen() {
        val viewModel = CADViewModel()
        viewModel.isObjectTreeVisible = false
        
        viewModel.openObjectTree()
        assertTrue("openObjectTree() must set isObjectTreeVisible to true", viewModel.isObjectTreeVisible)
    }

    @Test
    fun testBrowserToggle() {
        val viewModel = CADViewModel()
        viewModel.isObjectTreeVisible = false
        
        viewModel.toggleObjectTree()
        assertTrue(viewModel.isObjectTreeVisible)
        
        viewModel.toggleObjectTree()
        assertFalse(viewModel.isObjectTreeVisible)
    }

    @Test
    fun testBrowserOpenDoesNotDependOnPin() {
        val viewModel = CADViewModel()
        viewModel.objectTreePinned = false
        viewModel.isObjectTreeVisible = false
        
        viewModel.openObjectTree()
        assertTrue(viewModel.isObjectTreeVisible)
        
        viewModel.isObjectTreeVisible = false
        viewModel.objectTreePinned = true
        viewModel.openObjectTree()
        assertTrue("Pinned state should not prevent opening", viewModel.isObjectTreeVisible)
    }

    @Test
    fun testSafeDefaultPositionOnInvalidState() {
        val viewModel = CADViewModel()
        // Simulate invalid state (e.g. -1 values from prefs)
        viewModel.loadUiState(1000f, 800f)
        
        // defaultX = 1000 - 280 = 720
        // defaultY = 220 (Updated from 150)
        assertEquals(720f, viewModel.objectTreeOffsetDp.x)
        assertEquals(220f, viewModel.objectTreeOffsetDp.y)
    }
}
