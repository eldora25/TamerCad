package com.tamercad.core.commands

import com.tamercad.core.constraints.GCSManager
import com.tamercad.core.constraints.IConstraint
import com.tamercad.core.sketch.SketchFeature

/**
 * Bir çizim unsuruna yeni bir kısıtlama (Constraint) ekleme komutu.
 */
class AddConstraintCommand(
    private val sketch: SketchFeature,
    private val gcsManager: GCSManager,
    private val constraint: IConstraint
) : CadCommand {

    override fun execute() {
        sketch.addConstraint(constraint)
        gcsManager.addConstraint(constraint)
        sketch.evaluate() 
    }

    override fun undo() {
        sketch.removeConstraint(constraint)
        gcsManager.removeConstraint(constraint)
        sketch.evaluate()
    }

    override fun name(): String {
        return "Add Constraint (${constraint.type})"
    }
}
