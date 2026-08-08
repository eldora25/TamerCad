package com.tamercad.core.commands

import com.tamercad.core.geometry.IGeometry
import com.tamercad.core.sketch.SketchFeature

/**
 * Bir çizim unsurundan (SketchFeature) geometri silme komutu.
 * ADR-0013: Command System Architecture standartlarına uygundur.
 */
class RemoveGeometryCommand(
    private val sketch: SketchFeature,
    private val geometry: IGeometry
) : CadCommand {

    override fun execute() {
        sketch.removeGeometry(geometry)
    }

    override fun undo() {
        // Silinen geometriyi (tüm özellikleri ve sınırlandırmalarıyla) geri ekler
        sketch.addGeometry(geometry)
    }

    override fun name(): String {
        return "Remove Geometry (${geometry.type})"
    }
}
