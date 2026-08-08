import { BRepSolid } from "./BRepSolid";
import { BRepVertex } from "./BRepVertex";
import { BRepFace } from "./BRepFace";
import { Point3 } from "../point/Point3";
import { Transform } from "../../math/transform/Transform";



export class BRepTransform {



    /**
     * Solid translate
     */
    static translate(

        solid:BRepSolid,

        x:number,

        y:number,

        z:number

    ):BRepSolid {


        const result =
            solid.clone();



        for(
            const shell of result.shells
        ){

            for(
                const face of shell.faces
            ){

                this.transformFace(

                    face,

                    Transform
                        .translation(
                            x,
                            y,
                            z
                        )

                );

            }

        }



        return result;

    }





    /**
     * Genel transform
     */
    static apply(

        solid:BRepSolid,

        transform:Transform

    ):BRepSolid {


        const result =
            solid.clone();



        for(
            const shell of result.shells
        ){


            for(
                const face of shell.faces
            ){


                this.transformFace(

                    face,

                    transform

                );

            }

        }



        return result;

    }





    /**
     * Face transform
     */
    private static transformFace(

        face:BRepFace,

        transform:Transform

    ):void {


        /*
            Surface transform

            Gerçek kernelde:

            - Surface parametreleri
            - UV mapping
            - Trim curve

            güncellenir.
        */



        for(
            const loop of [
                face.outerLoop,
                ...face.innerLoops
            ]
        ){


            for(
                const edge of loop.edges
            ){


                this.transformVertex(

                    edge.startVertex,

                    transform

                );


                this.transformVertex(

                    edge.endVertex,

                    transform

                );

            }

        }

    }





    /**
     * Vertex transform
     */
    private static transformVertex(

        vertex:BRepVertex,

        transform:Transform

    ):void {


        vertex.point =

            transform.applyPoint(

                vertex.point

            );

    }





    /**
     * Scale
     */
    static scale(

        solid:BRepSolid,

        factor:number

    ):BRepSolid {


        return this.apply(

            solid,

            Transform.scale(
                factor,
                factor,
                factor
            )

        );

    }





    /**
     * X ekseni mirror
     */
    static mirrorX(

        solid:BRepSolid

    ):BRepSolid {


        return this.apply(

            solid,

            Transform.scale(
                -1,
                1,
                1
            )

        );

    }





    /**
     * Y ekseni mirror
     */
    static mirrorY(

        solid:BRepSolid

    ):BRepSolid {


        return this.apply(

            solid,

            Transform.scale(
                1,
                -1,
                1
            )

        );

    }





    /**
     * Z ekseni mirror
     */
    static mirrorZ(

        solid:BRepSolid

    ):BRepSolid {


        return this.apply(

            solid,

            Transform.scale(
                1,
                1,
                -1
            )

        );

    }





    /**
     * Bounding transform bilgisi
     */
    static info(

        operation:string

    ){

        return {

            engine:
                "BRepTransform",


            operation,


            status:
                "READY"

        };

    }

}