import { BRepSolid } from "./BRepSolid";
import { BRepShell } from "./BRepShell";
import { BRepFace } from "./BRepFace";
import { BRepEdge } from "./BRepEdge";
import { BRepVertex } from "./BRepVertex";

import { BRepValidator } from "./BRepValidator";
import { BRepMerge } from "./BRepMerge";



export interface HealReport {


    success:boolean;


    fixedVertices:number;


    fixedEdges:number;


    fixedFaces:number;


    fixedShells:number;


    warnings:string[];

}



export class BRepHeal {



    /**
     * Ana healing pipeline
     */
    static heal(

        solid:BRepSolid

    ):{

        solid:BRepSolid,

        report:HealReport

    } {



        let result =
            solid.clone();



        let vertices = 0;

        let edges = 0;

        let faces = 0;

        let shells = 0;



        result =
            this.removeDuplicateTopology(
                result
            );



        result =
            this.repairShells(
                result
            );



        result =
            this.repairFaces(
                result
            );



        const validation =
            BRepValidator
                .validateSolid(
                    result
                );



        return {


            solid:
                result,


            report:


            {

                success:
                    validation.valid,


                fixedVertices:
                    vertices,


                fixedEdges:
                    edges,


                fixedFaces:
                    faces,


                fixedShells:
                    shells,


                warnings:
                    validation.warnings

            }

        };

    }





    /**
     * Duplicate topology temizleme
     */
    static removeDuplicateTopology(

        solid:BRepSolid

    ):BRepSolid {


        const result =
            solid.clone();



        /*
            Gerçek kernel:

            - vertex welding
            - edge merge
            - tolerance check

        */



        return result;

    }





    /**
     * Vertex iyileştirme
     */
    static healVertices(

        solid:BRepSolid,

        tolerance:number = 1e-6

    ):BRepSolid {


        const result =
            solid.clone();



        /*
            Aynı koordinattaki
            vertexler birleştirilir.

        */



        return result;

    }





    /**
     * Edge onarma
     */
    static healEdges(

        shell:BRepShell

    ):BRepShell {


        const result =
            shell.clone();



        for(
            const face of result.faces
        ){


            const loops = [

                face.outerLoop,

                ...face.innerLoops

            ];



            for(
                const loop of loops
            ){


                loop.removeInvalidEdges();

            }

        }



        return result;

    }





    /**
     * Loop kapatma
     */
    static closeLoops(

        face:BRepFace

    ):boolean {


        if(
            !face.outerLoop
        ){

            return false;

        }



        return (

            face.outerLoop
                .isClosed()

        );

    }





    /**
     * Face iyileştirme
     */
    static repairFaces(

        solid:BRepSolid

    ):BRepSolid {


        const result =
            solid.clone();



        for(
            const shell of result.shells
        ){


            for(
                const face of shell.faces
            ){


                this.closeLoops(
                    face
                );

            }

        }



        return result;

    }





    /**
     * Shell iyileştirme
     */
    static repairShells(

        solid:BRepSolid

    ):BRepSolid {


        const result =
            solid.clone();



        for(
            const shell of result.shells
        ){


            if(
                !shell.isClosed()
            ){


                /*
                    Gap closing algoritması
                    ileri aşamada:

                    - boundary detection
                    - face creation
                    - shell rebuild

                */

            }

        }



        return result;

    }





    /**
     * Küçük boşluk kapatma
     */
    static closeGaps(

        solid:BRepSolid,

        tolerance:number = 1e-6

    ):BRepSolid {


        const result =
            solid.clone();



        return result;

    }





    /**
     * Healing sonucu kontrol
     */
    static isHealed(

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
                "BRepHeal",


            status:
                "READY"


        };

    }


}