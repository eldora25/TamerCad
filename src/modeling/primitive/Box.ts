import { Point }
from "../../geometry/core/Point";


import { PlaneSurface }
from "../../geometry/surface/PlaneSurface";


import { Vector3 }
from "../../geometry/core/Vector3";


import { Vertex }
from "../../topology/core/Vertex";


import { Edge }
from "../../topology/core/Edge";


import { Wire }
from "../../topology/core/Wire";


import { Face }
from "../../topology/core/Face";


import { Shell }
from "../../topology/core/Shell";


import { Solid }
from "../../topology/core/Solid";


import { BRepBuilder }
from "../../topology/brep/BRepBuilder";



export class Box {



    constructor(

        public width:number,

        public height:number,

        public depth:number,

        public origin:

        Point = new Point(0,0,0)

    ){}



    build():

    Solid {



        const builder =

        new BRepBuilder();



        const vertices =

        this.createVertices();



        const edges =

        this.createEdges(

            vertices

        );



        const faces =

        this.createFaces(

            vertices,

            edges

        );



        const shell =

        builder.createShell(

            faces

        );



        return builder.createSolid(

            shell

        );

    }







    private createVertices():

    Vertex[] {



        const x =

        this.origin.x;



        const y =

        this.origin.y;



        const z =

        this.origin.z;



        return [


            new Vertex(

                new Point(

                    x,

                    y,

                    z

                )

            ),


            new Vertex(

                new Point(

                    x+this.width,

                    y,

                    z

                )

            ),


            new Vertex(

                new Point(

                    x+this.width,

                    y+this.height,

                    z

                )

            ),


            new Vertex(

                new Point(

                    x,

                    y+this.height,

                    z

                )

            ),


            new Vertex(

                new Point(

                    x,

                    y,

                    z+this.depth

                )

            ),


            new Vertex(

                new Point(

                    x+this.width,

                    y,

                    z+this.depth

                )

            ),


            new Vertex(

                new Point(

                    x+this.width,

                    y+this.height,

                    z+this.depth

                )

            ),


            new Vertex(

                new Point(

                    x,

                    y+this.height,

                    z+this.depth

                )

            )

        ];

    }







    private createEdges(

        v:Vertex[]

    ):

    Edge[] {



        return [


            new Edge(v[0],v[1]),

            new Edge(v[1],v[2]),

            new Edge(v[2],v[3]),

            new Edge(v[3],v[0]),



            new Edge(v[4],v[5]),

            new Edge(v[5],v[6]),

            new Edge(v[6],v[7]),

            new Edge(v[7],v[4]),



            new Edge(v[0],v[4]),

            new Edge(v[1],v[5]),

            new Edge(v[2],v[6]),

            new Edge(v[3],v[7])

        ];

    }







    private createFaces(

        vertices:Vertex[],

        edges:Edge[]

    ):

    Face[] {



        const faces:

        Face[]=[];



        const makeFace =

        (

            ids:number[]

        ) => {



            const wire =

            new Wire();



            for(

                const id of ids

            ){



                wire.addHalfEdge(

                    edges[id]

                    .halfEdge1!

                );

            }



            return new Face(

                new PlaneSurface(),

                wire

            );

        };



        faces.push(

            makeFace([0,1,2,3])

        );



        faces.push(

            makeFace([4,5,6,7])

        );



        faces.push(

            makeFace([0,9,4,8])

        );



        faces.push(

            makeFace([2,10,6,11])

        );



        faces.push(

            makeFace([3,8,7,11])

        );



        faces.push(

            makeFace([0,1,5,4])

        );



        return faces;

    }



}