package com.tamercad.core.sketch

import com.tamercad.core.math.Vec2
import com.tamercad.core.math.CadTolerance
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class SketchEntityTest {

    @Test
    fun testSketchLine() {
        val p1 = Vec2(0.0, 0.0)
        val p2 = Vec2(100.0, 0.0)
        val line = SketchLine(p1, p2)
        
        assertEquals(100.0, line.length(), CadTolerance.EPSILON)
        assertEquals("SketchLine", line.type)
    }

    @Test
    fun testSketchCircle() {
        val center = Vec2(50.0, 50.0)
        val radius = 25.0
        val circle = SketchCircle(center, radius)
        
        assertEquals(25.0, circle.radius, CadTolerance.EPSILON)
        assertEquals(center, circle.center)
    }

    @Test
    fun testRectangleLogic() {
        val p1 = Vec2(0.0, 0.0)
        val p2 = Vec2(100.0, 50.0)
        
        // Simulating the 4 lines creation from CADViewModel
        val corner2 = Vec2(p2.x, p1.y) // (100, 0)
        val corner4 = Vec2(p1.x, p2.y) // (0, 50)
        
        val line1 = SketchLine(p1, corner2)
        val line2 = SketchLine(corner2, p2)
        val line3 = SketchLine(p2, corner4)
        val line4 = SketchLine(corner4, p1)
        
        assertEquals(100.0, line1.length(), CadTolerance.EPSILON)
        assertEquals(50.0, line2.length(), CadTolerance.EPSILON)
        assertEquals(100.0, line3.length(), CadTolerance.EPSILON)
        assertEquals(50.0, line4.length(), CadTolerance.EPSILON)
    }
}
