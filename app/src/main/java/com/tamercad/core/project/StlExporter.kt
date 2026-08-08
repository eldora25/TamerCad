package com.tamercad.core.project

import android.content.Context
import android.os.Environment
import com.tamercad.core.assembly.Assembly3D
import com.tamercad.core.features.ExtrudeFeature
import com.tamercad.core.features.RevolveFeature
import java.io.File
import java.io.FileOutputStream
import java.util.Locale

/**
 * 3D Baskı ve İmalat için Yüksek Çözünürlüklü STL (Stereolithography) Dışa Aktarma Motoru.
 */
class StlExporter(private val context: Context) {

    fun exportAssemblyToStl(assembly: Assembly3D, fileName: String = "TamerCAD_3D_Print"): File? {
        return try {
            val documentsDir = context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS)
            if (documentsDir != null && !documentsDir.exists()) documentsDir.mkdirs()

            val stlFile = File(documentsDir, "$fileName.stl")

            FileOutputStream(stlFile).use { fos ->
                val writer = fos.bufferedWriter()
                writer.write("solid TamerCAD_Model\n")

                assembly.components.forEach { comp ->
                    comp.features.forEach { feat ->
                        val solid = when (feat) {
                            is ExtrudeFeature -> feat.generatedGeometry
                            is RevolveFeature -> feat.generatedGeometry
                            else -> null
                        }

                        solid?.faces?.forEach { face ->
                            if (face.vertices.size >= 3) {
                                val v0 = face.vertices[0]
                                val v1 = face.vertices[1]
                                val v2 = face.vertices[2]
                                val normal = face.normal()

                                writer.write(String.format(Locale.US, "  facet normal %.4f %.4f %.4f\n", normal.x, normal.y, normal.z))
                                writer.write("    outer loop\n")
                                writer.write(String.format(Locale.US, "      vertex %.4f %.4f %.4f\n", v0.x + comp.tx, v0.y + comp.ty, v0.z + comp.tz))
                                writer.write(String.format(Locale.US, "      vertex %.4f %.4f %.4f\n", v1.x + comp.tx, v1.y + comp.ty, v1.z + comp.tz))
                                writer.write(String.format(Locale.US, "      vertex %.4f %.4f %.4f\n", v2.x + comp.tx, v2.y + comp.ty, v2.z + comp.tz))
                                writer.write("    endloop\n  endfacet\n")
                            }
                        }
                    }
                }

                writer.write("endsolid TamerCAD_Model\n")
                writer.flush()
            }
            stlFile
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}
