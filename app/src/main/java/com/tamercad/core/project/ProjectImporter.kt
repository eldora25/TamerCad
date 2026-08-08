package com.tamercad.core.project

import com.tamercad.core.assembly.Assembly3D
import com.tamercad.core.assembly.Component3D
import com.tamercad.core.features.ExtrudeFeature
import com.tamercad.core.features.RevolveFeature
import com.tamercad.core.geometry.Line
import com.tamercad.core.math.Point3
import com.tamercad.core.sketch.SketchFeature
import org.json.JSONObject
import java.util.UUID

class ProjectImporter {
    
    fun importFromJson(jsonString: String, targetAssembly: Assembly3D, targetSketch: SketchFeature) {
        try {
            val root = JSONObject(jsonString)
            
            targetAssembly.components.clear()
            targetAssembly.mates.clear()
            
            if (root.has("assembly")) {
                val assemblyJson = root.getJSONObject("assembly")
                targetAssembly.name = assemblyJson.optString("name", "Yüklenen Montaj")
                
                if (assemblyJson.has("components")) {
                    val compsArray = assemblyJson.getJSONArray("components")
                    for (i in 0 until compsArray.length()) {
                        val compJson = compsArray.getJSONObject(i)
                        val comp = Component3D(
                            name = compJson.optString("name", "Parça"),
                            id = compJson.optString("id", UUID.randomUUID().toString())
                        )
                        comp.tx = compJson.optDouble("tx", 0.0)
                        comp.ty = compJson.optDouble("ty", 0.0)
                        comp.tz = compJson.optDouble("tz", 0.0)
                        comp.updateTransform()
                        
                        if (compJson.has("features")) {
                            val featsArray = compJson.getJSONArray("features")
                            for (j in 0 until featsArray.length()) {
                                val featJson = featsArray.getJSONObject(j)
                                val featType = featJson.optString("type")
                                
                                val sketchJson = featJson.optJSONObject("baseSketch")
                                val baseSketch = SketchFeature("Base")
                                
                                if (sketchJson != null && sketchJson.has("geometries")) {
                                    val geomArray = sketchJson.getJSONArray("geometries")
                                    for (k in 0 until geomArray.length()) {
                                        val geomJson = geomArray.getJSONObject(k)
                                        if (geomJson.optString("type") == "Line") {
                                            val s = geomJson.getJSONObject("startPoint")
                                            val e = geomJson.getJSONObject("endPoint")
                                            val p1 = Point3(s.getDouble("x"), s.getDouble("y"), s.getDouble("z"))
                                            val p2 = Point3(e.getDouble("x"), e.getDouble("y"), e.getDouble("z"))
                                            baseSketch.addGeometry(Line(p1, p2, geomJson.optString("id")))
                                        }
                                    }
                                }
                                
                                if (featType == "ExtrudeFeature") {
                                    val depth = featJson.optDouble("depth", 100.0)
                                    val extrude = ExtrudeFeature(baseSketch, depth, featJson.optString("name", "Extrude"), featJson.optString("id", UUID.randomUUID().toString()))
                                    extrude.evaluate() 
                                    comp.features.add(extrude)
                                } else if (featType == "RevolveFeature") {
                                    val segments = featJson.optInt("segments", 16)
                                    val revolve = RevolveFeature(baseSketch, segments, featJson.optString("name", "Revolve"), featJson.optString("id", UUID.randomUUID().toString()))
                                    revolve.evaluate()
                                    comp.features.add(revolve)
                                }
                            }
                        }
                        targetAssembly.addComponent(comp)
                    }
                }
            }
            
            targetSketch.clearWorkspace()
            if (root.has("activeSketch")) {
                val sketchJson = root.getJSONObject("activeSketch")
                if (sketchJson.has("geometries")) {
                    val geomArray = sketchJson.getJSONArray("geometries")
                    for (i in 0 until geomArray.length()) {
                        val geomJson = geomArray.getJSONObject(i)
                        if (geomJson.optString("type") == "Line") {
                            val s = geomJson.getJSONObject("startPoint")
                            val e = geomJson.getJSONObject("endPoint")
                            val p1 = Point3(s.getDouble("x"), s.getDouble("y"), s.getDouble("z"))
                            val p2 = Point3(e.getDouble("x"), e.getDouble("y"), e.getDouble("z"))
                            targetSketch.addGeometry(Line(p1, p2, geomJson.optString("id")))
                        }
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
