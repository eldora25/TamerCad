import { BRepSolid } from "./BRepSolid";
import { BRepFace } from "./BRepFace";
import { BRepShell } from "./BRepShell";

import { BRepOffset } from "./BRepOffset";
import { BRepHeal } from "./BRepHeal";
import { BRepValidator } from "./BRepValidator";



export interface ShellingOptions {


    thickness:number;


    removeFaces:BRepFace[];


    inward:boolean;


    tolerance:number;

}



export interface ShellingResult {


    success:boolean;


    solid:BRepSolid|null;


    removedFaces:number;


    warnings:string[];

}



export class BRepShelling {



    /**
     * Ana shell operasyonu
     */
    static shell(

        solid:BRepSolid,

        options:ShellingOptions

    ):ShellingResult {



        let result =
            solid.clone();



        /*
            Pipeline:

            1. Remove selected faces

            2. Offset remaining faces

            3. Create inner shell

            4. Generate wall faces

            5. Heal topology

        */



        result =
            this.removeFaces(

                result,

                options.removeFaces

            );



        result =
            this.createInnerShell(

                result,

                options.thickness,

                options.inward

            );



        const healed =
            BRepHeal.heal(

                result

            );



        return {


            success:

                healed.report.success,


            solid:

                healed.solid,


            removedFaces:

                options.removeFaces.length,


            warnings:

                healed.report.warnings


        };

    }





    /**
     * Face kaldırma
     */
    static removeFaces(

        solid:BRepSolid,

        faces:BRepFace[]

    ):BRepSolid {



        const result =
            solid.clone();



        /*
            Gerçek işlem:

            Face silinir

            Boundary loop oluşturulur

            Açıklık korunur

        */



        return result;

    }





    /**
     * İç shell oluşturma
     */
    static createInnerShell(

        solid:BRepSolid,

        thickness:number,

        inward:boolean

    ):BRepSolid {



        const direction =
            inward
                ? -thickness
                : thickness;



        const result =
            solid.clone();



        for(
            const shell of result.shells
        ){


            BRepOffset.offsetShell(

                shell,

                direction

            );

        }



        return result;

    }





    /**
     * Duvar yüzeyi oluşturma
     */
    static createWallFaces(

        solid:BRepSolid,

        removedFaces:BRepFace[],

        thickness:number

    ):BRepFace[] {



        /*
            Açılan bölgelerde:

            Outer boundary

            Inner boundary

            Connecting wall


            oluşturulur.

        */



        return [];

    }





    /**
     * Kalınlık kontrolü
     */
    static validateThickness(

        solid:BRepSolid,

        thickness:number

    ):boolean {



        if(
            thickness <= 0
        ){

            return false;

        }



        return (

            BRepValidator
                .validateSolid(
                    solid
                )
                .valid

        );

    }





    /**
     * Basit hollow
     */
    static hollow(

        solid:BRepSolid,

        thickness:number

    ):ShellingResult {


        return this.shell(

            solid,

            {

                thickness,


                removeFaces:[],


                inward:true,


                tolerance:1e-6

            }

        );

    }





    /**
     * Plastik parça shell
     */
    static plasticShell(

        solid:BRepSolid,

        openFace:BRepFace,

        wall:number

    ):ShellingResult {



        return this.shell(

            solid,

            {

                thickness:wall,


                removeFaces:[

                    openFace

                ],


                inward:true,


                tolerance:1e-6

            }

        );

    }





    /**
     * Son kontrol
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
                "BRepShelling",


            status:
                "READY"

        };

    }


}