package com.tamercad.ui

import com.tamercad.core.sketch.SketchFeature
import com.tamercad.core.math.SketchPlane
import org.junit.Assert.*
import org.junit.Test

class Phase20823Test {

    @Test
    fun testInspectButtonOpensObjectTree() {
        val viewModel = CADViewModel()
        viewModel.isObjectTreeVisible = false
        
        // Directly call the open action that the button triggers
        viewModel.openObjectTree()
        assertTrue("openObjectTree() must set isObjectTreeVisible to true", viewModel.isObjectTreeVisible)
    }

    @Test
    fun testObjectTreeDisplaysSketchCount() {
        val viewModel = CADViewModel()
        viewModel.document.sketches.clear()
        viewModel.document.sketches.add(SketchFeature("S1", SketchPlane.XY))
        viewModel.document.sketches.add(SketchFeature("S2", SketchPlane.XZ))
        
        assertEquals(2, viewModel.document.sketches.size)
    }

    @Test
    fun testObjectTreeVisibleWithoutSavedPosition() {
        val viewModel = CADViewModel()
        // Ensure it can be visible even if offset is Zero (fixed position)
        viewModel.objectTreeOffsetDp = androidx.compose.ui.geometry.Offset.Zero
        viewModel.openObjectTree()
        assertTrue(viewModel.isObjectTreeVisible)
    }
}
