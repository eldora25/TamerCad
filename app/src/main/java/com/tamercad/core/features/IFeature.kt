package com.tamercad.core.features

/**
 * Parametrik modelleme sisteminin temel yapı taşı.
 * ADR-0015 (Feature System) standardına göre hazırlanmıştır.
 */
interface IFeature {
    val id: String
    val name: String
    val type: String
    var isSuppressed: Boolean
    
    fun evaluate() // Unsuru hesaplar/günceller
}
