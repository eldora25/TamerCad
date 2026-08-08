package com.tamercad.core.math

import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * ADR-0023: Testing & Quality Assurance Architecture
 * TamerCAD Vektör ve Matematik Çekirdeği Birim Testleri.
 */
class VectorMathTest {

    @Test
    fun testVectorNormalization() {
        val v = Vector3(3.0, 4.0, 0.0)
        val normalized = v.normalize()
        
        // Uzunluğun 1.0 (Birim Vektör) olduğunu doğrula
        val length = Math.sqrt(normalized.x * normalized.x + normalized.y * normalized.y + normalized.z * normalized.z)
        assertEquals(1.0, length, 0.0001)
    }

    @Test
    fun testVectorDotProduct() {
        val v1 = Vector3(1.0, 0.0, 0.0)
        val v2 = Vector3(0.0, 1.0, 0.0)
        
        val dot = v1.dot(v2)
        // Dik vektörlerin dot product sonucu 0 olmalıdır
        assertEquals(0.0, dot, 0.0001)
    }
}
