package com.tamercad.ui

import androidx.compose.ui.geometry.Offset
import com.tamercad.ui.sketch.SketchTool
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.PI

class Phase206Test {

    @Test
    fun testStylusTapWithoutMoveRecognized() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.LINE
        val w = 1000f; val h = 1000f

        // Simulate DOWN + UP at same point (Pure Tap)
        viewModel.onStylusDown(100f, 100f, w, h)
        viewModel.onStylusUp(100f, 100f, w, h)

        assertEquals("P1 should be accepted on pure tap", 1, viewModel.rawSketchPoints.size)
    }

    @Test
    fun testContinuousLineTapHoverTapWithoutMove() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.LINE
        val w = 1000f; val h = 1000f

        // Tap P1
        viewModel.onStylusDown(100f, 100f, w, h)
        viewModel.onStylusUp(100f, 100f, w, h)
        assertEquals(1, viewModel.rawSketchPoints.size)

        // Hover to P2 (simulated)
        viewModel.onStylusHover(200f, 100f, w, h)
        assertTrue(viewModel.previewGeometry is com.tamercad.core.sketch.SketchLine)

        // Tap P2
        viewModel.onStylusDown(200f, 100f, w, h)
        viewModel.onStylusUp(200f, 100f, w, h)

        assertEquals("Line should commit after two taps", 1, viewModel.currentActiveSketch!!.getGeometries().size)
        assertEquals("Continuous chain: P2 should be in rawSketchPoints", 1, viewModel.rawSketchPoints.size)
    }

    @Test
    fun testArcThreeSeparateTaps() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.ARC
        val w = 1000f; val h = 1000f

        // Tap P1
        viewModel.onStylusDown(100f, 100f, w, h); viewModel.onStylusUp(100f, 100f, w, h)
        assertEquals(1, viewModel.rawSketchPoints.size)

        // Tap P2
        viewModel.onStylusDown(200f, 100f, w, h); viewModel.onStylusUp(200f, 100f, w, h)
        assertEquals(2, viewModel.rawSketchPoints.size)

        // Tap P3
        viewModel.onStylusDown(150f, 150f, w, h); viewModel.onStylusUp(150f, 150f, w, h)
        assertEquals(0, viewModel.rawSketchPoints.size) // Reset after commit
        assertEquals(1, viewModel.currentActiveSketch!!.getGeometries().size)
    }

    @Test
    fun testDragConvenienceShortcut() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.CIRCLE
        val w = 1000f; val h = 1000f

        // Drag center to radius
        viewModel.onStylusDown(500f, 500f, w, h)
        viewModel.onStylusMove(600f, 500f, w, h) // Movement beyond slop
        viewModel.onStylusUp(600f, 500f, w, h)

        assertEquals(1, viewModel.currentActiveSketch!!.getGeometries().size)
    }
}
