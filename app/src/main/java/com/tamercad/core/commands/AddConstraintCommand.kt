package com.tamercad.core.commands

import com.tamercad.core.constraints.IConstraint
import com.tamercad.core.sketch.SketchFeature

/**
 * Bir çizim unsuruna yeni bir kısıtlama (Constraint) ekleme komutu.
 * Undo/Redo altyapısını bozmamak için kullanılır.
 */
class AddConstraintCommand(
    private val sketch: SketchFeature,
    private val constraint: IConstraint
) : CadCommand {

    override fun execute() {
        sketch.addConstraint(constraint)
        sketch.evaluate() // Kısıtlama eklendiği anda geometriyi düzeltmesi için sistemi tetikle
    }

    override fun undo() {
        sketch.removeConstraint(constraint)
    }

    override fun name(): String {
        return "Add Constraint (${constraint.type})"
    }
}
