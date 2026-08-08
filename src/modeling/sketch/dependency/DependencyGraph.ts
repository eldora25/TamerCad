id="dependency_graph_ts"

import {


    DependencyNode,


    DependencyNodeType,


    DependencyState


}

from "./DependencyNode";







export class DependencyGraph {



    private nodes:

    Map<string, DependencyNode> =

    new Map();







    addNode(

        node:

        DependencyNode

    ):

    void {



        if(

            this.nodes.has(

                node.id

            )

        ){

            throw new Error(

                `Node already exists: ${node.id}`

            );

        }



        this.nodes.set(

            node.id,

            node

        );

    }







    removeNode(

        id:string

    ):

    boolean {



        const node =

        this.nodes.get(

            id

        );



        if(

            !node

        ){

            return false;

        }





        for(

            const dependency of

            node.getDependencies()

        ){



            node.removeDependency(

                dependency

            );

        }





        for(

            const dependent of

            node.getDependents()

        ){



            dependent.removeDependency(

                node

            );

        }





        return this.nodes.delete(

            id

        );

    }







    getNode(

        id:string

    ):

    DependencyNode|null {



        return (

            this.nodes.get(

                id

            )

            ??

            null

        );

    }







    hasNode(

        id:string

    ):

    boolean {



        return this.nodes.has(

            id

        );

    }







    connect(

        sourceId:string,


        targetId:string

    ):

    void {



        const source =

        this.getNode(

            sourceId

        );



        const target =

        this.getNode(

            targetId

        );





        if(

            !source ||

            !target

        ){

            throw new Error(

                "Dependency node missing"

            );

        }





        target.addDependency(

            source

        );



        if(

            this.hasCycle()

        ){



            target.removeDependency(

                source

            );



            throw new Error(

                "Dependency cycle detected"

            );

        }

    }







    disconnect(

        sourceId:string,


        targetId:string

    ):

    void {



        const source =

        this.getNode(

            sourceId

        );



        const target =

        this.getNode(

            targetId

        );



        if(

            source &&

            target

        ){



            target.removeDependency(

                source

            );

        }

    }







    getNodes():

    DependencyNode[] {



        return Array.from(

            this.nodes.values()

        );

    }







    getNodesByType(

        type:

        DependencyNodeType

    ):

    DependencyNode[] {



        return this.getNodes()

        .filter(

            node =>

            node.type === type

        );

    }







    markDirty(

        id:string

    ):

    void {



        const node =

        this.getNode(

            id

        );



        if(

            !node

        ){

            return;

        }





        const visited =

        new Set<string>();



        this.propagateDirty(

            node,

            visited

        );

    }







    private propagateDirty(

        node:

        DependencyNode,


        visited:

        Set<string>

    ):

    void {



        if(

            visited.has(

                node.id

            )

        ){

            return;

        }



        visited.add(

            node.id

        );



        node.markDirty();



        for(

            const child of

            node.getDependents()

        ){



            this.propagateDirty(

                child,

                visited

            );

        }

    }







    rebuildOrder():

    DependencyNode[] {



        const visited =

        new Set<string>();



        const result:

        DependencyNode[] = [];





        for(

            const node of

            this.nodes.values()

        ){



            this.visit(

                node,

                visited,

                result

            );

        }



        return result.reverse();

    }







    private visit(

        node:

        DependencyNode,


        visited:

        Set<string>,


        result:

        DependencyNode[]

    ):

    void {



        if(

            visited.has(

                node.id

            )

        ){

            return;

        }



        visited.add(

            node.id

        );





        for(

            const dependency of

            node.getDependencies()

        ){



            this.visit(

                dependency,

                visited,

                result

            );

        }





        result.push(

            node

        );

    }







    rebuild():

    void {



        const order =

        this.rebuildOrder();



        for(

            const node of

            order

        ){



            if(

                node.isDirty()

            ){



                node.update();

            }

        }

    }







    hasCycle():

    boolean {



        const visited =

        new Set<string>();


        const recursion =

        new Set<string>();





        for(

            const node of

            this.nodes.values()

        ){



            if(

                this.detectCycle(

                    node,

                    visited,

                    recursion

                )

            ){

                return true;

            }

        }



        return false;

    }







    private detectCycle(

        node:

        DependencyNode,


        visited:

        Set<string>,


        recursion:

        Set<string>

    ):

    boolean {



        if(

            recursion.has(

                node.id

            )

        ){

            return true;

        }



        if(

            visited.has(

                node.id

            )

        ){

            return false;

        }





        visited.add(

            node.id

        );



        recursion.add(

            node.id

        );





        for(

            const dependency of

            node.getDependencies()

        ){



            if(

                this.detectCycle(

                    dependency,

                    visited,

                    recursion

                )

            ){

                return true;

            }

        }





        recursion.delete(

            node.id

        );



        return false;

    }







    toJSON():

    object {



        return {


            nodes:

            this.getNodes()

            .map(

                node =>

                node.toJSON()

            )

        };

    }



}