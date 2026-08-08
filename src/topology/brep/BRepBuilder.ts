import { Vertex }
from "../core/Vertex";


import { Edge }
from "../core/Edge";


import { HalfEdge }
from "../core/HalfEdge";


import { Wire }
from "../core/Wire";


import { Face }
from "../core/Face";


import { Shell }
from "../core/Shell";


import { Solid }
from "../core/Solid";


import { Surface }
from "../../geometry/surface/Surface";







export class BRepBuilder {









    createVertex(

        vertex:Vertex

    ):

    Vertex {



        return vertex;

    }









    createEdge(

        start:Vertex,


        end:Vertex,


        curve:any = null

    ):

    Edge {



        if(

            start === end

        ){

            throw new Error(

                "Edge start and end cannot be same vertex"

            );

        }





        return new Edge(

            start,

            end,

            curve

        );

    }









    createWire(

        edges:Edge[]

    ):

    Wire {



        if(

            edges.length === 0

        ){

            throw new Error(

                "Cannot create empty wire"

            );

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





        if(

            !wire.isClosed()

        ){

            throw new Error(

                "Wire creation failed: not closed"

            );

        }





        return wire;

    }









    createFace(

        surface:

        Surface | null,


        wire:Wire

    ):

    Face {



        if(

            !wire.isClosed()

        ){

            throw new Error(

                "Face requires closed wire"

            );

        }





        return new Face(

            surface,

            wire

        );

    }









    addInnerWire(

        face:Face,


        wire:Wire

    ):

    void {



        if(

            !wire.isClosed()

        ){

            throw new Error(

                "Hole wire must be closed"

            );

        }





        face.addInnerWire(

            wire

        );

    }









    createShell(

        faces:Face[]

    ):

    Shell {



        if(

            faces.length === 0

        ){

            throw new Error(

                "Shell requires faces"

            );

        }





        return new Shell(

            faces

        );

    }









    createSolid(

        shell:Shell

    ):

    Solid {



        return new Solid(

            shell

        );

    }









    createSolidFromFaces(

        faces:Face[]

    ):

    Solid {



        return this.createSolid(

            this.createShell(

                faces

            )

        );

    }









    connectTwinEdges(

        edgeA:Edge,


        edgeB:Edge

    ):

    [

        HalfEdge,

        HalfEdge

    ] {



        const halfA =

        new HalfEdge(

            edgeA,

            edgeA.start,

            edgeA.end

        );





        const halfB =

        new HalfEdge(

            edgeB,

            edgeB.end,

            edgeB.start

        );





        halfA.setTwin(

            halfB

        );





        return [

            halfA,

            halfB

        ];

    }









    validateWire(

        wire:Wire

    ):

    boolean {



        if(

            !wire

        ){

            return false;

        }





        if(

            wire.getEdges()

            .length === 0

        ){

            return false;

        }





        return wire.isClosed();

    }









    validateFace(

        face:Face

    ):

    boolean {



        if(

            !face

        ){

            return false;

        }





        const wire =

        face.getOuterWire();





        return this.validateWire(

            wire

        );

    }









    validateShell(

        shell:Shell

    ):

    boolean {



        if(

            !shell

        ){

            return false;

        }





        return (

            shell.getFaces()

            .length > 0

            &&

            shell.isClosed()

        );

    }









    validateSolid(

        solid:Solid

    ):

    boolean {



        if(

            !solid

        ){

            return false;

        }





        return solid.isValid();

    }







}