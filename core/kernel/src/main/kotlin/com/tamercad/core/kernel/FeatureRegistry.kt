package com.tamercad.core.kernel


import java.util.UUID



/**
 * Stores all project features.
 */
class FeatureRegistry {



    private val features =
        mutableMapOf<UUID, Feature>()





    fun register(

        feature: Feature

    ){


        features[feature.id] =
            feature

    }





    fun remove(

        id: UUID

    ){


        features.remove(id)

    }





    fun get(

        id: UUID

    ):

    Feature? {


        return features[id]

    }





    fun all():

    List<Feature>{


        return features.values.toList()

    }





    fun clear(){


        features.clear()

    }



}