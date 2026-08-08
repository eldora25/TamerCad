package com.tamercad.core.commands

import com.tamercad.core.assembly.Assembly3D
import com.tamercad.core.assembly.Component3D

/**
 * Montaja (Assembly) yeni bir parça (Component) ekleme komutu.
 */
class AddComponentCommand(
    private val assembly: Assembly3D,
    private val component: Component3D
) : CadCommand {

    override fun execute() {
        assembly.addComponent(component)
    }

    override fun undo() {
        assembly.removeComponent(component)
    }

    override fun name(): String = "Add Component (${component.name})"
}
