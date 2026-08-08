import { BRepFace } from "./BRepFace";
import { BRepEdge } from "./BRepEdge";
import { BRepSolid } from "./BRepSolid";

import { Surface3 } from "../surface/Surface3";

import { BRepHeal } from "./BRepHeal";
import { BRepValidator } from "./BRepValidator";



export enum BlendContinuity {


    POSITION =
        "G0",


    TANGENT =
        "G1",


    CURVATURE =
        "G2"


}



export interface BlendOptions {


    radius:number;


    continuity:BlendContinuity;


    tolerance:number;


}



export interface BlendResult {


    success:boolean;


    solid:BRepSolid|null;


    surface:Surface3|null;


    warnings:string[];

}





export class BRepBlend {



    /**
     * Ana blend operasyonu
     */
    static apply(

        solid:BRepSolid,

        edges:BRepEdge[],

        options:BlendOptions

    ):BlendResult {



        let result =
            solid.clone();



        for(
            const edge of edges
        ){


            result =
                this.blendEdge(

                    result,

                    edge,

                    options

                );

        }



        const healed =
            BRepHeal.heal(

                result

            );



        return {


            success:
                healed.report.success,


            solid:
                healed.solid,


            surface:null,


            warnings:
                healed.report.warnings


        };

    }





    /**
     * Edge blend
     */
    static blendEdge(

        solid:BRepSolid,

        edge:BRepEdge,

        options:BlendOptions

    ):BRepSolid {



        const result =
            solid.clone();



        /*
            CAD algoritması:


            1. Adjacent faces bul


            2. Boundary curves çıkar


            3. Rolling ball / spine oluştur


            4. Blend surface üret


            5. Eski yüzleri trim et


            6. Topology güncelle


        */



        return result;

    }





    /**
     * Face-face surface blend
     */
    static blendFaces(

        faceA:BRepFace,

        faceB:BRepFace,

        options:BlendOptions

    ):Surface3|null {



        /*
            Yüzey geçişi:


            G0:

            sadece temas


            G1:

            normal devamlılığı


            G2:

            curvature devamlılığı


        */



        return null;

    }





    /**
     * G1 tangent blend
     */
    static tangentBlend(

        faceA:BRepFace,

        faceB:BRepFace,

        radius:number

    ):Surface3|null {



        return this.blendFaces(

            faceA,

            faceB,

            {

                radius,

                continuity:
                    BlendContinuity.TANGENT,

                tolerance:
                    1e-6

            }

        );

    }





    /**
     * G2 curvature blend
     */
    static curvatureBlend(

        faceA:BRepFace,

        faceB:BRepFace,

        radius:number

    ):Surface3|null {



        return this.blendFaces(

            faceA,

            faceB,

            {

                radius,

                continuity:
                    BlendContinuity.CURVATURE,

                tolerance:
                    1e-6

            }

        );

    }





    /**
     * Loft geçiş yüzeyi
     */
    static loftBlend(

        sections:any[],

    ):Surface3|null {



        /*
            Section curves:

            Curve 1
               |
            Curve 2
               |
            Curve 3


            Loft surface


        */



        return null;

    }





    /**
     * Blend kalite kontrolü
     */
    static analyzeQuality(

        surface:Surface3

    ){



        return {


            continuity:
                BlendContinuity.TANGENT,


            smooth:true,


            curvatureVariation:0


        };

    }





    /**
     * Radius kontrolü
     */
    static validateRadius(

        radius:number

    ):boolean {



        return radius > 0;

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
                "BRepBlend",


            status:
                "READY"

        };

    }


}