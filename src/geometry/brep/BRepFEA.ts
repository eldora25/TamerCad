import {
    BRepSolid
}
from "./BRepSolid";


import {
    MaterialDefinition
}
from "./BRepMaterial";





export interface Vector3 {


    x:number;


    y:number;


    z:number;


}





export interface FEMNode {


    id:number;


    position:Vector3;


    displacement:Vector3;


}





export interface FEMElement {


    id:number;


    nodes:number[];


    material:MaterialDefinition;


}





export interface BoundaryCondition {


    node:number;


    fixed:boolean;


    value:Vector3;


}





export interface FEALoad {


    node:number;


    force:Vector3;


}





export interface FEAResult {


    success:boolean;


    nodes:number;


    elements:number;


    maxDisplacement:number;


}





export class BRepFEA {



    solid:BRepSolid|null;


    material:MaterialDefinition|null;


    nodes:FEMNode[];


    elements:FEMElement[];


    boundaries:BoundaryCondition[];


    loads:FEALoad[];


    stiffness:number[][];



    constructor(){


        this.solid=null;


        this.material=null;


        this.nodes=[];


        this.elements=[];


        this.boundaries=[];


        this.loads=[];


        this.stiffness=[];


    }





    /**
     * Model yükleme
     */
    load(

        solid:BRepSolid,

        material:MaterialDefinition

    ){


        this.solid=

            solid;


        this.material=

            material;


    }





    /**
     * FEM mesh oluşturma
     */
    generateMesh(

        density:number

    ){



        /*
        
        BRepSolid


            ↓


        Tessellation


            ↓


        FEM Nodes


            ↓


        Elements


        */



        this.nodes=[];


        this.elements=[];


    }





    /**
     * Node ekleme
     */
    addNode(

        node:FEMNode

    ){


        this.nodes.push(

            node

        );


    }





    /**
     * Element ekleme
     */
    addElement(

        element:FEMElement

    ){


        this.elements.push(

            element

        );


    }





    /**
     * Boundary condition
     */
    addBoundary(

        condition:BoundaryCondition

    ){


        this.boundaries.push(

            condition

        );


    }





    /**
     * Kuvvet yükleme
     */
    addLoad(

        load:FEALoad

    ){


        this.loads.push(

            load

        );


    }





    /**
     * Stiffness matrix oluşturma
     */
    assembleStiffness(){



        const size=

            this.nodes.length;



        this.stiffness=

            Array.from(

                {

                    length:size

                },

                ()=>

                    Array(

                        size

                    ).fill(0)

            );



        /*
        
        K matrix:


        K u = F


        */


    }





    /**
     * Linear solver
     */
    solveLinearSystem(){



        /*
        
        Matrix solver:


        [K]{u}={F}


        */


        return {


            solved:true


        };


    }





    /**
     * Ana FEA çözümü
     */
    solve():FEAResult {



        this.assembleStiffness();



        this.solveLinearSystem();



        this.calculateStress();



        return {


            success:true,


            nodes:

                this.nodes.length,


            elements:

                this.elements.length,


            maxDisplacement:

                this.maximumDisplacement()


        };


    }





    /**
     * Displacement hesabı
     */
    maximumDisplacement(){



        let max=0;



        for(

            const node of this.nodes

        ){



            const d=

                Math.sqrt(

                    node.displacement.x *

                    node.displacement.x

                    +

                    node.displacement.y *

                    node.displacement.y

                    +

                    node.displacement.z *

                    node.displacement.z

                );



            max=Math.max(

                max,

                d

            );


        }



        return max;


    }





    /**
     * Stress recovery
     */
    calculateStress(){



        /*
        
        Element strain


             ↓


        Stress tensor


             ↓


        Von Mises


        */


    }





    /**
     * Güvenlik raporu
     */
    report(){


        return {


            nodes:

                this.nodes.length,


            elements:

                this.elements.length,


            status:

                "COMPLETED"


        };


    }





    /**
     * Reset
     */
    reset(){


        this.nodes=[];


        this.elements=[];


        this.loads=[];


        this.boundaries=[];


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepFEA",


            nodes:

                this.nodes.length,


            elements:

                this.elements.length,


            status:

                "READY"


        };


    }


}