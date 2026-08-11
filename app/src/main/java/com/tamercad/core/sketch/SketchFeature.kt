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
import kotlin.math.*

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

        val lp = plane.worldToLocal(Vec3.fromPoint3(point))

        for (geom in geometries) {
            val dist = when (geom) {
                is SketchLine -> {
                    val dx = geom.end.x - geom.start.x; val dy = geom.end.y - geom.start.y
                    val l2 = dx*dx + dy*dy
                    if (l2 == 0.0) lp.distanceTo(geom.start)
                    else {
                        var t = ((lp.x - geom.start.x) * dx + (lp.y - geom.start.y) * dy) / l2
                        t = max(0.0, min(1.0, t))
                        lp.distanceTo(Vec2(geom.start.x + t * dx, geom.start.y + t * dy))
                    }
                }
                is SketchCircle -> {
                    abs(lp.distanceTo(geom.center) - geom.radius)
                }
                is SketchArc -> {
                    val d = lp.distanceTo(geom.center)
                    if (abs(d - geom.radius) < tolerance) {
                        val angle = atan2(lp.y - geom.center.y, lp.x - geom.center.x)
                        if (isAngleInArc(angle, geom.startAngle, geom.endAngle, geom.isClockwise)) abs(d - geom.radius)
                        else tolerance + 1.0
                    } else tolerance + 1.0
                }
                is SketchRect -> {
                    // Min distance to 4 segments
                    tolerance + 1.0 // Placeholder
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

    private fun isAngleInArc(a: Double, s: Double, e: Double, cw: Boolean): Boolean {
        fun norm(v: Double) = (v % (2 * PI) + (2 * PI)) % (2 * PI)
        val na = norm(a); val ns = norm(s); val ne = norm(e)
        return if (!cw) {
            if (ns <= ne) na in ns..ne else na >= ns || na <= ne
        } else {
            if (ne <= ns) na in ne..ns else na >= ne || na <= ns
        }
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
