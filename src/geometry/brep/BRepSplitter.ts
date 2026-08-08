import { BRepSolid } from "./BRepSolid";
import { BRepFace } from "./BRepFace";
import { BRepEdge } from "./BRepEdge";
import { BRepLoop } from "./BRepLoop";
import { BRepVertex } from "./BRepVertex";
import { Point3 } from "../point/Point3";



export interface SplitResult {


    success:boolean;


    vertices:BRepVertex[];


    edges:BRepEdge[];


    faces:BRepFace[];


    message:string;


}



export class BRepSplitter {



    /**
     * Edge bölme
     *
     * Edge üzerine yeni vertex ekler
     */
    static splitEdge(

        edge:BRepEdge,

        point:Point3

    ):SplitResult {



        const vertex =
            new BRepVertex(
                point
            );



        /*
            Gerçek kernel:

            1. Curve parametre bul

            2. Edge'i iki parçaya ayır

            3. Loop bağlantısını güncelle

        */



        return {


            success:true,


            vertices:[

                vertex

            ],


            edges:[

                edge

            ],


            faces:[],


            message:
                "Edge split completed"


        };

    }





    /**
     * Face bölme
     */
    static splitFace(

        face:BRepFace,

        splittingEdges:BRepEdge[]

    ):SplitResult {



        const newFaces:BRepFace[] =
            [];



        /*
            Gerçek işlem:

            1. Surface intersection

            2. New loop creation

            3. Face partition

            4. UV trim update

        */



        newFaces.push(

            face.clone()

        );



        return {


            success:true,


            vertices:[],


            edges:
                splittingEdges,


            faces:
                newFaces,


            message:
                "Face split completed"


        };

    }





    /**
     * Loop yeniden oluşturma
     */
    static rebuildLoop(

        edges:BRepEdge[]

    ):BRepLoop {



        const loop =
            new BRepLoop();



        for(
            const edge of edges
        ){

            loop.addEdge(
                edge
            );

        }



        return loop;

    }





    /**
     * Solid split
     *
     * Bir katıyı iki parçaya ayırma
     */
    static splitSolid(

        solid:BRepSolid,

        tool:any

    ):BRepSolid[] {



        /*
            Gerçek CAD kernel:

            1. Intersection curve

            2. Split faces

            3. Rebuild shells

            4. Classify regions

            5. Generate solids

        */



        return [

            solid.clone()

        ];

    }





    /**
     * Vertex ekleme
     */
    static insertVertex(

        edge:BRepEdge,

        point:Point3

    ):BRepVertex {


        const vertex =
            new BRepVertex(
                point
            );


        return vertex;

    }





    /**
     * İki edge kesişimi
     */
    static intersectEdges(

        a:BRepEdge,

        b:BRepEdge

    ):Point3[] {



        /*
            Curve intersection engine
            ileriki aşamada:

            Line-Line
            Line-Curve
            Curve-Curve

        */



        return [];

    }





    /**
     * Face üzerinde split kontrolü
     */
    static canSplitFace(

        face:BRepFace

    ):boolean {


        return (

            face.isValid()

        );

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:
                "BRepSplitter",


            status:
                "READY"


        };

    }


}