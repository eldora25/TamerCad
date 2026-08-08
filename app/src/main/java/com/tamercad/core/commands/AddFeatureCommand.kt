package com.tamercad.core.commands

import com.tamercad.core.features.IFeature

/**
 * CAD ortamına yeni bir 3D Unsur (Örn: Extrude) ekleme komutu.
 */
class AddFeatureCommand(
    private val featureList: MutableList<IFeature>,
    private val feature: IFeature
) : CadCommand {
    
    override fun execute() {
        feature.evaluate() // Unsuru hesapla ve geometriyi üret
        featureList.add(feature)
    }

    override fun undo() {
        featureList.remove(feature)
    }

    override fun name(): String = "Add Feature (${feature.name})"
}
