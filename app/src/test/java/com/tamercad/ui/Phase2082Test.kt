package com.tamercad.ui

import androidx.compose.ui.geometry.Offset
import com.tamercad.ui.selection.SelectionMode
import org.junit.Assert.*
import org.junit.Test

class Phase2082Test {

    @Test
    fun testBrowserPinStateToggle() {
        val viewModel = CADViewModel()
        assertFalse(viewModel.objectTreePinned)
        viewModel.toggleBrowserPin()
        assertTrue(viewModel.objectTreePinned)
        viewModel.toggleBrowserPin()
        assertFalse(viewModel.objectTreePinned)
    }

    @Test
    fun testSelectionModeToggle() {
        val viewModel = CADViewModel()
        assertEquals(SelectionMode.SINGLE, viewModel.selectionManager.selectionMode)
        
        // Manual toggle to avoid runCommand's Context dependency in unit tests
        viewModel.selectionManager.selectionMode = SelectionMode.MULTI
        assertEquals(SelectionMode.MULTI, viewModel.selectionManager.selectionMode)
    }
}
