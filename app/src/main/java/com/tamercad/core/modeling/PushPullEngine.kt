package com.tamercad.core.modeling

import com.tamercad.core.geometry.Face3D
import com.tamercad.core.geometry.Line
import com.tamercad.core.geometry.Solid3D
import com.tamercad.core.math.Point3

/**
 * Parasolid Sınıfı Doğrudan Modelleme: Yüzeyleri 'Push-Pull' (İtme-Çekme) yöntemiyle dinamik uzatma motoru.
 */
class PushPullEngine {

    fun executePushPull(solid: Solid3D, faceIndex: Int, offsetDelta: Double): Solid3D {
        if (faceIndex < 0 || faceIndex >= solid.faces.size) return solid

        val targetFace = solid.faces[faceIndex]
        val normal = targetFace.normal()

        // Yüzeyin noktalarını normal vektör doğrultusunda offsetDelta kadar kaydır
        val extrudedVertices = targetFace.vertices.map { v ->
            Point3(
                v.x + normal.x * offsetDelta,
                v.y + normal.y * offsetDelta,
                v.z + normal.z * offsetDelta
            )
        }

        val newFaces = solid.faces.toMutableList()
        newFaces[faceIndex] = Face3D(extrudedVertices)

        val newLines = solid.lines.toMutableList()
        for (i in extrudedVertices.indices) {
            val pA = targetFace.vertices[i]
            val pB = extrudedVertices[i]
            newLines.add(Line(pA, pB))
        }

        return Solid3D(newLines, newFaces)
    }
}
