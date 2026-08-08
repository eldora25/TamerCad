import { BRepSolid } from "./BRepSolid";
import { BRepShell } from "./BRepShell";

import { Surface3 } from "../surface/Surface3";
import { Point3 } from "../point/Point3";

import { BRepHeal } from "./BRepHeal";
import { BRepValidator } from "./BRepValidator";

import { BRepSketch } from "./BRepSketch";



export interface ExtrudeDirection {


    x:number;


    y:number;


    z:number;


}



export interface ExtrudeOptions {


    direction:ExtrudeDirection;


    depth:number;


    symmetric:boolean;


    taper:number;


    tolerance:number;

}



export interface ExtrudeResult {


    success:boolean;


    surface:Surface3|null;


    solid:BRepSolid|null;


    warnings:string[];

}





export class BRepExtrude {



    /**
     * Ana extrude operasyonu
     */
    static extrude(

        sketch:BRepSketch,

        options:ExtrudeOptions

    ):ExtrudeResult {



        /*
            Pipeline:


            Sketch


              ↓


            Profile Extraction


              ↓


            Surface Creation


              ↓


            Side Faces


              ↓


            Solid Closing


              ↓


            Heal


        */



        const profile =

            sketch.generateProfile();



        const surface =

            this.generateSurface(

                profile,

                options

            );



        const solid =

            this.surfaceToSolid(

                surface

            );



        const healed =

            BRepHeal.heal(

                solid

            );



        return {


            success:

                healed.report.success,


            surface,


            solid:

                healed.solid,


            warnings:

                healed.report.warnings


        };


    }





    /**
     * Extrude surface üretimi
     */
    static generateSurface(

        profile:any,

        options:ExtrudeOptions

    ):Surface3|null {



        /*
            CAD algoritması:


            Profile Curve


                +


            Translation Vector


                ↓


            Top Face


            Bottom Face


            Side Faces


                ↓


            Surface Shell


        */



        return null;

    }





    /**
     * Symmetric extrude
     */
    static symmetricExtrude(

        sketch:BRepSketch,

        depth:number

    ):ExtrudeResult {



        return this.extrude(

            sketch,

            {

                direction:

                {

                    x:0,

                    y:0,

                    z:1

                },


                depth,


                symmetric:true,


                taper:0,


                tolerance:

                    1e-6

            }

        );

    }





    /**
     * Normal extrude
     */
    static normalExtrude(

        sketch:BRepSketch,

        depth:number

    ):ExtrudeResult {



        return this.extrude(

            sketch,

            {

                direction:

                {

                    x:0,

                    y:0,

                    z:1

                },


                depth,


                symmetric:false,


                taper:0,


                tolerance:

                    1e-6

            }

        );

    }





    /**
     * Tapered extrude
     */
    static taperedExtrude(

        sketch:BRepSketch,

        depth:number,

        angle:number

    ):ExtrudeResult {



        return this.extrude(

            sketch,

            {

                direction:

                {

                    x:0,

                    y:0,

                    z:1

                },


                depth,


                symmetric:false,


                taper:angle,


                tolerance:

                    1e-6

            }

        );

    }





    /**
     * Thin feature
     */
    static thinExtrude(

        sketch:BRepSketch,

        thickness:number

    ):ExtrudeResult {



        return this.extrude(

            sketch,

            {

                direction:

                {

                    x:0,

                    y:0,

                    z:1

                },


                depth:thickness,


                symmetric:true,


                taper:0,


                tolerance:

                    1e-6

            }

        );

    }





    /**
     * Surface → Solid
     */
    static surfaceToSolid(

        surface:Surface3|null

    ):BRepSolid {



        const solid =

            new BRepSolid();



        const shell =

            new BRepShell();



        solid.addShell(

            shell

        );



        return solid;

    }





    /**
     * Extrude yön doğrulama
     */
    static validateDirection(

        direction:ExtrudeDirection

    ):boolean {



        return (

            direction.x !== 0 ||

            direction.y !== 0 ||

            direction.z !== 0

        );

    }





    /**
     * Solid kontrol
     */
    static validate(

        solid:BRepSolid

    ):boolean {



        return (

            BRepValidator

            .validateSolid(

                solid

            )

            .valid

        );

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:

                "BRepExtrude",


            status:

                "READY"

        };

    }


}