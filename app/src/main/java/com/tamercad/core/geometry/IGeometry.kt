package com.tamercad.core.geometry

/**
 * Tüm geometrik nesnelerin türeyeceği temel arayüz.
 * ADR-0014 standardına göre hazırlanmıştır.
 */
interface IGeometry {
    val id: String
    val type: String
    
    // YENİ EKLENEN: Geometrinin o an kullanıcı tarafından seçilip seçilmediğini tutar
    var isSelected: Boolean 

    // YENİ EKLENEN: Kısıtlamaların tam olup olmadığı (Blueprints mantığı)
    var isFullyDefined: Boolean
}
