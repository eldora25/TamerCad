package com.tamercad.core.constraints


import java.util.UUID



/**
 * Resolves constraint execution order.
 *
 * Uses dependency graph ordering.
 */
class DependencyResolver {



    /**
     * Creates execution order.
     */
    fun resolve(

        graph: ConstraintGraph

    ):

    List<UUID>{



        if(

            graph.hasCycle()

        ){

            throw IllegalStateException(

                "Circular constraint dependency detected"

            )

        }





        val result =
            mutableListOf<UUID>()



        val visited =
            mutableSetOf<UUID>()




        graph.all()

            .forEach{


                visit(

                    it.id,

                    graph,

                    visited,

                    result

                )

            }



        return result

    }






    private fun visit(

        id:UUID,

        graph:ConstraintGraph,

        visited:

            MutableSet<UUID>,

        result:

            MutableList<UUID>

    ){


        if(id in visited){

            return

        }



        visited.add(id)



        val node =
            graph.getNode(id)



        node
            ?.dependencies
            ?.forEach{


                visit(

                    it,

                    graph,

                    visited,

                    result

                )


            }





        result.add(id)

    }



}