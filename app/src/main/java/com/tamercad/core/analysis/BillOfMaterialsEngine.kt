package com.tamercad.core.analysis

import com.tamercad.core.assembly.Assembly3D

/**
 * Teknik Resim için Parça Listesi (BOM - Bill of Materials) ve İmalat Özeti Üreticisi.
 */
class BillOfMaterialsEngine {

    data class BomItem(val partNumber: String, val componentName: String, val quantity: Int, val material: String)

    fun generateBom(assembly: Assembly3D): List<BomItem> {
        val bomList = mutableListOf<BomItem>()
        assembly.components.forEachIndexed { index, comp ->
            bomList.add(
                BomItem(
                    partNumber = "TP-${1000 + index}",
                    componentName = comp.name,
                    quantity = 1,
                    material = "AISI 304 Stainless Steel"
                )
            )
        }
        return bomList
    }
}
