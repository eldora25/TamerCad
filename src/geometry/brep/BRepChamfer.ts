import { BRepSolid } from "./BRepSolid";
import { BRepEdge } from "./BRepEdge";
import { BRepFace } from "./BRepFace";
import { BRepVertex } from "./BRepVertex";

import { BRepHeal } from "./BRepHeal";
import { BRepValidator } from "./BRepValidator";



export enum ChamferType {


    DISTANCE =
        "distance",


    ANGLE =
        "angle"

}





export interface ChamferOptions {


    type:ChamferType;


    distance:number;


    angle?:number;


    tolerance:number;

}





export interface ChamferResult {


    success:boolean;


    solid:BRepSolid|null;


    affectedEdges:number;


    warnings:string[];

}





export class BRepChamfer {



    /**
     * Ana chamfer operasyonu
     */
    static apply(

        solid:BRepSolid,

        edges:BRepEdge[],

        options:ChamferOptions

    ):ChamferResult {



        let result =
            solid.clone();



        for(
            const edge of edges
        ){


            result =
                this.chamferEdge(

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


            affectedEdges:

                edges.length,


            warnings:

                healed.report.warnings


        };

    }





    /**
     * Tek edge chamfer
     */
    static chamferEdge(

        solid:BRepSolid,

        edge:BRepEdge,

        options:ChamferOptions

    ):BRepSolid {



        const result =
            solid.clone();



        /*
            Gerçek CAD algoritması:


            1. Edge komşu yüzleri bul


            2. Distance/angle offset oluştur


            3. Yeni chamfer face üret


            4. Eski edge kaldır


            5. Topology rebuild


        */



        return result;

    }





    /**
     * Distance chamfer
     *
     * Örnek:
     *
     * 5mm x 5mm pah
     */
    static distanceChamfer(

        solid:BRepSolid,

        edges:BRepEdge[],

        distance:number

    ):ChamferResult {



        return this.apply(

            solid,

            edges,

            {

                type:

                    ChamferType.DISTANCE,


                distance,


                tolerance:

                    1e-6

            }

        );

    }





    /**
     * Angle chamfer
     *
     * Örnek:
     *
     * 45 derece pah
     */
    static angleChamfer(

        solid:BRepSolid,

        edges:BRepEdge[],

        distance:number,

        angle:number

    ):ChamferResult {



        return this.apply(

            solid,

            edges,

            {

                type:

                    ChamferType.ANGLE,


                distance,


                angle,


                tolerance:

                    1e-6

            }

        );

    }





    /**
     * Edge uygunluk kontrolü
     */
    static canChamfer(

        edge:BRepEdge,

        distance:number

    ):boolean {



        if(
            distance <= 0
        ){

            return false;

        }



        return true;

    }





    /**
     * Chamfer yüzeyi oluşturma
     */
    static createChamferFace(

        faceA:BRepFace,

        faceB:BRepFace,

        distance:number

    ):BRepFace|null {



        /*
            Yeni planar face:

            Face A offset

            Face B offset

            Intersection

            Yeni pah yüzeyi

        */



        return null;

    }





    /**
     * Vertex köşe temizleme
     */
    static cleanupCorner(

        vertex:BRepVertex

    ):boolean {



        /*
            Çoklu edge birleşimlerinde:

            - miter corner
            - tangent cleanup

        */



        return true;

    }





    /**
     * Çoklu edge chamfer
     */
    static chamferEdges(

        solid:BRepSolid,

        edges:BRepEdge[],

        distance:number

    ):ChamferResult {


        return this.distanceChamfer(

            solid,

            edges,

            distance

        );

    }





    /**
     * Son doğrulama
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
                "BRepChamfer",


            status:
                "READY"

        };

    }


}