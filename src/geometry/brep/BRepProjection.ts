import { BRepSolid } from "./BRepSolid";
import { BRepFace } from "./BRepFace";
import { BRepEdge } from "./BRepEdge";

import { Point3 } from "../point/Point3";



export interface ProjectionPlane {


    origin:Point3;


    normal:Point3;


    xAxis:Point3;


    yAxis:Point3;

}



export interface Point2 {


    x:number;


    y:number;

}



export interface ProjectionResult {


    points:Point2[];


    edges:any[];


    curves:any[];


    success:boolean;


}



export class BRepProjection {



    /**
     * Point 3D → 2D projection
     */
    static projectPoint(

        point:Point3,

        plane:ProjectionPlane

    ):Point2 {



        const dx =
            point.x -
            plane.origin.x;


        const dy =
            point.y -
            plane.origin.y;


        const dz =
            point.z -
            plane.origin.z;



        return {


            x:

                dx * plane.xAxis.x +

                dy * plane.xAxis.y +

                dz * plane.xAxis.z,



            y:

                dx * plane.yAxis.x +

                dy * plane.yAxis.y +

                dz * plane.yAxis.z


        };

    }





    /**
     * Edge projection
     */
    static projectEdge(

        edge:BRepEdge,

        plane:ProjectionPlane

    ){



        return {


            start:

                this.projectPoint(

                    edge.startVertex.point,

                    plane

                ),



            end:

                this.projectPoint(

                    edge.endVertex.point,

                    plane

                )

        };

    }





    /**
     * Face projection
     */
    static projectFace(

        face:BRepFace,

        plane:ProjectionPlane

    ):ProjectionResult {



        const points:Point2[] =
            [];



        const edges:any[] =
            [];



        const loops = [

            face.outerLoop,

            ...face.innerLoops

        ];



        for(
            const loop of loops
        ){


            for(
                const edge of loop.edges
            ){


                edges.push(

                    this.projectEdge(

                        edge,

                        plane

                    )

                );


                points.push(

                    this.projectPoint(

                        edge.startVertex.point,

                        plane

                    )

                );

            }

        }



        return {


            points,


            edges,


            curves:[],


            success:true


        };

    }





    /**
     * Solid görünüş projeksiyonu
     */
    static projectSolid(

        solid:BRepSolid,

        plane:ProjectionPlane

    ):ProjectionResult {



        const result:ProjectionResult = {


            points:[],


            edges:[],


            curves:[],


            success:true


        };



        for(
            const shell of solid.shells
        ){


            for(
                const face of shell.faces
            ){


                const projection =

                    this.projectFace(

                        face,

                        plane

                    );



                result.points.push(

                    ...projection.points

                );


                result.edges.push(

                    ...projection.edges

                );

            }

        }



        return result;

    }





    /**
     * Üst görünüş
     */
    static topView(

        solid:BRepSolid

    ):ProjectionResult {


        return this.projectSolid(

            solid,

            {

                origin:
                    new Point3(0,0,0),


                normal:
                    new Point3(0,0,1),


                xAxis:
                    new Point3(1,0,0),


                yAxis:
                    new Point3(0,1,0)

            }

        );

    }





    /**
     * Ön görünüş
     */
    static frontView(

        solid:BRepSolid

    ):ProjectionResult {


        return this.projectSolid(

            solid,

            {

                origin:
                    new Point3(0,0,0),


                normal:
                    new Point3(0,1,0),


                xAxis:
                    new Point3(1,0,0),


                yAxis:
                    new Point3(0,0,1)

            }

        );

    }





    /**
     * Yan görünüş
     */
    static sideView(

        solid:BRepSolid

    ):ProjectionResult {


        return this.projectSolid(

            solid,

            {

                origin:
                    new Point3(0,0,0),


                normal:
                    new Point3(1,0,0),


                xAxis:
                    new Point3(0,1,0),


                yAxis:
                    new Point3(0,0,1)

            }

        );

    }





    /**
     * Sketch için kontur çıkarma
     */
    static extractSketchProfile(

        solid:BRepSolid,

        plane:ProjectionPlane

    ){


        const result =
            this.projectSolid(

                solid,

                plane

            );


        return {


            geometry:

                result.edges,


            closed:

                result.edges.length > 0


        };

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:
                "BRepProjection",


            status:
                "READY"

        };

    }


}