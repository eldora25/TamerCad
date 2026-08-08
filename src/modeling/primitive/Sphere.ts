import { Point }
from "../../geometry/core/Point";


import { SphereSurface }
from "../../geometry/surface/SphereSurface";


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



export class Sphere {



    constructor(

        public radius:number,

        public center:

        Point = new Point(

            0,

            0,

            0

        )

    ){}





    build():

    Solid {



        const builder =

        new BRepBuilder();



        const surface =

        new SphereSurface(

            this.radius,

            this.center

        );



        const vertices =

        this.createPoleVertices();



        const edges =

        this.createEdges(

            vertices

        );



        const wire =

        this.createWire(

            edges

        );



        const face =

        builder.createFace(

            surface,

            wire

        );



        const shell =

        builder.createShell(

            [

                face

            ]

        );



        return builder.createSolid(

            shell

        );

    }







    private createPoleVertices():

    Vertex[] {



        const north =

        new Vertex(

            new Point(

                this.center.x,

                this.center.y,

                this.center.z +

                this.radius

            )

        );



        const south =

        new Vertex(

            new Point(

                this.center.x,

                this.center.y,

                this.center.z -

                this.radius

            )

        );



        return [

            north,

            south

        ];

    }







    private createEdges(

        vertices:Vertex[]

    ):

    Edge[] {



        const edges:

        Edge[]=[];



        const north =

        vertices[0];



        const south =

        vertices[1];



        const segments =

        32;



        let previous:

        Vertex|null = null;



        for(

            let i=0;

            i<segments;

            i++

        ){



            const angle =

            (

                Math.PI*2*i

            )

            /

            segments;



            const ringVertex =

            new Vertex(

                new Point(

                    this.center.x +

                    Math.cos(angle)

                    *

                    this.radius,


                    this.center.y +

                    Math.sin(angle)

                    *

                    this.radius,


                    this.center.z

                )

            );



            edges.push(

                new Edge(

                    north,

                    ringVertex

                )

            );



            edges.push(

                new Edge(

                    ringVertex,

                    south

                )

            );



            previous =

            ringVertex;

        }



        return edges;

    }







    private createWire(

        edges:Edge[]

    ):

    Wire {



        const wire =

        new Wire();



        for(

            const edge of

            edges

        ){



            if(

                edge.halfEdge1

            ){



                wire.addHalfEdge(

                    edge.halfEdge1

                );

            }

        }



        return wire;

    }



}