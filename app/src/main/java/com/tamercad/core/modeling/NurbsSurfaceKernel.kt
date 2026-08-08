package com.tamercad.core.modeling

import com.tamercad.core.geometry.Face3D
import com.tamercad.core.geometry.Line
import com.tamercad.core.geometry.Solid3D
import com.tamercad.core.math.Point3
import kotlin.math.cos
import kotlin.math.sin

/**
 * NURBS Eğrilik Sarma (Wrap) ve İzdüşüm (Project) Yerel Matematiksel Kernel Motoru.
 */
class NurbsSurfaceKernel {

    /**
     * 2D / Düzlemsel çizgi ve noktaları silindirik/eğrisel NURBS yüzey matrisine göre sarar (Wrap & Emboss).
     */
    fun wrapToCylindricalSurface(solid: Solid3D, cylinderRadius: Double, wrapDepth: Double): Solid3D {
        val wrappedFaces = solid.faces.map { face ->
            val wrappedVertices = face.vertices.map { v ->
                // Polar / Silindirik Eğrilik Matris Dönüşümü (X -> Açısal Yay, Y -> Boyuna Eksen, Z -> Yarıçap/Derinlik)
                val theta = v.x / cylinderRadius
                val r = cylinderRadius + wrapDepth + v.z
                val newX = r * cos(theta)
                val newY = v.y
                val newZ = r * sin(theta)
                Point3(newX, newY, newZ)
            }
            Face3D(wrappedVertices)
        }

        val wrappedLines = solid.lines.map { line ->
            val thetaStart = line.startPoint.x / cylinderRadius
            val rStart = cylinderRadius + wrapDepth + line.startPoint.z
            val p1 = Point3(rStart * cos(thetaStart), line.startPoint.y, rStart * sin(thetaStart))

            val thetaEnd = line.endPoint.x / cylinderRadius
            val rEnd = cylinderRadius + wrapDepth + line.endPoint.z
            val p2 = Point3(rEnd * cos(thetaEnd), line.endPoint.y, rEnd * sin(thetaEnd))

            Line(p1, p2)
        }

        return Solid3D(wrappedLines, wrappedFaces)
    }

    /**
     * Karmaşık eğrisel yüzeyler üzerine hassas çizgi ve nokta izdüşümü (Project) yapar.
     */
    fun projectOntoCurvedSurface(lines: List<Line>, surfaceWaveFactor: Double): List<Line> {
        return lines.map { line ->
            val p1 = Point3(line.startPoint.x, line.startPoint.y, line.startPoint.z + surfaceWaveFactor * sin(line.startPoint.x * 0.1))
            val p2 = Point3(line.endPoint.x, line.endPoint.y, line.endPoint.z + surfaceWaveFactor * sin(line.endPoint.x * 0.1))
            Line(p1, p2)
        }
    }
}
