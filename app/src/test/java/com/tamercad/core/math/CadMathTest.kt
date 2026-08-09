package com.tamercad.core.math

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.sqrt

class CadMathTest {

    @Test
    fun testVec2Operations() {
        val v1 = Vec2(10.0, 20.0)
        val v2 = Vec2(5.0, 5.0)
        
        assertEquals(Vec2(15.0, 25.0), v1 + v2)
        assertEquals(Vec2(5.0, 15.0), v1 - v2)
        assertEquals(Vec2(20.0, 40.0), v1 * 2.0)
        assertEquals(Vec2(5.0, 10.0), v1 / 2.0)
        
        assertEquals(sqrt(50.0), v2.length(), 0.001)
        assertTrue(v1.isFinite())
    }

    @Test
    fun testVec3Operations() {
        val v1 = Vec3(1.0, 0.0, 0.0)
        val v2 = Vec3(0.0, 1.0, 0.0)
        
        assertEquals(1.0, v1.length(), 0.001)
        assertEquals(0.0, v1.dot(v2), 0.001)
        assertEquals(Vec3(0.0, 0.0, 1.0), v1.cross(v2))
        
        val v3 = Vec3(10.0, 0.0, 0.0).normalized()
        assertEquals(1.0, v3.length(), 0.001)
    }

    @Test
    fun testCadTolerance() {
        assertTrue(CadTolerance.isZero(1e-5))
        assertFalse(CadTolerance.isZero(0.01))
        assertTrue(CadTolerance.areEqual(10.0, 10.0001))
    }

    @Test
    fun testSketchPlaneProjections() {
        val plane = SketchPlane.XY
        val worldPt = Vec3(100.0, 50.0, 0.0)
        
        val local = plane.worldToLocal(worldPt)
        assertEquals(100.0, local.x, 0.001)
        assertEquals(50.0, local.y, 0.001)
        
        val backToWorld = plane.localToWorld(local)
        assertTrue(worldPt.approximatelyEquals(backToWorld))
    }

    @Test
    fun testRayPlaneIntersection() {
        val plane = SketchPlane.XY
        // Ray from above looking down
        val ray = Ray3(Vec3(10.0, 10.0, 100.0), Vec3(0.0, 0.0, -1.0))
        
        val hit = plane.intersectRay(ray)
        assertNotNull(hit)
        assertEquals(10.0, hit!!.x, 0.001)
        assertEquals(10.0, hit!!.y, 0.001)
        assertEquals(0.0, hit!!.z, 0.001)
        
        // Parallel ray
        val parallelRay = Ray3(Vec3(10.0, 10.0, 100.0), Vec3(1.0, 0.0, 0.0))
        assertTrue(plane.intersectRay(parallelRay) == null)
    }

    @Test
    fun test100mmInvariance() {
        val A = Vec2(0.0, 0.0)
        val B = Vec2(100.0, 0.0)
        
        // Mathematical invariance in model space
        val dist = A.distanceTo(B)
        assertEquals(100.0, dist, 0.001)
        
        // Transform to world on different planes
        val worldA_XY = SketchPlane.XY.localToWorld(A)
        val worldB_XY = SketchPlane.XY.localToWorld(B)
        assertEquals(100.0, worldA_XY.distanceTo(worldB_XY), 0.001)

        val worldA_XZ = SketchPlane.XZ.localToWorld(A)
        val worldB_XZ = SketchPlane.XZ.localToWorld(B)
        assertEquals(100.0, worldA_XZ.distanceTo(worldB_XZ), 0.001)
    }
}
