package com.tamercad.core.kernel


import java.util.UUID



/**
 * Base CAD object.
 *
 * Every object inside TamerCAD engine
 * must have a unique identifier.
 *
 * This class contains only identity
 * information and common metadata.
 */
abstract class CADObject {


    /**
     * Unique object identifier.
     */
    val id: String =

        UUID.randomUUID()
            .toString()



    /**
     * Object creation timestamp.
     */
    val createdAt: Long =

        System.currentTimeMillis()



    /**
     * Last modification timestamp.
     */
    private var modifiedAt: Long =

        createdAt



    /**
     * Object visibility state.
     */
    var visible: Boolean = true



    /**
     * Object name.
     */
    var name: String = ""



    /**
     * Updates modification time.
     */
    fun touch() {

        modifiedAt =

            System.currentTimeMillis()

    }



    /**
     * Returns modification timestamp.
     */
    fun getModifiedAt(): Long {

        return modifiedAt

    }



    /**
     * Debug information.
     */
    open fun debugInfo():

        Map<String, Any> {


        return mapOf(

            "id" to id,

            "name" to name,

            "visible" to visible,

            "createdAt" to createdAt,

            "modifiedAt" to modifiedAt

        )

    }


}