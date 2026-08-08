package com.tamercad.core.constraints


/**
 * Directed dependency graph used by the solver.
 *
 * Example:
 *
 * Point
 *  |
 *  v
 * Coincident Constraint
 *  |
 *  v
 * Line
 *
 * Circular dependencies are detected here.
 */
class ConstraintDependencyGraph {



    private val graph:

            MutableMap<String, MutableSet<String>> =

        mutableMapOf()



    /**
     * Adds dependency relation.
     *
     * @param from source node
     * @param to destination node
     */
    fun addDependency(

        from: String,

        to: String

    ) {


        graph

            .getOrPut(from) {

                mutableSetOf()

            }

            .add(to)

    }



    /**
     * Removes dependency.
     */
    fun removeDependency(

        from:String,

        to:String

    ) {


        graph[from]?.remove(to)

    }



    /**
     * Returns children of node.
     */
    fun getChildren(

        node:String

    ):

            Set<String> {


        return graph[node]

            ?: emptySet()

    }



    /**
     * Detects circular dependency.
     */
    fun hasCycle():

            Boolean {


        val visited =

            mutableSetOf<String>()


        val stack =

            mutableSetOf<String>()



        for (

            node in graph.keys

        ) {


            if (

                detectCycle(

                    node,

                    visited,

                    stack

                )

            ) {


                return true

            }

        }



        return false

    }





    private fun detectCycle(

        node:String,

        visited:MutableSet<String>,

        stack:MutableSet<String>

    ):

            Boolean {


        if (

            node in stack

        ) {


            return true

        }



        if (

            node in visited

        ) {


            return false

        }



        visited.add(node)

        stack.add(node)



        for (

            child in getChildren(node)

        ) {


            if (

                detectCycle(

                    child,

                    visited,

                    stack

                )

            ) {


                return true

            }

        }



        stack.remove(node)



        return false

    }



    /**
     * Clears graph.
     */
    fun clear() {


        graph.clear()

    }



    /**
     * Debug information.
     */
    fun debugInfo():

            Map<String, Set<String>> {


        return graph

            .mapValues {

                it.value.toSet()

            }

    }

}