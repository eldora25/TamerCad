package com.tamercad.core.constraints


import java.util.UUID



/**
 * Provides geometry access for solver.
 *
 * Constraint engine does not own geometry.
 * It only requests and modifies data through context.
 */
interface ConstraintContext {



    /**
     * Returns entity data.
     */
    fun getEntity(

        id: UUID

    ): Any?




    /**
     * Updates entity.
     */
    fun updateEntity(

        id: UUID,

        value: Any

    )



    /**
     * Check entity existence.
     */
    fun contains(

        id: UUID

    ): Boolean


}