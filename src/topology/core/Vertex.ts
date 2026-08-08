import { Point }
from "../../geometry/core/Point";


import { Vector3 }
from "../../geometry/core/Vector3";


import { Edge }
from "./Edge";







export class Vertex {



    private edges:

    Edge[] = [];







    constructor(

        public position:Point

    ){}



    







    addEdge(

        edge:Edge

    ):

    void {



        if(

            !this.edges.includes(

                edge

            )

        ){



            this.edges.push(

                edge

            );

        }

    }









    removeEdge(

        edge:Edge

    ):

    void {



        const index =

        this.edges.indexOf(

            edge

        );





        if(

            index !== -1

        ){



            this.edges.splice(

                index,

                1

            );

        }

    }









    getEdges():

    Edge[] {



        return [

            ...this.edges

        ];

    }









    degree():

    number {



        return this.edges.length;

    }









    distanceTo(

        vertex:Vertex

    ):

    number {



        return this.position

        .distanceTo(

            vertex.position

        );

    }









    equals(

        vertex:Vertex,

        tolerance:number = 1e-6

    ):

    boolean {



        return (

            this.distanceTo(

                vertex

            )

            <= tolerance

        );

    }









    clone():

    Vertex {



        return new Vertex(

            new Point(

                this.position.x,

                this.position.y,

                this.position.z

            )

        );

    }









    translate(

        vector:Vector3

    ):

    Vertex {



        return new Vertex(

            new Point(

                this.position.x +

                vector.x,


                this.position.y +

                vector.y,


                this.position.z +

                vector.z

            )

        );

    }









    setPosition(

        point:Point

    ):

    void {



        this.position =

        point;





        for(

            const edge of

            this.edges

        ){



            edge.invalidate?.();

        }

    }









    getPosition():

    Point {



        return this.position;

    }







}