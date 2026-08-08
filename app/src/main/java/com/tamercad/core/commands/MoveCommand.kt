package com.tamercad.core.commands

import com.tamercad.core.assembly.Component3D
import com.tamercad.core.math.Vector3

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Bir bileşeni veya geometriyi 3D uzayda öteleyen (Translate) komut.
 */
class MoveCommand(
    private val component: Component3D,
    private val delta: Vector3
) : CadCommand {

    override fun execute() {
        component.tx += delta.x
        component.ty += delta.y
        component.tz += delta.z
        component.updateTransform()
    }

    override fun undo() {
        component.tx -= delta.x
        component.ty -= delta.y
        component.tz -= delta.z
        component.updateTransform()
    }

    override fun name(): String = "Move ${component.name}"
}
