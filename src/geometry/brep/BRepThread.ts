import { BRepSolid } from "./BRepSolid";
import { BRepBoolean } from "./BRepBoolean";



export enum ThreadStandard {


    METRIC_ISO =
        "metric_iso",


    UNIFIED =
        "unified",


    ACME =
        "acme",


    CUSTOM =
        "custom"


}





export enum ThreadDirection {


    RIGHT =
        "right",


    LEFT =
        "left"


}





export enum ThreadMode {


    INTERNAL =
        "internal",


    EXTERNAL =
        "external"


}





export interface ThreadOptions {


    diameter:number;


    pitch:number;


    length:number;


    standard:ThreadStandard;


    direction:ThreadDirection;


    mode:ThreadMode;


    angle:number;


}





export interface HelixPoint {


    x:number;


    y:number;


    z:number;


}





export interface ThreadResult {


    success:boolean;


    solid:BRepSolid|null;


    turns:number;


    warnings:string[];

}





export class BRepThread {



    /**
     * Ana thread oluşturma
     */
    static create(

        base:BRepSolid,

        position:any,

        options:ThreadOptions

    ):ThreadResult {



        /*
            Pipeline:


            Thread Parameters


                 ↓


            Helix Curve


                 ↓


            Thread Profile


                 ↓


            Sweep


                 ↓


            Boolean Union/Subtract


                 ↓


            Final Solid

        */



        const helix =

            this.generateHelix(

                position,

                options

            );



        const profile =

            this.generateProfile(

                options

            );



        const threadSolid =

            this.sweepThread(

                helix,

                profile

            );



        let result;



        if(

            options.mode ===

            ThreadMode.INTERNAL

        ){


            result =

                BRepBoolean.subtract(

                    base,

                    threadSolid

                );


        }

        else{


            result =

                BRepBoolean.union(

                    base,

                    threadSolid

                );


        }





        return {


            success:

                result.success,


            solid:

                result.result,


            turns:

                options.length /

                options.pitch,


            warnings:[]

        };


    }





    /**
     * Helix üretimi
     */
    static generateHelix(

        center:any,

        options:ThreadOptions

    ):HelixPoint[] {



        const points:

            HelixPoint[] = [];



        const turns =

            options.length /

            options.pitch;



        const segments =

            Math.floor(

                turns * 100

            );



        for(

            let i=0;

            i<=segments;

            i++

        ){



            const t =

                i /

                segments;



            const angle =

                t *

                turns *

                Math.PI *

                2;



            points.push({


                x:

                    center.x +

                    Math.cos(angle)

                    *

                    options.diameter

                    /

                    2,


                y:

                    center.y +

                    Math.sin(angle)

                    *

                    options.diameter

                    /

                    2,


                z:

                    center.z +

                    t *

                    options.length


            });


        }



        return points;

    }





    /**
     * Thread profili
     */
    static generateProfile(

        options:ThreadOptions

    ){



        return {


            type:

                options.standard,


            angle:

                options.angle,


            pitch:

                options.pitch


        };

    }





    /**
     * Helix sweep
     */
    static sweepThread(

        helix:HelixPoint[],

        profile:any

    ):BRepSolid {



        /*
            Sweep algorithm:


            Profile

              +

            Helix Path


              ↓


            Thread Body

        */



        return new BRepSolid();

    }





    /**
     * ISO Metric thread
     */
    static metric(

        base:BRepSolid,

        position:any,

        diameter:number,

        pitch:number,

        length:number

    ):ThreadResult {



        return this.create(

            base,

            position,

            {

                diameter,


                pitch,


                length,


                standard:

                    ThreadStandard.METRIC_ISO,


                direction:

                    ThreadDirection.RIGHT,


                mode:

                    ThreadMode.INTERNAL,


                angle:

                    60

            }

        );

    }





    /**
     * External thread
     */
    static external(

        base:BRepSolid,

        position:any,

        options:ThreadOptions

    ){


        options.mode =

            ThreadMode.EXTERNAL;



        return this.create(

            base,

            position,

            options

        );

    }





    /**
     * Internal thread
     */
    static internal(

        base:BRepSolid,

        position:any,

        options:ThreadOptions

    ){


        options.mode =

            ThreadMode.INTERNAL;



        return this.create(

            base,

            position,

            options

        );

    }





    /**
     * Sol helix
     */
    static leftHand(

        options:ThreadOptions

    ){


        options.direction =

            ThreadDirection.LEFT;


    }





    /**
     * Validation
     */
    static validate(

        options:ThreadOptions

    ):boolean {



        return (

            options.diameter > 0 &&

            options.pitch > 0 &&

            options.length > 0

        );

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:

                "BRepThread",


            status:

                "READY"

        };

    }


}