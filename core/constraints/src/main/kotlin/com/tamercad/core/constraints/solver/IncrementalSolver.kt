package com.tamercad.core.constraints.solver


import java.util.UUID



/**
 * Incremental constraint solver.
 *
 * Only affected constraints are recalculated.
 */
class IncrementalSolver {



    private val dirtyConstraints =

        mutableSetOf<UUID>()




    /**
     * Marks constraint as changed.
     */
    fun markDirty(

        id:

            UUID

    ){

        dirtyConstraints.add(id)

    }





    /**
     * Returns dirty constraints.
     */
    fun getDirty():

            Set<UUID>{


        return dirtyConstraints.toSet()

    }





    /**
     * Clears solved constraints.
     */
    fun clear(){


        dirtyConstraints.clear()


    }



}