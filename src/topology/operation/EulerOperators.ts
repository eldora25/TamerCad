import { Solid }
from "../core/Solid";


import { Shell }
from "../core/Shell";


import { Face }
from "../core/Face";


import { Edge }
from "../core/Edge";


import { Wire }
from "../core/Wire";


import { Vertex }
from "../core/Vertex";


import { Point }
from "../../geometry/core/Point";


import { BRepBuilder }
from "../brep/BRepBuilder";







export class EulerOperators {







    constructor(

        private builder:

        BRepBuilder =

        new BRepBuilder()

    ){}



    







    makeVertex(

        x:number,

        y:number,

        z:number

    ):

    Vertex {



        return this.builder

        .createVertex(

            new Vertex(

                new Point(

                    x,

                    y,

                    z

                )

            )

        );

    }









    makeEdge(

        start:Vertex,

        end:Vertex

    ):

    Edge {



        return this.builder

        .createEdge(

            start,

            end

        );

    }









    makeWire(

        edges:Edge[]

    ):

    Wire {



        return this.builder

        .createWire(

            edges

        );

    }









    makeFace(

        wire:Wire

    ):

    Face {



        return this.builder

        .createFace(

            null as any,

            wire

        );

    }









    addFaceToShell(

        shell:Shell,

        face:Face

    ):

    void {



        shell.addFace(

            face

        );

    }









    removeFaceFromShell(

        shell:Shell,

        face:Face

    ):

    void {



        shell.removeFace(

            face

        );

    }









    splitEdge(

        edge:Edge,

        vertex:Vertex

    ):

    Edge[] {



        const first =

        new Edge(

            edge.start,

            vertex,

            edge.curve

        );





        const second =

        new Edge(

            vertex,

            edge.end,

            edge.curve

        );





        return [

            first,

            second

        ];

    }









    joinEdges(

        edgeA:Edge,

        edgeB:Edge

    ):

    Edge|null {



        if(

            edgeA.end !==

            edgeB.start

        ){



            return null;

        }





        return new Edge(

            edgeA.start,

            edgeB.end,

            edgeA.curve

        );

    }









    addHole(

        face:Face,

        wire:Wire

    ):

    void {



        face.addInnerWire(

            wire

        );

    }









    removeHole(

        face:Face,

        wire:Wire

    ):

    boolean {



        const holes =

        face.getInnerWires();





        const index =

        holes.indexOf(

            wire

        );





        if(

            index === -1

        ){

            return false;

        }





        holes.splice(

            index,

            1

        );





        return true;

    }









    mergeFaces(

        faceA:Face,

        faceB:Face

    ):

    Face|null {



        const shared =

        faceA.getEdges()

        .find(

            edge =>

            faceB.containsEdge(

                edge

            )

        );





        if(

            !shared

        ){



            return null;

        }





        const edges =

        [

            ...faceA.getEdges()

            .filter(

                e =>

                e !== shared

            ),


            ...faceB.getEdges()

            .filter(

                e =>

                e !== shared

            )

        ];





        if(

            edges.length === 0

        ){

            return null;

        }





        const wire =

        this.makeWire(

            edges

        );





        return this.makeFace(

            wire

        );

    }









    checkEuler(

        solid:Solid

    ):

    boolean {



        const V =

        solid.getVertices()

        .length;



        const E =

        solid.getEdges()

        .length;



        const F =

        solid.getFaces()

        .length;





        return (

            V -

            E +

            F

        )

        ===

        2;

    }









    getBuilder():

    BRepBuilder {



        return this.builder;

    }







}