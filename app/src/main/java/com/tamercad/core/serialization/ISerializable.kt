package com.tamercad.core.serialization

import org.json.JSONObject

/**
 * ADR-0012: Layered Serialization System
 * Yapısal proje verilerini JSON formatına çevirmek için temel arayüz.
 */
interface ISerializable {
    fun toJson(): JSONObject
}
