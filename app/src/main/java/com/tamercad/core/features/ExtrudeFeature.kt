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
        
        // Basitleştirilmiş Extrude: Taslağı kopyala ve yükselt
        baseGeoms.forEach { line ->
            val p1 = line.startPoint
            val p2 = line.endPoint
            val p1Up = Point3(p1.x, p1.y, p1.z + depth)
            val p2Up = Point3(p2.x, p2.y, p2.z + depth)
            
            // Yan Yüzey (Side Face)
            val sideFace = Face3D(listOf(p1, p2, p2Up, p1Up)).apply { parentFeatureId = id }
            faces.add(sideFace)
            
            lines.add(Line(p1, p2))
            lines.add(Line(p1Up, p2Up))
            lines.add(Line(p1, p1Up))
            lines.add(Line(p2, p2Up))
        }
        
        // Üst Yüzey (Cap Face)
        val capVerts = baseGeoms.map { Point3(it.startPoint.x, it.startPoint.y, it.startPoint.z + depth) }
        if (capVerts.size >= 3) {
            faces.add(Face3D(capVerts).apply { parentFeatureId = id })
        }

        generatedGeometry = Solid3D(lines, faces).apply { 
            // parentFeatureId gibi bir alan Solid3D'de yok ama hiyerarşi için eklenebilir
        }
    }
}
