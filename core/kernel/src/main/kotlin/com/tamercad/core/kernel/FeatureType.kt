package com.tamercad.core.kernel


/**
 * Supported CAD feature types.
 *
 * New feature types can be added
 * without modifying existing architecture.
 */
enum class FeatureType {


    SKETCH,


    EXTRUDE,


    REVOLVE,


    SWEEP,


    LOFT,


    FILLET,


    CHAMFER,


    MIRROR,


    PATTERN,


    SHELL,


    BOOLEAN_UNION,


    BOOLEAN_DIFFERENCE,


    BOOLEAN_INTERSECTION


}