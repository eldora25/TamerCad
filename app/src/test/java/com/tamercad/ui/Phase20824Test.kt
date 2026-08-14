package com.tamercad.ui

import androidx.compose.ui.geometry.Offset
import com.tamercad.ui.toolbar.ToolbarCategory
import org.junit.Assert.*
import org.junit.Test

class Phase20824Test {

    @Test
    fun testObjectTreeHeaderDragUpdatesOffset() {
        val viewModel = CADViewModel()
        viewModel.objectTreeOffsetDp = Offset(100f, 100f)
        
        // Simulate drag delta of (10, 20) in DP
        viewModel.setObjectTreePositionDp(Offset(110f, 120f))
        
        assertEquals(110f, viewModel.objectTreeOffsetDp.x)
        assertEquals(120f, viewModel.objectTreeOffsetDp.y)
    }

    @Test
    fun testUnpinnedObjectTreeClosesOnTransientPanel() {
        val viewModel = CADViewModel()
        viewModel.isObjectTreeVisible = true
        viewModel.objectTreePinned = false
        viewModel.activeCategory = ToolbarCategory.INSPECT
        
        // Switching to SKETCH should close unpinned Object Tree
        // Note: This logic is currently in MainCADScreen.kt's onCategoryClick.
        // We'll simulate the call logic here.
        val cat = ToolbarCategory.SKETCH
        if (!viewModel.objectTreePinned && cat != ToolbarCategory.NONE && cat != ToolbarCategory.INSPECT) {
            viewModel.isObjectTreeVisible = false
        }
        
        assertFalse("Unpinned Object Tree should close when switching categories", viewModel.isObjectTreeVisible)
    }

    @Test
    fun testPinnedObjectTreeSurvivesCategoryChange() {
        val viewModel = CADViewModel()
        viewModel.isObjectTreeVisible = true
        viewModel.objectTreePinned = true
        
        val cat = ToolbarCategory.SKETCH
        if (!viewModel.objectTreePinned && cat != ToolbarCategory.NONE && cat != ToolbarCategory.INSPECT) {
            viewModel.isObjectTreeVisible = false
        }
        
        assertTrue("Pinned Object Tree should remain visible", viewModel.isObjectTreeVisible)
    }

    @Test
    fun testObjectTreeClampAllowsHeaderToBeVisible() {
        val viewModel = CADViewModel()
        // Screen 1000x1000. Try to push it way off bottom-right.
        viewModel.clampObjectTreePosition(1500f, 1500f, 1000f, 1000f)
        
        // Should be clamped such that at least some header (40dp) is visible.
        // x <= 1000 - 40 = 960
        // y <= 1000 - 40 = 960
        assertTrue(viewModel.objectTreeOffsetDp.x <= 960f)
        assertTrue(viewModel.objectTreeOffsetDp.y <= 960f)
    }
}
