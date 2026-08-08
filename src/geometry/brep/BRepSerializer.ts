import { BRepSolid } from "./BRepSolid";
import { BRepShell } from "./BRepShell";
import { BRepFace } from "./BRepFace";
import { BRepLoop } from "./BRepLoop";
import { BRepEdge } from "./BRepEdge";
import { BRepVertex } from "./BRepVertex";



export interface BRepSerializedData {


    version:string;


    id:string;


    shells:any[];


    metadata:
    Record<string, any>;



}



export class BRepSerializer {



    private static VERSION =
        "1.0.0";





    /**
     * BRepSolid → JSON
     */
    static serialize(

        solid:BRepSolid

    ):BRepSerializedData {



        return {


            version:
                this.VERSION,


            id:
                solid.id,


            shells:

                solid.shells.map(

                    shell =>
                        this.serializeShell(
                            shell
                        )

                ),



            metadata:

                {
                    ...solid.metadata
                }


        };

    }





    /**
     * Shell export
     */
    private static serializeShell(

        shell:BRepShell

    ){


        return {


            id:
                shell.id,


            inner:
                shell.inner,


            faces:

                shell.faces.map(

                    face =>
                        this.serializeFace(
                            face
                        )

                )

        };

    }





    /**
     * Face export
     */
    private static serializeFace(

        face:BRepFace

    ){


        return {


            id:
                face.id,


            surface:

                {

                    type:
                        face.surface.constructor.name

                },


            outerLoop:

                this.serializeLoop(
                    face.outerLoop
                ),



            innerLoops:

                face.innerLoops.map(

                    loop =>
                        this.serializeLoop(
                            loop
                        )

                ),



            reversed:
                face.reversed


        };

    }





    /**
     * Loop export
     */
    private static serializeLoop(

        loop:BRepLoop

    ){


        return {


            id:
                loop.id,


            edges:

                loop.edges.map(

                    edge =>
                        this.serializeEdge(
                            edge
                        )

                ),


            outer:
                loop.outer


        };

    }





    /**
     * Edge export
     */
    private static serializeEdge(

        edge:BRepEdge

    ){


        return {


            id:
                edge.id,


            startVertex:

                this.serializeVertex(
                    edge.startVertex
                ),



            endVertex:

                this.serializeVertex(
                    edge.endVertex
                ),



            curve:

                {

                    type:
                        edge.curve.constructor.name

                },


            reversed:
                edge.reversed


        };

    }





    /**
     * Vertex export
     */
    private static serializeVertex(

        vertex:BRepVertex

    ){


        return {


            id:
                vertex.id,


            point:

                {

                    x:
                        vertex.point.x,


                    y:
                        vertex.point.y,


                    z:
                        vertex.point.z

                }


        };

    }





    /**
     * JSON string export
     */
    static toJSON(

        solid:BRepSolid,

        pretty:boolean = true

    ):string {



        return JSON.stringify(

            this.serialize(
                solid
            ),

            null,

            pretty
            ?
            4
            :
            0

        );

    }





    /**
     * JSON import
     *
     * Placeholder:
     * Geometry reconstruction
     * sonraki kernel aşamasında genişletilecek.
     */
    static deserialize(

        data:BRepSerializedData

    ):BRepSolid {



        const solid =
            new BRepSolid();



        solid.metadata =
            {
                ...data.metadata
            };



        /*
            İleri aşamada:

            - Vertex registry
            - Edge linking
            - Surface restore
            - Topology rebuild

            yapılacak.
        */



        return solid;

    }





    /**
     * JSON string import
     */
    static fromJSON(

        json:string

    ):BRepSolid {



        const data =
            JSON.parse(
                json
            );



        return this.deserialize(
            data
        );

    }





    /**
     * Versiyon bilgisi
     */
    static version():string {


        return this.VERSION;

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:
                "BRepSerializer",


            version:
                this.VERSION,


            status:
                "READY"


        };

    }


}