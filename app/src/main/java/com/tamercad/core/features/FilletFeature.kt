package com.tamercad.core.features

import com.tamercad.core.geometry.Line
import java.util.UUID

/**
 * Belirli kenarları yuvarlatan (Fillet) özellik.
 */
class FilletFeature(
    val edgeIds: List<String>,
    var radius: Double,
    override val name: String = "Fillet",
    override var id: String = UUID.randomUUID().toString()
) : IFeature {
    
    override val type: String = "FilletFeature"
    override var isSuppressed: Boolean = false

    override fun evaluate() {
        // TODO: Kenar bazlı B-Rep yuvarlatma algoritması (Native Kernel tarafında çözülmeli)
    }
}
