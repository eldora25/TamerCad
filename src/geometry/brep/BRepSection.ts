import { BRepSolid } from "./BRepSolid";
import { BRepFace } from "./BRepFace";
import { BRepEdge } from "./BRepEdge";
import { Point3 } from "../point/Point3";



export interface Plane {


    origin:Point3;


    normal:Point3;

}



export interface SectionResult {


    success:boolean;


    curves:BRepEdge[];


    points:Point3[];


    loops:any[];


    message:string;

}



export class BRepSection {



    /**
     * Solid ile düzlem kesişimi
     */
    static sectionByPlane(

        solid:BRepSolid,

        plane:Plane

    ):SectionResult {



        const points:Point3[] =
            [];



        const curves:BRepEdge[] =
            [];



        for(
            const shell of solid.shells
        ){


            for(
                const face of shell.faces
            ){


                const result =
                    this.intersectFacePlane(

                        face,

                        plane

                    );



                points.push(

                    ...result.points

                );


                curves.push(

                    ...result.edges

                );

            }

        }



        return {


            success:true,


            curves,


            points,


            loops:
                this.buildLoops(
                    curves
                ),


            message:
                "Section generated"


        };

    }





    /**
     * Face-plane intersection
     */
    static intersectFacePlane(

        face:BRepFace,

        plane:Plane

    ):{

        points:Point3[],

        edges:BRepEdge[]

    } {



        /*
            Gerçek kernel:

            1. Surface-plane intersection

            2. Trim boundary kontrolü

            3. Intersection curve oluşturma

        */



        return {


            points:[],


            edges:[]

        };

    }





    /**
     * Edge-plane intersection
     */
    static intersectEdgePlane(

        edge:BRepEdge,

        plane:Plane

    ):Point3|null {



        /*
            Line / Curve intersection

            ileride:

            - Line
            - Circle
            - Bezier
            - Nurbs

            desteklenecek.

        */



        return null;

    }





    /**
     * Kesit eğrilerinden loop oluşturma
     */
    static buildLoops(

        edges:BRepEdge[]

    ):any[] {



        const loops:any[] =
            [];



        /*
            Topology graph kullanılarak:

            Edge chaining

            yapılır.

        */



        return loops;

    }





    /**
     * Kesit profil çıkarma
     */
    static extractProfile(

        solid:BRepSolid,

        plane:Plane

    ){


        const section =
            this.sectionByPlane(

                solid,

                plane

            );



        return {


            closed:

                section.loops.length > 0,


            curves:

                section.curves,


            points:

                section.points


        };

    }





    /**
     * Çoklu düzlem kesiti
     */
    static multipleSections(

        solid:BRepSolid,

        planes:Plane[]

    ):SectionResult[] {



        return planes.map(

            plane =>

                this.sectionByPlane(

                    solid,

                    plane

                )

        );

    }





    /**
     * Alan hesabı için kesit hazırlama
     */
    static prepareAnalysis(

        result:SectionResult

    ){



        return {


            curveCount:
                result.curves.length,


            pointCount:
                result.points.length,


            closedProfiles:
                result.loops.length


        };

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:
                "BRepSection",


            status:
                "READY"


        };

    }


}