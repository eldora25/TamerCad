import { Face }
from "../core/Face";

import { Edge }
from "../core/Edge";

import { Vertex }
from "../core/Vertex";

import { Wire }
from "../core/Wire";

import { Solid }
from "../core/Solid";

import { Point }
from "../../geometry/core/Point";

import { Curve }
from "../../geometry/curve/Curve";

import { SolidClassifier }
from "./SolidClassifier";







export interface SplitResult {


    faces:Face[];


    edges:Edge[];


    vertices:Vertex[];


    success:boolean;


    errors:string[];

}







export interface IntersectionResult {


    intersects:boolean;


    points:Point[];


    curve:Curve|null;


}







export class Splitter {







    private classifier:

    SolidClassifier;







    constructor(

        public tolerance:number = 1e-6

    ){



        this.classifier =

        new SolidClassifier(

            tolerance

        );

    }









    splitFace(

        face:Face,

        splitterCurve:Curve

    ):

    SplitResult {



        const errors:

        string[] = [];





        if(

            !face.surface

        ){



            return {


                faces:[face],


                edges:[],


                vertices:[],


                success:false,


                errors:[

                    "Face has no surface"

                ]

            };

        }









        const intersectionPoints =

        this.findCurveIntersections(

            face,

            splitterCurve

        );









        if(

            intersectionPoints.length < 2

        ){



            return {


                faces:[face],


                edges:[],


                vertices:[],


                success:false,


                errors:[

                    "Insufficient split points"

                ]

            };

        }









        const splitEdges =

        this.createSplitEdges(

            intersectionPoints

        );





        const wires =

        this.createSplitWires(

            face,

            splitEdges

        );









        const faces =

        wires.map(

            wire =>

            new Face(

                face.surface,

                wire

            )

        );









        return {


            faces,


            edges:splitEdges,


            vertices:

            this.collectVertices(

                splitEdges

            ),


            success:true,


            errors

        };

    }









    splitSolid(

        solid:Solid,

        tool:Solid

    ):

    SplitResult {



        const newFaces:

        Face[] = [];



        const newEdges:

        Edge[] = [];



        const newVertices:

        Vertex[] = [];



        const errors:

        string[] = [];









        for(

            const faceA of

            solid.getFaces()

        ){



            let splitted =

            false;









            for(

                const faceB of

                tool.getFaces()

            ){



                const intersection =

                this.intersectFaces(

                    faceA,

                    faceB

                );





                if(

                    intersection.intersects

                ){



                    const result =

                    this.splitFace(

                        faceA,

                        intersection.curve!

                    );





                    if(

                        result.success

                    ){



                        newFaces.push(

                            ...result.faces

                        );



                        newEdges.push(

                            ...result.edges

                        );



                        newVertices.push(

                            ...result.vertices

                        );



                        splitted = true;

                    }

                }

            }









            if(

                !splitted

            ){



                newFaces.push(

                    faceA

                );

            }

        }









        return {


            faces:newFaces,


            edges:newEdges,


            vertices:newVertices,


            success:

            errors.length === 0,


            errors

        };

    }









    intersectFaces(

        a:Face,

        b:Face

    ):

    IntersectionResult {



        if(

            !a.surface

            ||

            !b.surface

        ){



            return {


                intersects:false,


                points:[],


                curve:null

            };

        }









        /*


            Gerçek kernel:

            
            Surface-Surface Intersection


            Plane-plane:

                line


            Plane-cylinder:

                curve


            NURBS-NURBS:

                Newton iteration


        */







        return {


            intersects:false,


            points:[],


            curve:null

        };

    }









    private findCurveIntersections(

        face:Face,

        curve:Curve

    ):

    Point[] {



        const points:

        Point[] = [];





        /*


            Curve - Surface intersection



            Gerçek implementasyon:


            Newton solver



        */





        return points;

    }









    private createSplitEdges(

        points:Point[]

    ):

    Edge[] {



        const edges:

        Edge[] = [];





        for(

            let i = 0;

            i < points.length - 1;

            i++

        ){



            const start =

            new Vertex(

                points[i]

            );





            const end =

            new Vertex(

                points[i+1]

            );





            edges.push(

                new Edge(

                    start,

                    end

                )

            );

        }





        return edges;

    }









    private createSplitWires(

        face:Face,

        edges:Edge[]

    ):

    Wire[] {



        const wires:

        Wire[] = [];





        if(

            edges.length === 0

        ){

            return wires;

        }





        const wire =

        new Wire();





        for(

            const edge of

            edges

        ){



            wire.addEdge(

                edge

            );

        }





        wire.close();





        wires.push(

            wire

        );





        return wires;

    }









    private collectVertices(

        edges:Edge[]

    ):

    Vertex[] {



        const vertices:

        Vertex[] = [];





        for(

            const edge of

            edges

        ){



            if(

                !vertices.includes(

                    edge.start

                )

            ){

                vertices.push(

                    edge.start

                );

            }





            if(

                !vertices.includes(

                    edge.end

                )

            ){

                vertices.push(

                    edge.end

                );

            }

        }





        return vertices;

    }









    splitEdge(

        edge:Edge,

        parameter:number

    ):

    Edge[] {



        const point =

        this.interpolate(

            edge.start.position,

            edge.end.position,

            parameter

        );





        const vertex =

        new Vertex(

            point

        );





        return [


            new Edge(

                edge.start,

                vertex

            ),



            new Edge(

                vertex,

                edge.end

            )

        ];

    }









    private interpolate(

        a:Point,

        b:Point,

        t:number

    ):

    Point {



        return new Point(


            a.x +

            (

                b.x-a.x

            )

            *

            t,



            a.y +

            (

                b.y-a.y

            )

            *

            t,



            a.z +

            (

                b.z-a.z

            )

            *

            t


        );

    }







}