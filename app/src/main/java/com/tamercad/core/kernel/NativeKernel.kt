package com.tamercad.core.kernel

import com.tamercad.core.geometry.Face3D
import com.tamercad.core.geometry.Line
import com.tamercad.core.geometry.Solid3D
import com.tamercad.core.math.Point3

/**
 * TamerCAD Yüksek Performanslı C++ (Native NDK) Çekirdek ve Matris Köprüsü.
 */
object NativeKernel {

    init {
        try {
            System.loadLibrary("tamercad_kernel")
        } catch (e: UnsatisfiedLinkError) {
            e.printStackTrace()
        }
    }

    private external fun executeFilletNative(vertices: FloatArray, radius: Float): FloatArray
    private external fun executeBooleanUnionNative(body1: FloatArray, body2: FloatArray): FloatArray
    private external fun executeBooleanSubtractNative(body1: FloatArray, body2: FloatArray): FloatArray
    // YENİ JNI KÖPRÜLERİ
    private external fun executeMirrorNative(vertices: FloatArray, axisX: Float, axisY: Float, axisZ: Float): FloatArray
    private external fun executePatternNative(vertices: FloatArray, count: Int, spaceX: Float, spaceY: Float, spaceZ: Float): FloatArray
    private external fun executePushPullNative(vertices: FloatArray, faceIndex: Int, distance: Float): FloatArray

    fun applyPushPull(solid: Solid3D, faceIndex: Int, distance: Double): Solid3D {
        return try {
            val vertexList = mutableListOf<Float>()
            solid.faces.forEach { face -> face.vertices.forEach { v ->
                vertexList.add(v.x.toFloat()); vertexList.add(v.y.toFloat()); vertexList.add(v.z.toFloat())
            }}
            val processedVerts = executePushPullNative(vertexList.toFloatArray(), faceIndex, distance.toFloat())
            rebuildSolid(solid, processedVerts)
        } catch (e: Exception) { solid }
    }

    fun applyTransform(solid: Solid3D, deltaX: Double, deltaY: Double, deltaZ: Double): Solid3D {
        val newFaces = solid.faces.map { face ->
            val movedVerts = face.vertices.map { v ->
                Point3(v.x + deltaX, v.y + deltaY, v.z + deltaZ)
            }
            Face3D(movedVerts)
        }
        val newLines = solid.lines.map { line ->
            Line(
                Point3(line.startPoint.x + deltaX, line.startPoint.y + deltaY, line.startPoint.z + deltaZ),
                Point3(line.endPoint.x + deltaX, line.endPoint.y + deltaY, line.endPoint.z + deltaZ)
            )
        }
        return Solid3D(newLines, newFaces)
    }

    fun applyFillet(solid: Solid3D, radius: Double): Solid3D {
        return try {
            val vertexList = mutableListOf<Float>()
            solid.faces.forEach { face -> face.vertices.forEach { v ->
                vertexList.add(v.x.toFloat()); vertexList.add(v.y.toFloat()); vertexList.add(v.z.toFloat())
            }}
            val processedVerts = executeFilletNative(vertexList.toFloatArray(), radius.toFloat())
            rebuildSolid(solid, processedVerts)
        } catch (e: Exception) { solid }
    }

    fun applyBoolean(solid1: Solid3D, solid2: Solid3D, isUnion: Boolean): Solid3D {
        return try {
            val v1 = mutableListOf<Float>()
            solid1.faces.forEach { face -> face.vertices.forEach { v -> v1.add(v.x.toFloat()); v1.add(v.y.toFloat()); v1.add(v.z.toFloat()) }}
            val v2 = mutableListOf<Float>()
            solid2.faces.forEach { face -> face.vertices.forEach { v -> v2.add(v.x.toFloat()); v2.add(v.y.toFloat()); v2.add(v.z.toFloat()) }}

            val processedVerts = if (isUnion) {
                executeBooleanUnionNative(v1.toFloatArray(), v2.toFloatArray())
            } else {
                executeBooleanSubtractNative(v1.toFloatArray(), v2.toFloatArray())
            }
            rebuildSolid(solid1, processedVerts)
        } catch (e: Exception) { solid1 }
    }

    // YENİ: Kotlin Aynalama Bağlantısı
    fun applyMirror(solid: Solid3D, axisX: Float, axisY: Float, axisZ: Float): Solid3D {
        return try {
            val vertexList = mutableListOf<Float>()
            solid.faces.forEach { face -> face.vertices.forEach { v ->
                vertexList.add(v.x.toFloat()); vertexList.add(v.y.toFloat()); vertexList.add(v.z.toFloat())
            }}
            val processedVerts = executeMirrorNative(vertexList.toFloatArray(), axisX, axisY, axisZ)
            rebuildSolid(solid, processedVerts)
        } catch (e: Exception) { solid }
    }

    // YENİ: Kotlin Çoklu Çoğaltma Bağlantısı
    fun applyLinearPattern(solid: Solid3D, count: Int, spaceX: Float, spaceY: Float, spaceZ: Float): Solid3D {
        return try {
            val vertexList = mutableListOf<Float>()
            solid.faces.forEach { face -> face.vertices.forEach { v ->
                vertexList.add(v.x.toFloat()); vertexList.add(v.y.toFloat()); vertexList.add(v.z.toFloat())
            }}
            val processedVerts = executePatternNative(vertexList.toFloatArray(), count, spaceX, spaceY, spaceZ)
            rebuildSolid(solid, processedVerts) // Solid'in kendisini büyütür
        } catch (e: Exception) { solid }
    }

    private fun rebuildSolid(originalSolid: Solid3D, processedVerts: FloatArray): Solid3D {
        val newFaces = mutableListOf<Face3D>()
        val currentFaceVerts = mutableListOf<Point3>()
        for (i in processedVerts.indices step 3) {
            currentFaceVerts.add(Point3(processedVerts[i].toDouble(), processedVerts[i+1].toDouble(), processedVerts[i+2].toDouble()))
            if (currentFaceVerts.size == 4) {
                newFaces.add(Face3D(currentFaceVerts.toList()))
                currentFaceVerts.clear()
            }
        }
        return Solid3D(originalSolid.lines, newFaces)
    }
}
