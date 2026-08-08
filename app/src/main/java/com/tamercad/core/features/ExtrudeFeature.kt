package com.tamercad.core.features

import com.tamercad.core.geometry.Solid3D
import com.tamercad.core.sketch.SketchFeature
import java.util.UUID

import com.tamercad.core.geometry.Face3D
import com.tamercad.core.geometry.Line
import com.tamercad.core.math.Point3

enum class ExtrudeOperation {
    NEW_BODY, JOIN, CUT, INTERSECT
}

/**
 * 2D Taslağı Z Ekseninde Yükselterek (Extrude) 3D Katı Model Oluşturan Özellik.
 */
class ExtrudeFeature(
    val sketch: SketchFeature,
    var depth: Double,
    override val name: String,
    var operation: ExtrudeOperation = ExtrudeOperation.NEW_BODY,
    var isSymmetric: Boolean = false,
    var isReversed: Boolean = false,
    override var id: String = UUID.randomUUID().toString()
) : IFeature {
    
    override val type: String = "ExtrudeFeature"
    override var isSuppressed: Boolean = false
    
    var generatedGeometry: Solid3D? = null

    init {
        evaluate() 
    }

    override fun evaluate() {
        val baseGeoms = sketch.getGeometries().filterIsInstance<Line>()
        if (baseGeoms.isEmpty()) return
        
        val faces = mutableListOf<Face3D>()
        val lines = mutableListOf<Line>()
        
        val actualDepth = if (isReversed) -depth else depth
        val startZ = if (isSymmetric) -actualDepth / 2.0 else 0.0
        val endZ = if (isSymmetric) actualDepth / 2.0 else actualDepth

        baseGeoms.forEach { line ->
            val p1 = line.startPoint
            val p2 = line.endPoint
            val p1Start = Point3(p1.x, p1.y, p1.z + startZ)
            val p2Start = Point3(p2.x, p2.y, p2.z + startZ)
            val p1End = Point3(p1.x, p1.y, p1.z + endZ)
            val p2End = Point3(p2.x, p2.y, p2.z + endZ)
            
            // Side Face
            val sideFace = Face3D(listOf(p1Start, p2Start, p2End, p1End)).apply { parentFeatureId = id }
            faces.add(sideFace)
            
            lines.add(Line(p1Start, p2Start))
            lines.add(Line(p1End, p2End))
            lines.add(Line(p1Start, p1End))
            lines.add(Line(p2Start, p2End))
        }
        
        // Cap Faces
        val startVerts = baseGeoms.map { Point3(it.startPoint.x, it.startPoint.y, it.startPoint.z + startZ) }
        val endVerts = baseGeoms.map { Point3(it.startPoint.x, it.startPoint.y, it.startPoint.z + endZ) }
        
        if (startVerts.size >= 3) {
            faces.add(Face3D(startVerts).apply { parentFeatureId = id })
            faces.add(Face3D(endVerts).apply { parentFeatureId = id })
        }

        generatedGeometry = Solid3D(lines, faces)
    }
}
