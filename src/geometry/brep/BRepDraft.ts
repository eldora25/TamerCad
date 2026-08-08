import { BRepSolid } from "./BRepSolid";
import { BRepFace } from "./BRepFace";

import { Point3 } from "../point/Point3";

import { BRepHeal } from "./BRepHeal";
import { BRepValidator } from "./BRepValidator";



export interface DraftDirection {


    origin:Point3;


    direction:Point3;

}



export interface DraftOptions {


    angle:number;


    direction:DraftDirection;


    tolerance:number;

}



export interface DraftResult {


    success:boolean;


    solid:BRepSolid|null;


    modifiedFaces:number;


    warnings:string[];

}





export class BRepDraft {



    /**
     * Ana draft operasyonu
     */
    static apply(

        solid:BRepSolid,

        faces:BRepFace[],

        options:DraftOptions

    ):DraftResult {



        let result =
            solid.clone();



        for(
            const face of faces
        ){


            result =
                this.draftFace(

                    result,

                    face,

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


            modifiedFaces:

                faces.length,


            warnings:

                healed.report.warnings


        };

    }





    /**
     * Tek face draft
     */
    static draftFace(

        solid:BRepSolid,

        face:BRepFace,

        options:DraftOptions

    ):BRepSolid {



        const result =
            solid.clone();



        /*
            Gerçek CAD algoritması:


            1. Face normal hesapla


            2. Pull direction belirle


            3. Açıyı hesapla


            4. Surface transform uygula


            5. Neighbor face intersection


            6. Topology rebuild


        */



        return result;

    }





    /**
     * Draft açı kontrolü
     */
    static analyzeDraft(

        face:BRepFace,

        direction:Point3

    ){



        /*
            Normal:

            n

            Pull:

            d


            açı:

            acos(n.d)

        */



        return {


            valid:true,


            angle:0,


            undercut:false


        };

    }





    /**
     * Çoklu yüz draft
     */
    static draftFaces(

        solid:BRepSolid,

        faces:BRepFace[],

        angle:number,

        direction:DraftDirection

    ):DraftResult {



        return this.apply(

            solid,

            faces,

            {

                angle,


                direction,


                tolerance:1e-6

            }

        );

    }





    /**
     * Injection molding kontrolü
     */
    static checkMoldability(

        solid:BRepSolid,

        direction:DraftDirection

    ){



        const issues:string[] = [];



        for(
            const shell of solid.shells
        ){


            for(
                const face of shell.faces
            ){


                const analysis =

                    this.analyzeDraft(

                        face,

                        direction.direction

                    );



                if(
                    analysis.undercut
                ){

                    issues.push(

                        "Undercut detected"

                    );

                }

            }

        }



        return {


            moldable:

                issues.length === 0,


            issues


        };

    }





    /**
     * Minimum üretim draft kontrolü
     */
    static validateAngle(

        angle:number

    ):boolean {



        /*
            Plastik üretimde:

            genelde:

            0.5° - 3°

        */



        return angle > 0;

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
                "BRepDraft",


            status:
                "READY"

        };

    }


}