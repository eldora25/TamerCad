package com.tamercad.core.constraints


/**
 * Supported CAD constraint types.
 *
 * New constraints can be added
 * without changing solver architecture.
 */
enum class ConstraintType {


    COINCIDENT,


    HORIZONTAL,


    VERTICAL,


    PARALLEL,


    PERPENDICULAR,


    TANGENT,


    EQUAL,


    CONCENTRIC,


    MIDPOINT,


    FIXED,


    SYMMETRY,


    OFFSET,


    CURVATURE,


    PATTERN_REFERENCE


}