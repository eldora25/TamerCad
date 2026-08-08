package com.tamercad.core.project

import com.tamercad.core.assembly.Assembly3D
import com.tamercad.core.sketch.SketchFeature
import org.json.JSONObject

class ProjectExporter {
    fun exportToJson(assembly: Assembly3D, activeSketch: SketchFeature): String {
        val manifest = JSONObject().apply {
            put("SchemaVersion", "0.2.0")
            put("ProjectVersion", "0.1.0-alpha")
            put("Application", "TamerCAD")
        }
        
        val projectContainer = JSONObject().apply {
            put("manifest", manifest)
            // Tüm montaj ve bileşenleri hiyerarşik olarak kaydet
            put("assembly", assembly.toJson())
            put("activeSketch", activeSketch.toJson())
        }
        
        return projectContainer.toString(4)
    }
}
