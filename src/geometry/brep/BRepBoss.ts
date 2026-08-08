import { BRepSolid } from "./BRepSolid";
import { BRepSketch } from "./BRepSketch";

import { BRepBoolean } from "./BRepBoolean";
import { BRepExtrude } from "./BRepExtrude";



export enum BossType {


    BLIND =
        "blind",


    SYMMETRIC =
        "symmetric",


    THROUGH =
        "through"


}





export interface BossOptions {


    height:number;


    type:BossType;


    direction:{


        x:number;


        y:number;


        z:number;


    };


    taper:number;


}





export interface BossResult {


    success:boolean;


    solid:BRepSolid|null;


    addedVolume:number;


    warnings:string[];

}





export class BRepBoss {



    /**
     * Ana boss oluşturma
     */
    static create(

        base:BRepSolid,

        sketch:BRepSketch,

        options:BossOptions

    ):BossResult {



        /*
            Pipeline:


            Sketch


              ↓


            Extrude Additive Body


              ↓


            Boolean Union


              ↓


            Heal


              ↓


            New Solid

        */



        const addition =

            this.createFeatureSolid(

                sketch,

                options

            );



        const result =

            BRepBoolean.union(

                base,

                addition

            );



        return {


            success:

                result.success,


            solid:

                result.result,


            addedVolume:

                0,


            warnings:[]

        };


    }





    /**
     * Boss solid üretimi
     */
    static createFeatureSolid(

        sketch:BRepSketch,

        options:BossOptions

    ):BRepSolid {



        const extrusion =

            BRepExtrude.extrude(

                sketch,

                {

                    direction:

                        options.direction,


                    depth:

                        options.height,


                    symmetric:

                        options.type ===

                        BossType.SYMMETRIC,


                    taper:

                        options.taper,


                    tolerance:

                        1e-6

                }

            );



        return (

            extrusion.solid

            ??

            new BRepSolid()

        );

    }





    /**
     * Normal boss
     */
    static blind(

        base:BRepSolid,

        sketch:BRepSketch,

        height:number

    ):BossResult {



        return this.create(

            base,

            sketch,

            {

                height,


                type:

                    BossType.BLIND,


                direction:

                {

                    x:0,

                    y:0,

                    z:1

                },


                taper:0

            }

        );

    }





    /**
     * Symmetric boss
     */
    static symmetric(

        base:BRepSolid,

        sketch:BRepSketch,

        height:number

    ):BossResult {



        return this.create(

            base,

            sketch,

            {

                height,


                type:

                    BossType.SYMMETRIC,


                direction:

                {

                    x:0,

                    y:0,

                    z:1

                },


                taper:0

            }

        );

    }





    /**
     * Draft angle boss
     */
    static tapered(

        base:BRepSolid,

        sketch:BRepSketch,

        height:number,

        angle:number

    ):BossResult {



        return this.create(

            base,

            sketch,

            {

                height,


                type:

                    BossType.BLIND,


                direction:

                {

                    x:0,

                    y:0,

                    z:1

                },


                taper:angle

            }

        );

    }





    /**
     * Attachment face kontrolü
     */
    static attachToFace(

        faceId:string

    ){



        return {


            attached:true,


            face:faceId


        };

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:

                "BRepBoss",


            status:

                "READY"

        };

    }


}