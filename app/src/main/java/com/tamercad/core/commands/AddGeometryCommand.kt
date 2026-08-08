package com.tamercad.core.commands

import com.tamercad.core.geometry.IGeometry
import com.tamercad.core.sketch.SketchFeature

/**
 * Bir çizim unsuruna (SketchFeature) yeni bir geometri ekleme komutu.
 * ADR-0013: Command System Architecture standartlarına uygundur.
 */
class AddGeometryCommand(
    private val sketch: SketchFeature,
    private val geometry: IGeometry
) : CadCommand {

    override fun execute() {
        sketch.addGeometry(geometry)
    }

    override fun undo() {
        sketch.removeGeometry(geometry)
    }

    override fun name(): String {
        return "Add Geometry (${geometry.type})"
    }
}
