package com.tamercad.core.project

import android.content.Context
import android.os.Environment
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import java.util.zip.ZipOutputStream

class ProjectFileManager(private val context: Context) {

    fun saveProjectAsTcad(jsonContent: String, projectName: String): File? {
        return try {
            val documentsDir = context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS)
            if (documentsDir != null && !documentsDir.exists()) {
                documentsDir.mkdirs()
            }

            val tcadFile = File(documentsDir, "$projectName.tcad")
            
            FileOutputStream(tcadFile).use { fos ->
                ZipOutputStream(fos).use { zos ->
                    zos.putNextEntry(ZipEntry("project.json"))
                    zos.write(jsonContent.toByteArray())
                    zos.closeEntry()
                }
            }
            tcadFile
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    // YENİ EKLENEN: Fiziksel dosyayı okuyup JSON metnini çıkaran fonksiyon
    fun loadProjectFromTcad(projectName: String): String? {
        return try {
            val documentsDir = context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS)
            val tcadFile = File(documentsDir, "$projectName.tcad")
            
            if (!tcadFile.exists()) return null
            
            var jsonContent: String? = null
            
            FileInputStream(tcadFile).use { fis ->
                ZipInputStream(fis).use { zis ->
                    var entry = zis.nextEntry
                    while (entry != null) {
                        if (entry.name == "project.json") {
                            jsonContent = zis.bufferedReader().readText()
                            break
                        }
                        entry = zis.nextEntry
                    }
                }
            }
            jsonContent
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}
