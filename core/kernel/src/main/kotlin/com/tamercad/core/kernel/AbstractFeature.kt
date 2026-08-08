package com.tamercad.core.kernel

import java.util.UUID



/**
 * Default implementation
 * for common feature behavior.
 */
abstract class AbstractFeature(

    override val id: UUID = UUID.randomUUID(),


    override var name: String,


    override val type: FeatureType


) : Feature {



    override val parents =
        mutableListOf<UUID>()



    override val children =
        mutableListOf<UUID>()



    override var visible =
        true



    override var enabled =
        true



    override val createdAt =
        System.currentTimeMillis()



    override var modifiedAt =
        System.currentTimeMillis()



    override val parameters =
        mutableMapOf<String, Any>()





    override fun validate():

            FeatureValidationResult {


        if(!enabled){

            return FeatureValidationResult.NeedsUpdate

        }


        return FeatureValidationResult.Valid

    }





    override fun serialize():

            Map<String, Any>{


        return mapOf(

            "id" to id.toString(),

            "name" to name,

            "type" to type.name,

            "visible" to visible,

            "enabled" to enabled,

            "createdAt" to createdAt,

            "modifiedAt" to modifiedAt,

            "parameters" to parameters

        )

    }


}