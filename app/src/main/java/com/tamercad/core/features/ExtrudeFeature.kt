package com.tamercad.core.features

import com.tamercad.core.geometry.Solid3D
import com.tamercad.core.sketch.SketchFeature
import java.util.UUID

/**
 * 2D Taslağı Z Ekseninde Yükselterek (Extrude) 3D Katı Model Oluşturan Özellik.
 */
class ExtrudeFeature(
    val sketch: SketchFeature,
    var depth: Double,
    override val name: String,
    override var id: String = UUID.randomUUID().toString()
) : IFeature {
    
    override val type: String = "ExtrudeFeature"
    override var isSuppressed: Boolean = false
    
    // C++ Kernelinin üzerine yazabilmesi için 'public var'
    var generatedGeometry: Solid3D? = null

    init {
        // Not: Önceden yazılmış olan B-Rep veya Vektörel Extrude hesaplama 
        // çekirdek kodlarınız (varsa) bu init bloğunda korunmaya devam etmelidir.
        evaluate() // Sınıf başlatıldığında hesaplamayı tetikle
    }

    // HATA DÜZELTİLDİ: IFeature 'evaluate' (Hesaplama) fonksiyonu eklendi
    override fun evaluate() {
        // İleride eklenecek C++ veya vektörel Extrude hesaplama mantığı 
        // burada çalıştırılmalıdır. Mevcut simülasyonları bozmamak adına 
        // arayüz kontratı (interface contract) sağlandı.
    }
}
