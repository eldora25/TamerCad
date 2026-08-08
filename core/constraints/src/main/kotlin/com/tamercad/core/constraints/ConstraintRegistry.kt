package com.tamercad.core.constraints

import java.util.UUID



/**
 * Stores all constraints in a CAD project.
 *
 * Constraint registry is responsible only
 * for storage and lookup.
 *
 * Solving is handled by ConstraintSolver.
 */
class ConstraintRegistry {



    private val constraints =
        mutableMapOf<UUID, Constraint>()




    /**
     * Registers a constraint.
     */
    fun register(

        constraint: Constraint

    ) {

        constraints[constraint.id] =
            constraint

    }





    /**
     * Removes a constraint.
     */
    fun remove(

        id: UUID

    ) {

        constraints.remove(id)

    }





    /**
     * Returns constraint by id.
     */
    fun get(

        id: UUID

    ): Constraint? {


        return constraints[id]

    }





    /**
     * Returns all constraints.
     */
    fun all():

            List<Constraint> {


        return constraints.values.toList()

    }





    /**
     * Removes all constraints.
     */
    fun clear(){

        constraints.clear()

    }





    /**
     * Number of constraints.
     */
    fun size():

            Int {


        return constraints.size

    }


}