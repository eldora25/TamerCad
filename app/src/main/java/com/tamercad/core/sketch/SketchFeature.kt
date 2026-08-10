package com.tamercad.core.sketch

import com.tamercad.core.features.IFeature
import com.tamercad.core.geometry.IGeometry
import com.tamercad.core.geometry.Line
import com.tamercad.core.constraints.IConstraint
import com.tamercad.core.serialization.ISerializable
import com.tamercad.core.math.*
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

import com.tamercad.core.geometry.Circle3D
import com.tamercad.core.geometry.Arc3D

import androidx.compose.runtime.mutableStateListOf

class SketchFeature(
    override val name: String = "Sketch",
    val plane: SketchPlane = SketchPlane.XY,
    override val id: String = UUID.randomUUID().toString()
) : IFeature, ISerializable {
    
    override val type: String = "SketchFeature"
    override var isSuppressed: Boolean = false
    
    private val geometries = mutableStateListOf<IGeometry>()
    private val constraints = mutableListOf<IConstraint>()
    
    fun addGeometry(geometry: IGeometry) { geometries.add(geometry) }
    fun removeGeometry(geometry: IGeometry) { geometries.remove(geometry) }
    fun getGeometries(): List<IGeometry> = geometries.toList()

    fun addConstraint(constraint: IConstraint) { constraints.add(constraint) }
    fun removeConstraint(constraint: IConstraint) { constraints.remove(constraint) }

    fun clearSelection() { geometries.forEach { it.isSelected = false } }

    // YENİ EKLENEN: Montaja aktarım sonrası ekranı yeni parça için temizler
    fun clearWorkspace() {
        geometries.clear()
        constraints.clear()
    }

    fun pickGeometry(point: Point3, tolerance: Double): IGeometry? {
        var closestGeometry: IGeometry? = null
        var minDistance = tolerance

        for (geom in geometries) {
            val dist = when (geom) {
                is SketchLine -> {
                    // Convert point to local for distance check if possible, or just use world logic
                    // SketchFeature knows its plane? Not yet explicitly stored in the feature itself.
                    // Assuming for now the pick is passed as a world point.
                    Line(geom.start.toPoint3(), geom.end.toPoint3()).distanceToPoint(point)
                }
                is SketchCircle -> {
                    // Distance to circle perimeter
                    val localPt = Vec3.fromPoint3(point) // Simplified: assuming pick point is on plane
                    // In reality, pick point is a world point.
                    val distToCenter = Vec2(geom.center.x, geom.center.y).distanceTo(Vec2(localPt.x, localPt.y))
                    kotlin.math.abs(distToCenter - geom.radius)
                }
                is Line -> geom.distanceToPoint(point)
                is Circle3D -> geom.distanceToPoint(point)
                is Arc3D -> geom.distanceToPoint(point)
                else -> tolerance + 1.0
            }
            if (dist <= minDistance) {
                minDistance = dist
                closestGeometry = geom
            }
        }
        return closestGeometry
    }

    override fun evaluate() {
        var iterations = 0
        val maxIterations = 5
        while (iterations < maxIterations) {
            var allResolved = true
            for (constraint in constraints) {
                if (!constraint.resolve()) allResolved = false
            }
            if (allResolved) break
            iterations++
        }
    }

    override fun toJson(): JSONObject {
        val json = JSONObject()
        json.put("id", id)
        json.put("name", name)
        json.put("type", type)
        
        val geomArray = JSONArray()
        geometries.forEach { if (it is ISerializable) geomArray.put(it.toJson()) }
        json.put("geometries", geomArray)
        
        return json
    }
}
