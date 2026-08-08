package com.tamercad.core.constraints

import java.util.UUID



/**
 * Node inside constraint dependency graph.
 *
 * Each node represents one constraint.
 */
data class ConstraintNode(


    val id: UUID,



    val dependencies:

        MutableList<UUID> =

        mutableListOf()



)