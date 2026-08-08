package com.tamercad.core.constraints


import java.util.UUID



/**
 * Provides diagnostic information
 * about constraint problems.
 */
class ConstraintDiagnostics {



    private val messages =

        mutableMapOf<UUID, String>()





    /**
     * Adds diagnostic message.
     */
    fun report(

        id: UUID,

        message: String

    ) {


        messages[id] =

            message

    }





    /**
     * Removes diagnostic.
     */
    fun clear(

        id: UUID

    ) {


        messages.remove(id)

    }





    /**
     * Returns message.
     */
    fun get(

        id: UUID

    ):
    String? {


        return messages[id]

    }





    /**
     * Returns all diagnostics.
     */
    fun all():

            Map<UUID,String> {


        return messages.toMap()

    }





    /**
     * Clears diagnostics.
     */
    fun clearAll(){


        messages.clear()

    }


}