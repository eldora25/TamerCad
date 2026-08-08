package com.tamercad.core.export

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import com.tamercad.core.assembly.Assembly3D
import com.tamercad.core.project.StlExporter
import java.io.File

/**
 * AR (Artırılmış Gerçeklik) ve PrusaSlicer Entegrasyon Köprüsü.
 */
class ArSlicerBridge(private val context: Context) {

    /**
     * Modeli AR uyumlu .usdz veya .glb formatına hazırlar ve önizleme intent'i tetikler.
     */
    fun launchArPreview(assembly: Assembly3D): Boolean {
        return try {
            val stlExporter = StlExporter(context)
            val stlFile = stlExporter.exportAssemblyToStl(assembly, "TamerCAD_AR_Model")
            
            if (stlFile != null && stlFile.exists()) {
                val uri: Uri = FileProvider.getUriForFile(
                    context,
                    "${context.packageName}.fileprovider",
                    stlFile
                )
                
                val intent = Intent(Intent.ACTION_VIEW).apply {
                    setDataAndType(uri, "model/stl")
                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                }
                context.startActivity(Intent.createChooser(intent, "AR / 3D Görüntüleyici ile Aç"))
                true
            } else {
                false
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    /**
     * Slicer (PrusaSlicer / Cura) yazılımlarına doğrudan STL veri köprüsü kurar.
     */
    fun sendToSlicer(assembly: Assembly3D): File? {
        val stlExporter = StlExporter(context)
        return stlExporter.exportAssemblyToStl(assembly, "TamerCAD_Slicer_Target")
    }
}
