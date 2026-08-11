package com.tamercad.ui

import androidx.compose.ui.geometry.Offset
import com.tamercad.ui.sketch.SketchTool
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.PI

class Phase206Test {

    @Test
    fun testRealCommitIncrementsDocumentCount() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.LINE
        val w = 1000f; val h = 1000f

        // One Line (Drag interaction)
        viewModel.onSketchDragStart(Offset(0f, 0f), w, h, null)
        viewModel.onSketchDrag(Offset(100f, 0f), Offset(100f, 0f), w, h, null)
        viewModel.onSketchDragEnd(null)

        assertEquals("TOTAL ENTITIES should be 1 after one line commit", 1, viewModel.document.sketches.sumOf { it.getGeometries().size })
    }

    @Test
    fun testContinuousLineTapHoverTap() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.LINE
        val w = 1000f; val h = 1000f

        // Segment 1
        viewModel.onSketchDragStart(Offset(100f, 100f), w, h, null)
        viewModel.onSketchDrag(Offset(200f, 100f), Offset(100f, 0f), w, h, null)
        viewModel.onSketchDragEnd(null)

        assertEquals(1, viewModel.currentActiveSketch!!.getGeometries().size)
        assertEquals(1, viewModel.rawSketchPoints.size)
        
        // Segment 2 (Continuous)
        viewModel.onSketchDragStart(Offset(200f, 100f), w, h, null)
        viewModel.onSketchDrag(Offset(200f, 200f), Offset(0f, 100f), w, h, null)
        viewModel.onSketchDragEnd(null)

        assertEquals(2, viewModel.currentActiveSketch!!.getGeometries().size)
    }

    @Test
    fun testCircleCenterRadiusInteraction() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.CIRCLE
        val w = 1000f; val h = 1000f

        viewModel.onSketchDragStart(Offset(500f, 500f), w, h, null)
        viewModel.onSketchDrag(Offset(600f, 500f), Offset(100f, 0f), w, h, null)
        viewModel.onSketchDragEnd(null)

        assertEquals(1, viewModel.currentActiveSketch!!.getGeometries().size)
        assertTrue(viewModel.currentActiveSketch!!.getGeometries()[0] is com.tamercad.core.sketch.SketchCircle)
    }

    @Test
    fun testRectangleInteraction() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.RECTANGLE
        val w = 1000f; val h = 1000f

        viewModel.onSketchDragStart(Offset(100f, 100f), w, h, null)
        viewModel.onSketchDrag(Offset(300f, 300f), Offset(200f, 200f), w, h, null)
        viewModel.onSketchDragEnd(null)

        assertEquals(4, viewModel.currentActiveSketch!!.getGeometries().size)
    }

    @Test
    fun testArcThreePointInteraction() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.ARC
        val w = 1000f; val h = 1000f

        // 1. P1 to P2 (Drag start to end)
        viewModel.onSketchDragStart(Offset(100f, 100f), w, h, null)
        viewModel.onSketchDrag(Offset(200f, 100f), Offset(100f, 0f), w, h, null)
        viewModel.onSketchDragEnd(null)
        assertEquals(2, viewModel.rawSketchPoints.size)

        // 2. P3 (Drag curvature)
        viewModel.onSketchDragStart(Offset(150f, 150f), w, h, null)
        viewModel.onSketchDrag(Offset(150f, 150f), Offset(0f, 0f), w, h, null)
        viewModel.onSketchDragEnd(null)

        assertEquals(0, viewModel.rawSketchPoints.size)
        assertEquals(1, viewModel.currentActiveSketch!!.getGeometries().size)
        assertTrue(viewModel.currentActiveSketch!!.getGeometries()[0] is com.tamercad.core.sketch.SketchArc)
    }

    @Test
    fun testMultiPlanePersistence() {
        val viewModel = CADViewModel()
        
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.LINE
        viewModel.onSketchDragStart(Offset(0f, 0f), 1000f, 1000f, null)
        viewModel.onSketchDrag(Offset(100f, 100f), Offset(100f, 100f), 1000f, 1000f, null)
        viewModel.onSketchDragEnd(null)
        
        viewModel.enterSketchMode("XZ")
        viewModel.activeSketchTool = SketchTool.LINE
        viewModel.onSketchDragStart(Offset(0f, 0f), 1000f, 1000f, null)
        viewModel.onSketchDrag(Offset(100f, 100f), Offset(100f, 100f), 1000f, 1000f, null)
        viewModel.onSketchDragEnd(null)

        assertEquals(2, viewModel.document.sketches.size)
        assertEquals(2, viewModel.document.sketches.sumOf { it.getGeometries().size })
    }
}
