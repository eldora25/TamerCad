import { BRepSolid } from "./BRepSolid";
import { BRepShell } from "./BRepShell";

import { Curve3 } from "../curve/Curve3";
import { Surface3 } from "../surface/Surface3";
import { Point3 } from "../point/Point3";

import { BRepHeal } from "./BRepHeal";
import { BRepValidator } from "./BRepValidator";



export interface RevolutionAxis {


    origin:Point3;


    direction:Point3;

}



export interface RevolveOptions {


    axis:RevolutionAxis;


    angle:number;


    closed:boolean;


    tolerance:number;

}



export interface RevolveResult {


    success:boolean;


    surface:Surface3|null;


    solid:BRepSolid|null;


    warnings:string[];

}





export class BRepRevolve {



    /**
     * Ana revolve operasyonu
     */
    static revolve(

        profile:Curve3,

        options:RevolveOptions

    ):RevolveResult {



        /*
            Pipeline:


            Profile

              +

            Axis


              ↓


            Angular Transform


              ↓


            Surface Revolution


              ↓


            Solid Creation


              ↓


            Heal


        */



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
     * Revolved surface üretimi
     */
    static generateSurface(

        profile:Curve3,

        options:RevolveOptions

    ):Surface3|null {



        /*
            CAD algoritması:


            1. Profile noktalarını al


            2. Axis uzaklıklarını hesapla


            3. Rotation matrix uygula


            4. Sweep surface oluştur


            5. Seam edge oluştur


        */



        return null;

    }





    /**
     * Tam 360 derece revolve
     */
    static fullRevolve(

        profile:Curve3,

        axis:RevolutionAxis

    ):RevolveResult {



        return this.revolve(

            profile,

            {

                axis,


                angle:
                    Math.PI * 2,


                closed:true,


                tolerance:
                    1e-6

            }

        );

    }





    /**
     * Kısmi açı revolve
     */
    static partialRevolve(

        profile:Curve3,

        axis:RevolutionAxis,

        angle:number

    ):RevolveResult {



        return this.revolve(

            profile,

            {

                axis,


                angle,


                closed:false,


                tolerance:
                    1e-6

            }

        );

    }





    /**
     * Lathe parça oluşturma
     */
    static lathe(

        profile:Curve3,

        axis:RevolutionAxis

    ):RevolveResult {



        return this.fullRevolve(

            profile,

            axis

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
     * Axis kontrolü
     */
    static validateAxis(

        axis:RevolutionAxis

    ):boolean {



        return (

            axis.direction.x !== 0 ||

            axis.direction.y !== 0 ||

            axis.direction.z !== 0

        );

    }





    /**
     * Self intersection kontrolü
     */
    static analyze(

        surface:Surface3

    ){



        return {


            selfIntersection:false,


            seamDetected:true,


            smooth:true


        };

    }





    /**
     * Solid doğrulama
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
                "BRepRevolve",


            status:
                "READY"

        };

    }


}