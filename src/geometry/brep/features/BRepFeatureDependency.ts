
import {

    BRepFeature

}

from "./BRepFeature";





export interface DependencyNode {


    featureId:string;


    parents:string[];


    children:string[];


}





export interface DependencyResult {


    valid:boolean;


    order:string[];


    cycles:string[][];


}





export class BRepFeatureDependency {



    nodes:Map<string,DependencyNode>;


    cache:Map<string,string[]>;





    constructor(){



        this.nodes=

            new Map();



        this.cache=

            new Map();


    }





    /**
     * Feature node oluştur
     */
    registerFeature(

        feature:BRepFeature

    ){



        if(

            !this.nodes.has(feature.id)

        ){



            this.nodes.set(

                feature.id,

                {


                    featureId:

                        feature.id,


                    parents:[],


                    children:[]


                }

            );


        }


    }





    /**
     * Dependency ekle
     */
    addDependency(

        parentId:string,

        childId:string

    ){



        const parent=

            this.nodes.get(

                parentId

            );



        const child=

            this.nodes.get(

                childId

            );



        if(

            !parent ||

            !child

        ){

            throw new Error(

                "Dependency node missing"

            );

        }





        if(

            !parent.children.includes(

                childId

            )

        ){


            parent.children.push(

                childId

            );


        }





        if(

            !child.parents.includes(

                parentId

            )

        ){


            child.parents.push(

                parentId

            );


        }



        this.invalidateCache();

    }





    /**
     * Dependency sil
     */
    removeDependency(

        parentId:string,

        childId:string

    ){



        const parent=

            this.nodes.get(

                parentId

            );



        const child=

            this.nodes.get(

                childId

            );



        if(

            parent

        ){



            parent.children=

                parent.children.filter(

                    id=>

                    id!==childId

                );

        }



        if(

            child

        ){



            child.parents=

                child.parents.filter(

                    id=>

                    id!==parentId

                );


        }



        this.invalidateCache();


    }





    /**
     * Parent getir
     */
    getParents(

        featureId:string

    ){



        return (

            this.nodes.get(

                featureId

            )

        )?.parents || [];


    }





    /**
     * Child getir
     */
    getChildren(

        featureId:string

    ){



        return (

            this.nodes.get(

                featureId

            )

        )?.children || [];


    }





    /**
     * Recursive dependency
     */
    collectDependencies(

        featureId:string,

        visited:Set<string>=new Set()

    ):string[]{



        if(

            visited.has(

                featureId

            )

        ){

            return [];

        }



        visited.add(

            featureId

        );



        const result:string[]=[];



        const parents=

            this.getParents(

                featureId

            );



        for(

            const parent of parents

        ){



            result.push(

                parent

            );



            result.push(

                ...

                this.collectDependencies(

                    parent,

                    visited

                )

            );


        }



        return result;


    }





    /**
     * Cycle detection
     */
    detectCycles(){



        const cycles:string[][]=[];


        const visiting=

            new Set<string>();


        const visited=

            new Set<string>();





        const visit=(id:string,path:string[])=>{



            if(

                visiting.has(id)

            ){



                const index=

                    path.indexOf(id);



                cycles.push(

                    path.slice(

                        index

                    )

                );



                return;

            }





            if(

                visited.has(id)

            ){

                return;

            }





            visiting.add(id);



            const node=

                this.nodes.get(id);



            for(

                const child of

                node?.children || []

            ){



                visit(

                    child,

                    [

                        ...path,

                        child

                    ]

                );


            }



            visiting.delete(id);


            visited.add(id);



        };





        for(

            const id of this.nodes.keys()

        ){



            visit(

                id,

                [id]

            );


        }



        return cycles;


    }





    /**
     * Build sırası
     */
    getBuildOrder(){



        const order:string[]=[];


        const visited=

            new Set<string>();





        const visit=(id:string)=>{



            if(

                visited.has(id)

            ){

                return;

            }



            visited.add(id);



            const node=

                this.nodes.get(id);



            for(

                const parent of

                node?.parents || []

            ){



                visit(parent);


            }



            order.push(id);


        };





        for(

            const id of this.nodes.keys()

        ){



            visit(id);


        }



        return order;


    }





    /**
     * Validation
     */
    validate():DependencyResult {



        const cycles=

            this.detectCycles();



        return {


            valid:

                cycles.length===0,


            order:

                this.getBuildOrder(),


            cycles


        };


    }





    /**
     * Cache reset
     */
    invalidateCache(){



        this.cache.clear();


    }





    /**
     * Serialize
     */
    serialize(){



        return {


            nodes:

                Array.from(

                    this.nodes.values()

                )

        };


    }





    /**
     * Reset
     */
    reset(){


        this.nodes.clear();


        this.cache.clear();


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureDependency",


            nodes:

                this.nodes.size,


            order:

                this.getBuildOrder().length


        };


    }


}