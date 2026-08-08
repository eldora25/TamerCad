import { BRepSolid } from "./BRepSolid";
import { BRepBoolean } from "./BRepBoolean";



export enum HoleType {


    BLIND =
        "blind",


    THROUGH =
        "through",


    COUNTERBORE =
        "counterbore",


    COUNTERSINK =
        "countersink"


}





export enum ThreadType {


    NONE =
        "none",


    METRIC =
        "metric",


    UNIFIED =
        "unified"


}





export interface HoleOptions {


    diameter:number;


    depth:number;


    type:HoleType;


    direction:{


        x:number;


        y:number;


        z:number;


    };


    thread:ThreadType;


    threadPitch:number;


}





export interface HoleResult {


    success:boolean;


    solid:BRepSolid|null;


    removedVolume:number;


    warnings:string[];

}





export class BRepHole {



    /**
     * Ana hole operasyonu
     */
    static create(

        base:BRepSolid,

        position:any,

        options:HoleOptions

    ):HoleResult {



        /*
            Pipeline:


            Hole Parameters


                  ↓


            Cylinder Cutter


                  ↓


            Optional Counter Profile


                  ↓


            Boolean Difference


                  ↓


            Heal


        */



        const cutter =

            this.createCutter(

                position,

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


            removedVolume:0,


            warnings:[]

        };


    }





    /**
     * Kesici silindir üretimi
     */
    static createCutter(

        position:any,

        options:HoleOptions

    ):BRepSolid {



        /*
            Cylinder:

            Radius = diameter / 2

            Height = depth

        */


        return new BRepSolid();

    }





    /**
     * Basit matkap deliği
     */
    static drill(

        base:BRepSolid,

        position:any,

        diameter:number,

        depth:number

    ):HoleResult {



        return this.create(

            base,

            position,

            {

                diameter,


                depth,


                type:

                    HoleType.BLIND,


                direction:

                {

                    x:0,

                    y:0,

                    z:-1

                },


                thread:

                    ThreadType.NONE,


                threadPitch:0


            }

        );

    }





    /**
     * Through hole
     */
    static through(

        base:BRepSolid,

        position:any,

        diameter:number

    ):HoleResult {



        return this.create(

            base,

            position,

            {

                diameter,


                depth:100000,


                type:

                    HoleType.THROUGH,


                direction:

                {

                    x:0,

                    y:0,

                    z:-1

                },


                thread:

                    ThreadType.NONE,


                threadPitch:0


            }

        );

    }





    /**
     * Counterbore
     */
    static counterbore(

        base:BRepSolid,

        position:any,

        holeDiameter:number,

        boreDiameter:number,

        depth:number

    ):HoleResult {



        return this.create(

            base,

            position,

            {

                diameter:

                    boreDiameter,


                depth,


                type:

                    HoleType.COUNTERBORE,


                direction:

                {

                    x:0,

                    y:0,

                    z:-1

                },


                thread:

                    ThreadType.NONE,


                threadPitch:0


            }

        );

    }





    /**
     * Countersink
     */
    static countersink(

        base:BRepSolid,

        position:any,

        diameter:number,

        angle:number

    ):HoleResult {



        return this.create(

            base,

            position,

            {

                diameter,


                depth:diameter,


                type:

                    HoleType.COUNTERSINK,


                direction:

                {

                    x:0,

                    y:0,

                    z:-1

                },


                thread:

                    ThreadType.NONE,


                threadPitch:angle


            }

        );

    }





    /**
     * Diş hazırlığı
     */
    static thread(

        options:HoleOptions,

        type:ThreadType,

        pitch:number

    ){



        options.thread =

            type;


        options.threadPitch =

            pitch;


    }





    /**
     * Hole validation
     */
    static validate(

        options:HoleOptions

    ):boolean {



        return (

            options.diameter > 0 &&

            options.depth > 0

        );

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:

                "BRepHole",


            status:

                "READY"

        };

    }


}