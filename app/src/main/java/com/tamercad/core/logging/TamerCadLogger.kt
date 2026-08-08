package com.tamercad.core.logging

import android.util.Log
import org.json.JSONObject

/**
 * ADR-0022: Logging & Monitoring Architecture
 * TamerCAD bileşenleri için merkezi ve yapısal günlükleme (Structured Logging) altyapısı.
 */
object TamerCadLogger {

    enum class LogLevel {
        TRACE, DEBUG, INFO, WARNING, ERROR, FATAL
    }

    fun log(module: String, level: LogLevel, message: String, objectId: String? = null) {
        val jsonLog = JSONObject().apply {
            put("timestamp", System.currentTimeMillis())
            put("module", module)
            put("level", level.name)
            put("message", message)
            if (objectId != null) {
                put("context", JSONObject().apply { put("objectId", objectId) })
            }
        }
        
        val tag = "TamerCAD_$module"
        val logMessage = jsonLog.toString()

        when (level) {
            LogLevel.TRACE, LogLevel.DEBUG -> Log.d(tag, logMessage)
            LogLevel.INFO -> Log.i(tag, logMessage)
            LogLevel.WARNING -> Log.w(tag, logMessage)
            LogLevel.ERROR, LogLevel.FATAL -> Log.e(tag, logMessage)
        }
    }
}
