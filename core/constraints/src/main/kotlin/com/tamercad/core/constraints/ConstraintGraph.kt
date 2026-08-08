package com.tamercad.core.constraints


import java.util.UUID



/**
 * Directed dependency graph for constraints.
 *
 * Example:
 *
 * Coincident
 *      |
 *      v
 * Horizontal
 *      |
 *      v
 * Parallel
 *
 */
class ConstraintGraph {



    private val nodes =
        mutableMapOf<UUID, ConstraintNode>()




    /**
     * Adds constraint node.
     */
    fun addNode(

        node: ConstraintNode

    ){

        nodes[node.id] =
            node

    }





    /**
     * Removes node.
     */
    fun removeNode(

        id: UUID

    ){

        nodes.remove(id)

    }





    /**
     * Adds dependency.
     */
    fun addDependency(

        from: UUID,

        to: UUID

    ){


        nodes[from]
            ?.dependencies
            ?.add(to)


    }





    /**
     * Gets node.
     */
    fun getNode(

        id: UUID

    ):

            ConstraintNode? {


        return nodes[id]

    }





    /**
     * Returns all nodes.
     */
    fun all():

            List<ConstraintNode>{

        return nodes.values.toList()

    }





    /**
     * Detects circular dependencies.
     */
    fun hasCycle():

            Boolean {


        val visited =
            mutableSetOf<UUID>()


        val stack =
            mutableSetOf<UUID>()



        for(node in nodes.keys){


            if(
                detectCycle(

                    node,

                    visited,

                    stack

                )

            ){

                return true

            }

        }



        return false

    }





    private fun detectCycle(

        id:UUID,

        visited:

            MutableSet<UUID>,

        stack:

            MutableSet<UUID>

    ):
    Boolean {


        if(id in stack){

            return true

        }



        if(id in visited){

            return false

        }




        visited.add(id)

        stack.add(id)




        val node =
            nodes[id]




        node
            ?.dependencies
            ?.forEach{


                if(

                    detectCycle(

                        it,

                        visited,

                        stack

                    )

                ){

                    return true

                }

            }





        stack.remove(id)



        return false

    }


}