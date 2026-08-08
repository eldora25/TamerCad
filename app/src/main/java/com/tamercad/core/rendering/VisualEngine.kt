package com.tamercad.core.rendering

import androidx.compose.ui.graphics.Color

/**
 * Gelişmiş Görselleştirme ve Yüzey Analizi Motoru (Zebra Shading & Material Library).
 */
object VisualEngine {

    enum class MaterialType(val displayName: String, val baseColor: Color) {
        POLISHED_ALUMINUM("Parlak Alüminyum", Color(0xFFDCDCDC)),
        MATTE_PLASTIC("Mat Siyah Plastik", Color(0xFF282828)),
        WALNUT_WOOD("Ceviz Ahşap", Color(0xFF8B5A2B)),
        GOLD("Altın Kaplama", Color(0xFFFFD700)),
        TRANSPARENT_GLASS("Cam", Color(0x88E0FFFF))
    }

    enum class AnalysisMode {
        NONE, ZEBRA_STRIPES, CURVATURE_MAP
    }
}
