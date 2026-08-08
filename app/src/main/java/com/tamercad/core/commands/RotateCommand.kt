package com.tamercad.core.commands

import com.tamercad.core.assembly.Component3D
import com.tamercad.core.math.Matrix4

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Bir bileşeni veya geometriyi 3D uzayda döndüren komut.
 */
class RotateCommand(
    private val component: Component3D,
    private val rotationMatrix: Matrix4
) : CadCommand {

    private val oldTransform = component.transform.clone()

    override fun execute() {
        // Mevcut transformu rotasyon matrisi ile çarp
        component.transform = component.transform.multiply(rotationMatrix)
        // Not: tx, ty, tz değerlerini de güncellemek gerekebilir eğer transformu onlardan çekiyorsak
    }

    override fun undo() {
        component.transform = oldTransform
    }

    override fun name(): String = "Rotate ${component.name}"
}
