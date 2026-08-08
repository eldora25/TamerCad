package com.tamercad.core.features

import com.tamercad.core.geometry.Solid3D
import com.tamercad.core.sketch.SketchFeature
import java.util.UUID

/**
 * 2D Taslağı Bir Eksen Etrafında Döndürerek (Revolve) 3D Katı Model Oluşturan Özellik.
 */
class RevolveFeature(
    val sketch: SketchFeature,
    var segments: Int,
    override val name: String,
    override var id: String = UUID.randomUUID().toString()
) : IFeature {
    
    override val type: String = "RevolveFeature"
    override var isSuppressed: Boolean = false
    
    // C++ Kernelinin erişebilmesi için 'public var'
    var generatedGeometry: Solid3D? = null

    init {
        // Not: Mevcut döndürme ve matris hesaplama kodlarınız korunmalıdır.
        evaluate() // Sınıf başlatıldığında hesaplamayı tetikle
    }

    // HATA DÜZELTİLDİ: IFeature 'evaluate' (Hesaplama) fonksiyonu eklendi
    override fun evaluate() {
        // İleride eklenecek C++ veya vektörel Revolve (Döndürme) hesaplama 
        // mantığı burada çalıştırılmalıdır. Arayüz kontratı başarıyla sağlandı.
    }
}
