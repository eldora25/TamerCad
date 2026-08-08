package com.tamercad.core.constraints

/**
 * Defines supported geometric constraint types.
 *
 * Constraint types describe relationships
 * between sketch entities.
 */
enum class ConstraintType {

    /**
     * Forces two points to share the same position.
     */
    COINCIDENT,


    /**
     * Forces a line to remain horizontal.
     */
    HORIZONTAL,


    /**
     * Forces a line to remain vertical.
     */
    VERTICAL,


    /**
     * Forces two lines to have the same direction.
     */
    PARALLEL,


    /**
     * Forces two lines to intersect at 90 degrees.
     */
    PERPENDICULAR,


    /**
     * Forces a curve to touch another curve.
     */
    TANGENT,


    /**
     * Forces two entities to have equal parameters.
     */
    EQUAL,


    /**
     * Forces circles/arcs to share the same center.
     */
    CONCENTRIC,


    /**
     * Forces a point to stay at the center of a segment.
     */
    MIDPOINT,


    /**
     * Locks geometry position.
     */
    FIXED,


    /**
     * Creates symmetric geometry relation.
     */
    SYMMETRY

}