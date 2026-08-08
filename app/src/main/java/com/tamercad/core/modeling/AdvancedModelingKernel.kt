package com.tamercad.core.modeling

import com.tamercad.core.geometry.Face3D
import com.tamercad.core.geometry.Line
import com.tamercad.core.geometry.Solid3D
import com.tamercad.core.math.Point3

/**
 * Gelişmiş Modelleme Kernel Araçları: Shell, Wrap & Emboss, Project.
 */
class AdvancedModelingKernel {

    // 1. Shell (Kabuk Oluşturma): Duvar kalınlığı bırakarak içini boşaltma simülasyonu
    fun executeShell(solid: Solid3D, wallThickness: Double): Solid3D {
        val shrunkFaces = solid.faces.map { face ->
            val center = Point3(
                face.vertices.sumOf { it.x } / face.vertices.size,
                face.vertices.sumOf { it.y } / face.vertices.size,
                face.vertices.sumOf { it.z } / face.vertices.size
            )
            val innerVertices = face.vertices.map { v ->
                Point3(
                    center.x + (v.x - center.x) * (1.0 - wallThickness / 100.0),
                    center.y + (v.y - center.y) * (1.0 - wallThickness / 100.0),
                    center.z + (v.z - center.z) * (1.0 - wallThickness / 100.0)
                )
            }
            Face3D(innerVertices)
        }
        return Solid3D(solid.lines, shrunkFaces)
    }

    // 2. Wrap & Emboss (Sar ve Kabart): Silindirik yüzeye çizim giydirme
    fun executeWrapAndEmboss(solid: Solid3D, depth: Double): Solid3D {
        val embossedFaces = solid.faces.map { face ->
            val raisedVertices = face.vertices.map { v ->
                Point3(v.x, v.y, v.z + depth)
            }
            Face3D(raisedVertices)
        }
        return Solid3D(solid.lines, embossedFaces)
    }

    // 3. Project (Yansıtma): Çizgileri eğrisel yüzeylere izdüşürme
    fun executeProject(lines: List<Line>, targetZ: Double): List<Line> {
        return lines.map { line ->
            Line(
                Point3(line.startPoint.x, line.startPoint.y, targetZ),
                Point3(line.endPoint.x, line.endPoint.y, targetZ)
            )
        }
    }
}
