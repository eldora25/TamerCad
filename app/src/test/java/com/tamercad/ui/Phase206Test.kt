package com.tamercad.ui

import androidx.compose.ui.geometry.Offset
import com.tamercad.ui.sketch.SketchTool
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.PI

class Phase206Test {

    @Test
    fun testZeroMoveIsTap() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.LINE
        val w = 1000f; val h = 1000f
        viewModel.onStylusDown(100f, 100f, w, h)
        viewModel.onStylusUp(100f, 100f, w, h)
        assertEquals("Point should be selected on zero move tap", 1, viewModel.rawSketchPoints.size)
    }

    @Test
    fun testSmallMoveIsTap() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.LINE
        val w = 1000f; val h = 1000f
        viewModel.onStylusDown(100f, 100f, w, h)
        viewModel.onStylusMove(103f, 103f, w, h)
        viewModel.onStylusUp(103f, 103f, w, h)
        assertEquals("Point should be selected on small move tap", 1, viewModel.rawSketchPoints.size)
    }

    @Test
    fun testLargeMoveIsDrag() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.CIRCLE
        val w = 1000f; val h = 1000f
        viewModel.onStylusDown(500f, 500f, w, h)
        viewModel.onStylusMove(550f, 500f, w, h)
        viewModel.onStylusUp(550f, 500f, w, h)
        assertEquals(1, viewModel.currentActiveSketch!!.getGeometries().size)
    }

    @Test
    fun testRectangleFirstTapNeverCommits() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.RECTANGLE
        val w = 1000f; val h = 1000f
        viewModel.onStylusDown(100f, 100f, w, h)
        viewModel.onStylusUp(100f, 100f, w, h)
        assertEquals(1, viewModel.rawSketchPoints.size)
        assertEquals(0, viewModel.currentActiveSketch!!.getGeometries().size)
    }

    @Test
    fun testXZInteractionDoesNotUseXYSnapLeakage() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.LINE
        viewModel.onStylusDown(0f, 0f, 1000f, 1000f); viewModel.onStylusUp(100f, 100f, 1000f, 1000f)
        viewModel.onStylusUp(100f, 100f, 1000f, 1000f) // Commit line
        
        viewModel.enterSketchMode("XZ")
        val active = viewModel.currentActiveSketch!!
        assertEquals("XZ sketch should be empty", 0, active.getGeometries().size)
        viewModel.onPointSelected(com.tamercad.core.math.Vec2(50.0, 50.0), 1000f, 1000f)
        assertTrue(viewModel.currentSnap?.type != com.tamercad.core.sketch.SnapType.ENDPOINT)
    }

    @Test
    fun testAlignCameraToPlane() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        assertEquals(0f, viewModel.cameraPitch, 0.01f)
        assertEquals(0f, viewModel.cameraYaw, 0.01f)
        viewModel.enterSketchMode("YZ")
        assertEquals(0f, viewModel.cameraPitch, 0.01f)
        assertEquals(PI.toFloat()/2f, viewModel.cameraYaw, 0.01f)
    }
}
