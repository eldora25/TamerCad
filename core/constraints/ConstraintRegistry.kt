package com.tamercad.core.constraints


/**
 * Central storage for all active constraints.
 *
 * The registry does not solve constraints.
 * It only manages registration and lookup.
 */
class ConstraintRegistry {


    private val constraints:

            MutableMap<String, Constraint> =

        mutableMapOf()



    /**
     * Adds a new constraint.
     *
     * @param constraint constraint instance
     */
    fun register(

        constraint: Constraint

    ) {


        constraints[constraint.id] = constraint

    }



    /**
     * Removes constraint by id.
     */
    fun remove(

        id: String

    ) {


        constraints.remove(id)

    }



    /**
     * Finds constraint.
     */
    fun get(

        id: String

    ): Constraint? {


        return constraints[id]

    }



    /**
     * Returns all constraints.
     */
    fun getAll():

            List<Constraint> {


        return constraints.values.toList()

    }



    /**
     * Removes all constraints.
     */
    fun clear() {


        constraints.clear()

    }



    /**
     * Number of active constraints.
     */
    fun size():

            Int {


        return constraints.size

    }


}