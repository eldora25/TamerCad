package com.tamercad.core.features

import java.util.UUID

/**
 * Belirli kenarlara pah kıran (Chamfer) özellik.
 */
class ChamferFeature(
    val edgeIds: List<String>,
    var distance: Double,
    override val name: String = "Chamfer",
    override var id: String = UUID.randomUUID().toString()
) : IFeature {
    
    override val type: String = "ChamferFeature"
    override var isSuppressed: Boolean = false

    override fun evaluate() {
        // TODO: Kenar bazlı B-Rep pah kırma algoritması
    }
}
