package com.tamercad.core.feature



/**
 * Supported parametric feature types.
 */
enum class FeatureType {


    /**
     * 2D sketch.
     */
    SKETCH,


    /**
     * Linear extrusion.
     */
    EXTRUDE,


    /**
     * Revolved feature.
     */
    REVOLVE,


    /**
     * Sweep operation.
     */
    SWEEP,


    /**
     * Loft operation.
     */
    LOFT,


    /**
     * Edge rounding.
     */
    FILLET,


    /**
     * Edge bevel.
     */
    CHAMFER,


    /**
     * Mirror operation.
     */
    MIRROR,


    /**
     * Pattern operation.
     */
    PATTERN,


    /**
     * Shell operation.
     */
    SHELL,


    /**
     * Boolean union.
     */
    BOOLEAN_UNION,


    /**
     * Boolean subtraction.
     */
    BOOLEAN_DIFFERENCE,


    /**
     * Boolean intersection.
     */
    BOOLEAN_INTERSECTION


}