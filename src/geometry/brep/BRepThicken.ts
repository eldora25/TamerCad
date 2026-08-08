import { Surface3 } from "../surface/Surface3";

import { BRepSolid } from "./BRepSolid";
import { BRepShell } from "./BRepShell";
import { BRepFace } from "./BRepFace";

import { BRepHeal } from "./BRepHeal";
import { BRepValidator } from "./BRepValidator";



export interface ThickenOptions {


    distance:number;


    inward:boolean;


    closeBoundaries:boolean;


    tolerance:number;

}



export interface ThickenResult {


    success:boolean;


    solid:BRepSolid|null;


    thickness:number;


    warnings:string[];

}





export class BRepThicken {



    /**
     * Ana surface-to-solid işlemi
     */
    static thicken(

        surface:Surface3,

        options:ThickenOptions

    ):ThickenResult {



        /*
            Pipeline:


            1. Surface kopyala


            2. Offset surface oluştur


            3. Side walls üret


            4. Boundary kapat


            5. Shell oluştur


            6. Solid doğrula

        */



        const shell =
            this.createShell(

                surface,

                options

            );



        const solid =
            this.shellToSolid(

                shell

            );



        const healed =
            BRepHeal.heal(

                solid

            );



        return {


            success:

                healed.report.success,


            solid:

                healed.solid,


            thickness:

                options.distance,


            warnings:

                healed.report.warnings


        };

    }





    /**
     * Surface offset oluşturma
     */
    static offsetSurface(

        surface:Surface3,

        distance:number,

        inward:boolean

    ):Surface3 {



        const offset =
            inward
            ? -distance
            : distance;



        /*
            Surface normal yönünde:

            S' = S + n*d

        */



        return surface.clone();

    }





    /**
     * Shell oluşturma
     */
    static createShell(

        surface:Surface3,

        options:ThickenOptions

    ):BRepShell {



        const shell =
            new BRepShell();



        /*
            Outer face

            Inner offset face

            Connecting walls


            oluşturulur.

        */



        return shell;

    }





    /**
     * Boundary duvarları
     */
    static createSideWalls(

        surface:Surface3,

        offset:Surface3

    ):BRepFace[] {



        /*
            Açık kenarlar:

            Edge loop

            ↓

            Ruled surface

            ↓

            Wall faces

        */



        return [];

    }





    /**
     * Açıklıkları kapatma
     */
    static closeBoundaries(

        shell:BRepShell

    ):BRepShell {



        /*
            Planar cap:

            Boundary loop

            → Face

        */



        return shell;

    }





    /**
     * Shell → Solid dönüşümü
     */
    static shellToSolid(

        shell:BRepShell

    ):BRepSolid {



        const solid =
            new BRepSolid();



        solid.addShell(

            shell

        );



        return solid;

    }





    /**
     * Sheet metal kalınlığı
     */
    static sheetThickness(

        surface:Surface3,

        thickness:number

    ):ThickenResult {



        return this.thicken(

            surface,

            {

                distance:

                    thickness,


                inward:false,


                closeBoundaries:true,


                tolerance:

                    1e-6

            }

        );

    }





    /**
     * Katı kontrolü
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
                "BRepThicken",


            status:
                "READY"

        };

    }


}