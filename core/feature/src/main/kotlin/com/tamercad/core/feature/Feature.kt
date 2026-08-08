package com.tamercad.core.feature


import com.tamercad.core.kernel.CADObject



/**
 * Base parametric CAD feature.
 *
 * Every modeling operation
 * is represented as a feature.
 */
abstract class Feature : CADObject() {



    /**
     * Feature category.
     */
    abstract val type:

        FeatureType



    /**
     * Feature parameters.
     */
    protected val parameters:

        MutableList<FeatureParameter> =

            mutableListOf()



    /**
     * Parent feature references.
     */
    val parents:

        MutableList<Feature> =

            mutableListOf()



    /**
     * Child features.
     */
    val children:

        MutableList<Feature> =

            mutableListOf()



    /**
     * Feature enabled state.
     */
    var enabled:Boolean = true



    /**
     * Suppressed state.
     */
    var suppressed:Boolean = false



    /**
     * Adds parameter.
     */
    fun addParameter(

        parameter:FeatureParameter

    ){

        parameters.add(

            parameter

        )

        touch()

    }




    /**
     * Reads parameter.
     */
    fun getParameter(

        key:String

    ):Any? {


        return parameters

            .firstOrNull {

                it.key == key

            }

            ?.value

    }




    /**
     * Regenerate feature geometry.
     */
    abstract fun regenerate()



    override fun debugInfo():

        Map<String,Any>{


        return super.debugInfo()

            +
            
            mapOf(

                "type" to type.name,

                "enabled" to enabled,

                "suppressed" to suppressed,

                "parameters" to parameters

            )


    }



}