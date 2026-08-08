package com.tamercad.core.kernel

import java.util.UUID


/**
 * Base interface for every parametric CAD feature.
 *
 * Every modeling operation in TamerCAD
 * must be represented as a feature.
 */
interface Feature {


    /**
     * Unique feature identifier.
     */
    val id: UUID


    /**
     * User visible feature name.
     */
    var name: String


    /**
     * Feature type identifier.
     */
    val type: FeatureType


    /**
     * Parent feature references.
     */
    val parents: MutableList<UUID>


    /**
     * Child feature references.
     */
    val children: MutableList<UUID>


    /**
     * Feature visibility.
     */
    var visible: Boolean


    /**
     * Feature enabled state.
     */
    var enabled: Boolean



    /**
     * Creation timestamp.
     */
    val createdAt: Long



    /**
     * Last modification timestamp.
     */
    var modifiedAt: Long



    /**
     * Feature parameters.
     */
    val parameters: MutableMap<String, Any>



    /**
     * Regenerate geometry.
     */
    fun regenerate()



    /**
     * Validate feature.
     */
    fun validate(): FeatureValidationResult



    /**
     * Serialize feature.
     */
    fun serialize(): Map<String, Any>

}