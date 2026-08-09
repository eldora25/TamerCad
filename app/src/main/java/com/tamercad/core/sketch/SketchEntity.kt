package com.tamercad.core.sketch

import com.tamercad.core.geometry.IGeometry
import com.tamercad.core.math.Vec2
import java.util.UUID

/**
 * TAMERCAD — AUTHORITATIVE SKETCH ENTITY MODEL
 * All geometric data stored in local plane coordinates (millimeters).
 */
sealed interface SketchEntity : IGeometry {
    override val id: String
}

data class SketchLine(
    val start: Vec2,
    val end: Vec2,
    override val id: String = UUID.randomUUID().toString()
) : SketchEntity {
    override val type: String = "SketchLine"
    override var isSelected: Boolean = false
    override var isFullyDefined: Boolean = false

    fun length(): Double = start.distanceTo(end)
}

data class SketchCircle(
    val center: Vec2,
    val radius: Double,
    override val id: String = UUID.randomUUID().toString()
) : SketchEntity {
    override val type: String = "SketchCircle"
    override var isSelected: Boolean = false
    override var isFullyDefined: Boolean = false
}

data class SketchArc(
    val center: Vec2,
    val radius: Double,
    val startAngle: Double, // Radians
    val endAngle: Double,   // Radians
    override val id: String = UUID.randomUUID().toString()
) : SketchEntity {
    override val type: String = "SketchArc"
    override var isSelected: Boolean = false
    override var isFullyDefined: Boolean = false
}

data class SketchRect(
    val p1: Vec2,
    val p2: Vec2,
    override val id: String = UUID.randomUUID().toString()
) : SketchEntity {
    override val type: String = "SketchRect"
    override var isSelected: Boolean = false
    override var isFullyDefined: Boolean = false
}
