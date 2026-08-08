import { BRepSolid } from "./BRepSolid";
import { BRepShell } from "./BRepShell";
import { BRepFace } from "./BRepFace";
import { BRepLoop } from "./BRepLoop";
import { BRepVertex } from "./BRepVertex";
import { BRepEdge } from "./BRepEdge";

import { BoxSolid3 } from "../solid/BoxSolid3";
import { CylinderSolid3 } from "../solid/CylinderSolid3";
import { SphereSolid3 } from "../solid/SphereSolid3";

import { LineCurve3 } from "../curve/LineCurve3";



export class BRepBuilder {



    /**
     * Box → BRepSolid
     */
    static fromBox(
        box:BoxSolid3
    ):BRepSolid {


        const solid =
            new BRepSolid();



        const shell =
            new BRepShell();



        /*
            Şimdilik primitive yüzeyleri
            BRepFace olarak sarıyoruz.
        */


        for(
            const surface of box.getSurfaces()
        ){


            const loop =
                new BRepLoop();



            const face =
                new BRepFace(

                    surface,

                    loop

                );



            shell.addFace(
                face
            );

        }



        solid.addShell(
            shell
        );



        return solid;

    }





    /**
     * Cylinder → BRepSolid
     */
    static fromCylinder(
        cylinder:CylinderSolid3
    ):BRepSolid {


        const solid =
            new BRepSolid();



        const shell =
            new BRepShell();



        for(
            const surface of cylinder.getSurfaces()
        ){


            const loop =
                new BRepLoop();



            const face =
                new BRepFace(

                    surface,

                    loop

                );



            shell.addFace(
                face
            );

        }



        solid.addShell(
            shell
        );



        return solid;

    }





    /**
     * Sphere → BRepSolid
     */
    static fromSphere(
        sphere:SphereSolid3
    ):BRepSolid {


        const solid =
            new BRepSolid();



        const shell =
            new BRepShell();



        for(
            const surface of sphere.getSurfaces()
        ){


            const loop =
                new BRepLoop();



            const face =
                new BRepFace(

                    surface,

                    loop

                );



            shell.addFace(
                face
            );

        }



        solid.addShell(
            shell
        );



        return solid;

    }





    /**
     * Generic Solid Factory
     */
    static build(
        solid:any
    ):BRepSolid {


        if(
            solid instanceof BoxSolid3
        ){

            return this.fromBox(
                solid
            );

        }



        if(
            solid instanceof CylinderSolid3
        ){

            return this.fromCylinder(
                solid
            );

        }



        if(
            solid instanceof SphereSolid3
        ){

            return this.fromSphere(
                solid
            );

        }



        throw new Error(

            "Unsupported solid type"

        );

    }





    /**
     * Vertex oluşturucu
     */
    static createVertex(
        point
    ):BRepVertex {


        return new BRepVertex(
            point
        );

    }





    /**
     * Edge oluşturucu
     */
    static createEdge(

        start:BRepVertex,

        end:BRepVertex,

        curve:LineCurve3

    ):BRepEdge {


        return new BRepEdge(

            start,

            end,

            curve

        );

    }





    /**
     * Boş BRep solid
     */
    static empty():BRepSolid {


        return new BRepSolid();

    }


}