package com.tamercad.core.constraints


import java.util.UUID



/**
 * Handles incremental constraint updates.
 */
class ConstraintUpdateService {



    private val dirty =

        mutableSetOf<UUID>()





    /**
     * Marks constraint for recalculation.
     */
    fun markDirty(

        id: UUID

    ){


        dirty.add(

            id

        )

    }





    /**
     * Returns pending updates.
     */
    fun pending():

            Set<UUID>{


        return dirty.toSet()

    }





    /**
     * Clears completed updates.
     */
    fun clear(){


        dirty.clear()

    }





    /**
     * Checks pending work.
     */
    fun hasPending():

            Boolean {


        return dirty.isNotEmpty()

    }


}