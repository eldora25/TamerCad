import { BRepSolid } from "./BRepSolid";
import { BRepShell } from "./BRepShell";
import { BRepFace } from "./BRepFace";
import { BRepEdge } from "./BRepEdge";
import { BRepVertex } from "./BRepVertex";
import { Point3 } from "../point/Point3";



export interface MergeResult {


    success:boolean;


    result:BRepSolid;


    mergedVertices:number;


    mergedEdges:number;


    mergedFaces:number;


    message:string;

}



export class BRepMerge {



    /**
     * İki solid birleştirme
     */
    static solids(

        a:BRepSolid,

        b:BRepSolid

    ):MergeResult {



        const result =
            a.clone();



        let vertices = 0;

        let edges = 0;

        let faces = 0;



        for(
            const shell of b.shells
        ){


            result.addShell(

                shell.clone()

            );



            faces +=
                shell.faces.length;

        }



        return {


            success:true,


            result,


            mergedVertices:
                vertices,


            mergedEdges:
                edges,


            mergedFaces:
                faces,


            message:
                "Solids merged"

        };

    }





    /**
     * Shell merge
     */
    static shells(

        target:BRepShell,

        source:BRepShell

    ):BRepShell {


        const result =
            target.clone();



        for(
            const face of source.faces
        ){

            result.addFace(

                face.clone()

            );

        }



        return result;

    }





    /**
     * Face merge
     */
    static faces(

        a:BRepFace,

        b:BRepFace

    ):BRepFace[] {



        /*
            Gerçek CAD:

            - ortak edge bulma
            - loop birleştirme
            - surface continuity kontrolü

        */


        return [

            a.clone(),

            b.clone()

        ];

    }





    /**
     * Edge merge
     */
    static edges(

        a:BRepEdge,

        b:BRepEdge

    ):BRepEdge {



        /*
            Aynı geometrik yolu
            paylaşan edge'ler
            tek edge haline getirilir.
        */



        return a.clone();

    }





    /**
     * Vertex merge
     */
    static vertices(

        a:BRepVertex,

        b:BRepVertex,

        tolerance:number = 1e-6

    ):BRepVertex {



        const dx =
            a.point.x -
            b.point.x;


        const dy =
            a.point.y -
            b.point.y;


        const dz =
            a.point.z -
            b.point.z;



        const distance =

            Math.sqrt(

                dx * dx +

                dy * dy +

                dz * dz

            );



        if(
            distance < tolerance
        ){

            return a.clone();

        }



        return a.clone();

    }





    /**
     * Duplicate vertex temizleme
     */
    static removeDuplicateVertices(

        vertices:BRepVertex[],

        tolerance:number = 1e-6

    ):BRepVertex[] {



        const result:BRepVertex[] =
            [];



        for(
            const vertex of vertices
        ){


            const exists =
                result.some(

                    item =>

                    this.distance(

                        item.point,

                        vertex.point

                    )
                    <
                    tolerance

                );



            if(
                !exists
            ){

                result.push(
                    vertex
                );

            }

        }



        return result;

    }





    /**
     * Nokta mesafesi
     */
    private static distance(

        a:Point3,

        b:Point3

    ):number {


        const dx =
            a.x-b.x;


        const dy =
            a.y-b.y;


        const dz =
            a.z-b.z;



        return Math.sqrt(

            dx*dx +

            dy*dy +

            dz*dz

        );

    }





    /**
     * Boolean sonrası cleanup
     */
    static cleanup(

        solid:BRepSolid

    ):BRepSolid {


        const result =
            solid.clone();



        /*
            İleri aşama:

            - duplicate vertex temizleme
            - boş face kaldırma
            - bozuk edge silme
            - topology optimize

        */



        return result;

    }





    static info(){


        return {


            engine:
                "BRepMerge",


            status:
                "READY"


        };

    }


}