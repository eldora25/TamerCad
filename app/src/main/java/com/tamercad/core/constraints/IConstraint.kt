package com.tamercad.core.constraints

import com.tamercad.core.serialization.ISerializable

/**
 * ADR-0016: Constraint Solver Architecture
 * Sistemdeki tüm geometrik kısıtlamaların (Paralellik, Uzunluk, Diklik vb.) temel arayüzü.
 */
interface IConstraint : ISerializable {
    val id: String
    val type: String
    
    /**
     * Kısıtlamayı çözer ve kendisine bağlı geometriyi günceller.
     * @return Kısıtlama başarıyla çözüldüyse true döndürür.
     */
    fun resolve(): Boolean
}
