package com.tamercad.ui

import com.tamercad.core.math.Vec2
import com.tamercad.core.sketch.*
import com.tamercad.ui.sketch.SketchTool
import org.junit.Assert.*
import org.junit.Test

class Phase21Test {

    @Test
    fun testSelectLine() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        val sketch = viewModel.currentActiveSketch!!
        val line = SketchLine(Vec2(0.0, 0.0), Vec2(100.0, 0.0))
        sketch.addGeometry(line)

        viewModel.activeSketchTool = SketchTool.SELECT
        // Tap near midpoint (50, 0)
        viewModel.onPointSelected(Vec2(50.0, 2.0), 1000f, 1000f)
        
        assertEquals(line.id, viewModel.selectionManager.selectedEntityId)
        assertTrue(line.isSelected)
    }

    @Test
    fun testSelectCircle() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        val sketch = viewModel.currentActiveSketch!!
        val circle = SketchCircle(Vec2(0.0, 0.0), 50.0)
        sketch.addGeometry(circle)

        viewModel.activeSketchTool = SketchTool.SELECT
        // Tap near edge (50, 0)
        viewModel.onPointSelected(Vec2(51.0, 0.0), 1000f, 1000f)
        
        assertEquals(circle.id, viewModel.selectionManager.selectedEntityId)
        assertTrue(circle.isSelected)
    }

    @Test
    fun testSelectArc() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        val sketch = viewModel.currentActiveSketch!!
        // Arc center 0,0 radius 50 from 0 to PI/2 (0 to 90 deg)
        val arc = SketchArc(Vec2(0.0, 0.0), 50.0, 0.0, Math.PI / 2.0)
        sketch.addGeometry(arc)

        viewModel.activeSketchTool = SketchTool.SELECT
        // Tap near middle of arc (45 deg)
        val midAngle = Math.PI / 4.0
        viewModel.onPointSelected(Vec2(Math.cos(midAngle) * 50.0, Math.sin(midAngle) * 50.0), 1000f, 1000f)
        
        assertEquals(arc.id, viewModel.selectionManager.selectedEntityId)
        assertTrue(arc.isSelected)
    }

    @Test
    fun testSelectRect() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        val sketch = viewModel.currentActiveSketch!!
        val rect = SketchRect(Vec2(0.0, 0.0), Vec2(100.0, 50.0))
        sketch.addGeometry(rect)

        viewModel.activeSketchTool = SketchTool.SELECT
        // Tap near one of the edges (50, 0)
        viewModel.onPointSelected(Vec2(50.0, 1.0), 1000f, 1000f)
        
        assertEquals(rect.id, viewModel.selectionManager.selectedEntityId)
        assertTrue(rect.isSelected)
    }

    @Test
    fun testEmptySpaceDeselection() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        val sketch = viewModel.currentActiveSketch!!
        val line = SketchLine(Vec2(0.0, 0.0), Vec2(100.0, 0.0))
        sketch.addGeometry(line)

        viewModel.activeSketchTool = SketchTool.SELECT
        viewModel.onPointSelected(Vec2(50.0, 0.0), 1000f, 1000f)
        assertNotNull(viewModel.selectionManager.selectedEntityId)

        // Tap far away
        viewModel.onPointSelected(Vec2(500.0, 500.0), 1000f, 1000f)
        assertNull(viewModel.selectionManager.selectedEntityId)
        assertFalse(line.isSelected)
    }

    @Test
    fun testDeleteIsolation() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        val sketchXY = viewModel.currentActiveSketch!!
        val line1 = SketchLine(Vec2(0.0, 0.0), Vec2(100.0, 0.0))
        sketchXY.addGeometry(line1)
        val line2 = SketchLine(Vec2(0.0, 10.0), Vec2(100.0, 10.0))
        sketchXY.addGeometry(line2)

        viewModel.activeSketchTool = SketchTool.SELECT
        viewModel.onPointSelected(Vec2(50.0, 0.0), 1000f, 1000f) // Select line1
        assertEquals(line1.id, viewModel.selectionManager.selectedEntityId)

        viewModel.deleteSelectedEntity()
        assertEquals(1, sketchXY.getGeometries().size)
        assertEquals(line2.id, sketchXY.getGeometries()[0].id)
        assertNull(viewModel.selectionManager.selectedEntityId)
    }

    @Test
    fun testCrossPlaneSelectionOwnership() {
        val viewModel = CADViewModel()
        
        viewModel.enterSketchMode("XY")
        val sketchXY = viewModel.currentActiveSketch!!
        val lineXY = SketchLine(Vec2(0.0, 0.0), Vec2(100.0, 0.0))
        sketchXY.addGeometry(lineXY)
        val sketchXYId = sketchXY.id

        viewModel.enterSketchMode("XZ")
        val sketchXZ = viewModel.currentActiveSketch!!
        val lineXZ = SketchLine(Vec2(0.0, 0.0), Vec2(100.0, 0.0))
        sketchXZ.addGeometry(lineXZ)

        // Select XY line
        viewModel.selectionManager.selectSingle(lineXY, sketchXYId)
        assertEquals(sketchXYId, viewModel.selectionManager.selectedSketchId)
        
        // Deleting should still work correctly for the owning sketch
        viewModel.deleteSelectedEntity()
        assertEquals(0, sketchXY.getGeometries().size)
        assertEquals(1, sketchXZ.getGeometries().size)
    }

    @Test
    fun testCommandTerminationOnSelect() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.LINE
        viewModel.onPointSelected(Vec2(0.0, 0.0), 1000f, 1000f)
        assertEquals(1, viewModel.rawSketchPoints.size)

        // Switch to SELECT should terminate active construction
        viewModel.activeSketchTool = SketchTool.SELECT
        viewModel.resetActiveToolInteraction() // Simulating runCommand's behavior
        
        assertEquals(0, viewModel.rawSketchPoints.size)
        assertNull(viewModel.previewGeometry)
    }

    @Test
    fun testPlaneSwitchCommandTermination() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        viewModel.activeSketchTool = SketchTool.LINE
        viewModel.onPointSelected(Vec2(0.0, 0.0), 1000f, 1000f)
        assertEquals(1, viewModel.rawSketchPoints.size)

        // Switch plane
        viewModel.enterSketchMode("XZ")
        assertEquals(0, viewModel.rawSketchPoints.size)
        assertNull(viewModel.previewGeometry)
    }

    @Test
    fun testSelectionDoesNotTranslateGeometry() {
        val viewModel = CADViewModel()
        viewModel.enterSketchMode("XY")
        val sketch = viewModel.currentActiveSketch!!
        val line = SketchLine(Vec2(0.0, 0.0), Vec2(100.0, 0.0))
        sketch.addGeometry(line)

        viewModel.activeSketchTool = SketchTool.SELECT
        viewModel.onPointSelected(Vec2(50.0, 0.0), 1000f, 1000f)
        assertTrue(line.isSelected)

        // Stylus move should NOT change line coordinates
        viewModel.onStylusDown(100f, 100f, 1000f, 1000f)
        viewModel.onStylusMove(200f, 200f, 1000f, 1000f)
        viewModel.onStylusUp(200f, 200f, 1000f, 1000f)

        assertEquals(0.0, line.start.x, 0.001)
        assertEquals(0.0, line.start.y, 0.001)
        assertEquals(100.0, line.end.x, 0.001)
    }
}
