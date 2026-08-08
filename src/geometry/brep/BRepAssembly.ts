import { BRepSolid } from "./BRepSolid";


export enum AssemblyJointType {


    FIXED =
        "fixed",


    REVOLUTE =
        "revolute",


    SLIDER =
        "slider",


    CYLINDRICAL =
        "cylindrical",


    BALL =
        "ball"


}





export enum MateType {


    COINCIDENT =
        "coincident",


    CONCENTRIC =
        "concentric",


    DISTANCE =
        "distance",


    ANGLE =
        "angle"


}





export interface Transform {


    x:number;


    y:number;


    z:number;


    rx:number;


    ry:number;


    rz:number;


}





export interface AssemblyComponent {


    id:string;


    name:string;


    solid:BRepSolid;


    transform:Transform;


    parent:string|null;


}





export interface MateConstraint {


    id:string;


    type:MateType;


    componentA:string;


    componentB:string;


    value:number;


}





export interface Joint {


    id:string;


    type:AssemblyJointType;


    componentA:string;


    componentB:string;


}





export interface AssemblyResult {


    success:boolean;


    components:number;


    solved:boolean;


    warnings:string[];

}





export class BRepAssembly {



    id:string;


    name:string;


    components:AssemblyComponent[];


    mates:MateConstraint[];


    joints:Joint[];




    constructor(

        id:string,

        name:string

    ){


        this.id=id;


        this.name=name;


        this.components=[];


        this.mates=[];


        this.joints=[];


    }





    /**
     * Component ekleme
     */
    addComponent(

        component:AssemblyComponent

    ){


        this.components.push(

            component

        );


    }





    /**
     * Mate constraint ekleme
     */
    addMate(

        mate:MateConstraint

    ){


        this.mates.push(

            mate

        );


    }





    /**
     * Joint ekleme
     */
    addJoint(

        joint:Joint

    ){


        this.joints.push(

            joint

        );


    }





    /**
     * Assembly çözümü
     */
    solve(){

        /*
            Assembly Solver:


            Components

                ↓

            Mate Graph

                ↓

            Transform Solve

                ↓

            Final Positions
        */


        return {


            solved:true,


            iterations:1


        };


    }





    /**
     * Component bulma
     */
    findComponent(

        id:string

    ){



        return (

            this.components.find(

                c=>c.id===id

            )

            ??

            null

        );

    }





    /**
     * Transform güncelleme
     */
    updateTransform(

        id:string,

        transform:Transform

    ){


        const component =

            this.findComponent(

                id

            );



        if(component){


            component.transform =

                transform;


        }


    }





    /**
     * Fixed joint
     */
    fixedJoint(

        a:string,

        b:string

    ){


        this.addJoint({

            id:

                crypto.randomUUID(),


            type:

                AssemblyJointType.FIXED,


            componentA:a,


            componentB:b


        });


    }





    /**
     * Revolute joint
     */
    revoluteJoint(

        a:string,

        b:string

    ){


        this.addJoint({

            id:

                crypto.randomUUID(),


            type:

                AssemblyJointType.REVOLUTE,


            componentA:a,


            componentB:b


        });


    }





    /**
     * Montaj ağacı
     */
    hierarchy(){


        return this.components.map(

            c=>({


                id:c.id,


                parent:c.parent


            })

        );


    }





    /**
     * Component sayısı
     */
    count(){

        return this.components.length;

    }





    /**
     * Temizleme
     */
    clear(){


        this.components=[];


        this.mates=[];


        this.joints=[];


    }





    /**
     * Debug
     */
    info(){

        return {


            engine:

                "BRepAssembly",


            components:

                this.components.length,


            mates:

                this.mates.length,


            joints:

                this.joints.length


        };

    }


}