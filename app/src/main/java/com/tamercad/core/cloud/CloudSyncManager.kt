package com.tamercad.core.cloud

import android.content.Context
import android.os.Environment
import java.io.File
import java.io.FileOutputStream

/**
 * Firebase Bulut Senkronizasyonu ve 5 Cihaz Çoklu Oturum (Multi-Device) Yöneticisi.
 */
class CloudSyncManager(private val context: Context) {

    companion object {
        private const val MAX_DEVICE_LIMIT = 5
        var firebaseUrl: String = "https://tamercad-default-rtdb.firebaseio.com"
        var firebaseApiKey: String = "AIzaSyDefaultKeyTamerCad"
    }

    fun validateDeviceSession(activeDevicesCount: Int): Boolean {
        return activeDevicesCount <= MAX_DEVICE_LIMIT
    }

    fun configureFirebaseCredentials(url: String, apiKey: String) {
        if (url.isNotBlank()) firebaseUrl = url
        if (apiKey.isNotBlank()) firebaseApiKey = apiKey
    }

    fun syncProjectToCloud(projectName: String, jsonContent: String): Boolean {
        return try {
            val cloudDir = File(context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), "TamerCAD_Cloud_Sync")
            if (!cloudDir.exists()) cloudDir.mkdirs()

            val cloudFile = File(cloudDir, "$projectName.json")
            FileOutputStream(cloudFile).use { fos ->
                fos.write(jsonContent.toByteArray())
                fos.flush()
            }
            // Firebase REST / Firestore entegrasyon uç nokta simülasyonu (Config: $firebaseUrl)
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}
