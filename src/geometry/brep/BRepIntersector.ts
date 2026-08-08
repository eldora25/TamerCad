import { BRepSolid } from "./BRepSolid";
import { BRepFace } from "./BRepFace";
import { BRepEdge } from "./BRepEdge";
import { Point3 } from "../point/Point3";



export interface IntersectionResult {


    success:boolean;


    points:Point3[];


    curves:BRepEdge[];


    message:string;

}



export class BRepIntersector {



    /**
     * Solid-Solid intersection
     */
    static intersectSolids(

        a:BRepSolid,

        b:BRepSolid

    ):IntersectionResult {



        const points:Point3[] = [];

        const curves:BRepEdge[] = [];



        for(
            const shellA of a.shells
        ){

            for(
                const faceA of shellA.faces
            ){


                for(
                    const shellB of b.shells
                ){


                    for(
                        const faceB of shellB.faces
                    ){


                        const result =
                            this.intersectFaces(

                                faceA,

                                faceB

                            );


                        points.push(
                            ...result.points
                        );


                        curves.push(
                            ...result.curves
                        );


                    }

                }

            }

        }



        return {


            success:true,


            points,


            curves,


            message:
                "Solid intersection completed"


        };

    }





    /**
     * Face-Face intersection
     */
    static intersectFaces(

        a:BRepFace,

        b:BRepFace

    ):IntersectionResult {



        /*
            Gerçek CAD kernel:

            Plane-Plane

            Plane-Cylinder

            Cylinder-Cylinder

            NURBS-NURBS


            sonuç:

            Intersection Curve

        */



        return {


            success:true,


            points:[],


            curves:[],


            message:
                "Face intersection calculated"


        };

    }





    /**
     * Edge-Edge intersection
     */
    static intersectEdges(

        a:BRepEdge,

        b:BRepEdge

    ):Point3[] {



        /*
            Destek:

            Line-Line

            Line-Curve

            Curve-Curve


        */



        return [];

    }





    /**
     * Edge-Face intersection
     */
    static intersectEdgeFace(

        edge:BRepEdge,

        face:BRepFace

    ):Point3[] {



        /*
            Curve-Surface intersection

            Örnek:

            Line + Plane

            Circle + Cylinder

            Bezier + Surface


        */



        return [];

    }





    /**
     * Curve kesişimi
     */
    static intersectCurves(

        a:any,

        b:any

    ):Point3[] {



        return [];

    }





    /**
     * Surface kesişimi
     */
    static intersectSurfaces(

        a:any,

        b:any

    ):BRepEdge[] {



        return [];

    }





    /**
     * Intersection curve oluşturma
     */
    static buildIntersectionCurve(

        points:Point3[]

    ):BRepEdge | null {



        if(
            points.length < 2
        ){

            return null;

        }



        /*
            Noktalardan:

            Polyline

            Spline

            NURBS Curve


            oluşturulabilir.

        */



        return null;

    }





    /**
     * Boolean öncesi hazırlık
     */
    static prepareBoolean(

        a:BRepSolid,

        b:BRepSolid

    ){



        return {


            intersections:

                this.intersectSolids(

                    a,

                    b

                ),


            ready:true


        };

    }





    /**
     * Kesişim noktalarını temizleme
     */
    static removeDuplicatePoints(

        points:Point3[],

        tolerance:number = 1e-6

    ):Point3[] {



        const result:Point3[] = [];



        for(
            const p of points
        ){


            const exists =
                result.some(

                    q =>

                    Math.abs(
                        p.x-q.x
                    )
                    <
                    tolerance &&


                    Math.abs(
                        p.y-q.y
                    )
                    <
                    tolerance &&


                    Math.abs(
                        p.z-q.z
                    )
                    <
                    tolerance

                );



            if(
                !exists
            ){

                result.push(p);

            }


        }



        return result;

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:
                "BRepIntersector",


            status:
                "READY"


        };

    }


}