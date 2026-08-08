import { BRepSolid } from "./BRepSolid";
import { BRepSketch } from "./BRepSketch";

import { BRepBoolean } from "./BRepBoolean";
import { BRepExtrude } from "./BRepExtrude";



export enum PocketType {


    BLIND =
        "blind",


    THROUGH_ALL =
        "through_all",


    TWO_DIRECTION =
        "two_direction"


}





export interface PocketOptions {


    depth:number;


    type:PocketType;


    direction:{


        x:number;


        y:number;


        z:number;


    };


    reverse:boolean;


}





export interface PocketResult {


    success:boolean;


    solid:BRepSolid|null;


    removedVolume:number;


    warnings:string[];

}





export class BRepPocket {



    /**
     * Ana pocket operasyonu
     */
    static create(

        base:BRepSolid,

        sketch:BRepSketch,

        options:PocketOptions

    ):PocketResult {



        /*
            Pipeline:


            Sketch


              ↓


            Extrude Cutter


              ↓


            Boolean Difference


              ↓


            Heal


              ↓


            New Solid


        */



        const cutter =

            this.createCutter(

                sketch,

                options

            );



        const result =

            BRepBoolean.subtract(

                base,

                cutter

            );



        return {


            success:

                result.success,


            solid:

                result.result,


            removedVolume:

                0,


            warnings:[]

        };


    }





    /**
     * Kesici solid üretimi
     */
    static createCutter(

        sketch:BRepSketch,

        options:PocketOptions

    ):BRepSolid {



        const extrude =

            BRepExtrude.extrude(

                sketch,

                {

                    direction:

                        options.direction,


                    depth:

                        options.depth,


                    symmetric:

                        options.type ===

                        PocketType.TWO_DIRECTION,


                    taper:0,


                    tolerance:

                        1e-6

                }

            );



        return (

            extrude.solid

            ??

            new BRepSolid()

        );

    }





    /**
     * Blind pocket
     */
    static blind(

        base:BRepSolid,

        sketch:BRepSketch,

        depth:number

    ):PocketResult {



        return this.create(

            base,

            sketch,

            {

                depth,


                type:

                    PocketType.BLIND,


                direction:

                {

                    x:0,

                    y:0,

                    z:-1

                },


                reverse:false

            }

        );

    }





    /**
     * Through all pocket
     */
    static throughAll(

        base:BRepSolid,

        sketch:BRepSketch

    ):PocketResult {



        return this.create(

            base,

            sketch,

            {

                depth:100000,


                type:

                    PocketType.THROUGH_ALL,


                direction:

                {

                    x:0,

                    y:0,

                    z:-1

                },


                reverse:false

            }

        );

    }





    /**
     * Two direction cut
     */
    static twoDirection(

        base:BRepSolid,

        sketch:BRepSketch,

        depth:number

    ):PocketResult {



        return this.create(

            base,

            sketch,

            {

                depth,


                type:

                    PocketType.TWO_DIRECTION,


                direction:

                {

                    x:0,

                    y:0,

                    z:1

                },


                reverse:false

            }

        );

    }





    /**
     * Pocket yön değiştirme
     */
    static reverseDirection(

        options:PocketOptions

    ){


        options.reverse =

            !options.reverse;


    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:

                "BRepPocket",


            status:

                "READY"

        };

    }


}