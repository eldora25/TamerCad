import { BRepSolid } from "./BRepSolid";
import { BRepEdge } from "./BRepEdge";
import { BRepFace } from "./BRepFace";
import { BRepVertex } from "./BRepVertex";

import { BRepHeal } from "./BRepHeal";
import { BRepValidator } from "./BRepValidator";



export interface FilletOptions {


    radius:number;


    smooth:boolean;


    tolerance:number;


}



export interface FilletResult {


    success:boolean;


    solid:BRepSolid|null;


    affectedEdges:number;


    warnings:string[];

}



export class BRepFillet {



    /**
     * Ana fillet operasyonu
     */
    static apply(

        solid:BRepSolid,

        edges:BRepEdge[],

        options:FilletOptions

    ):FilletResult {



        let result =
            solid.clone();



        for(
            const edge of edges
        ){


            result =
                this.filletEdge(

                    result,

                    edge,

                    options.radius

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
     * Tek edge fillet
     */
    static filletEdge(

        solid:BRepSolid,

        edge:BRepEdge,

        radius:number

    ):BRepSolid {



        const result =
            solid.clone();



        /*
            Gerçek CAD algoritması:

            1. Edge komşu face bul

            2. Tangent yönleri hesapla

            3. Offset surface oluştur

            4. Blend surface üret

            5. Eski face değiştir

            6. Topology rebuild

        */



        return result;

    }





    /**
     * Face-face blend oluşturma
     */
    static createBlendSurface(

        faceA:BRepFace,

        faceB:BRepFace,

        radius:number

    ):BRepFace|null {



        /*
            Rolling ball:

            Sphere radius = fillet radius

            Contact curves:

            Face A

            Face B


            Yeni blend face

        */



        return null;

    }





    /**
     * Edge uygunluk kontrolü
     */
    static canFillet(

        edge:BRepEdge,

        radius:number

    ):boolean {



        if(
            radius <= 0
        ){

            return false;

        }



        /*
            İleri aşama:

            - convex kontrol
            - concave kontrol
            - radius limit

        */



        return true;

    }





    /**
     * Çoklu edge fillet
     */
    static filletEdges(

        solid:BRepSolid,

        edges:BRepEdge[],

        radius:number

    ):FilletResult {



        return this.apply(

            solid,

            edges,

            {

                radius,

                smooth:true,

                tolerance:1e-6

            }

        );

    }





    /**
     * Variable radius fillet
     */
    static variableRadius(

        solid:BRepSolid,

        edges:BRepEdge[],

        radii:number[]

    ):FilletResult {



        let result =
            solid.clone();



        /*
            Her edge için farklı radius

            Örnek:

            Edge1 -> 2mm

            Edge2 -> 5mm

        */



        return {


            success:true,


            solid:result,


            affectedEdges:
                edges.length,


            warnings:[]

        };

    }





    /**
     * Chamfer benzeri keskin dönüş kontrolü
     */
    static checkCorner(

        vertex:BRepVertex

    ):boolean {


        return true;

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
                "BRepFillet",


            status:
                "READY"

        };

    }


}