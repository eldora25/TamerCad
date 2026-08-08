import { BRepSolid } from "./BRepSolid";
import { BRepVertex } from "./BRepVertex";
import { BRepEdge } from "./BRepEdge";
import { BRepFace } from "./BRepFace";
import { BRepShell } from "./BRepShell";



export interface TopologyNode {


    id:string;


    type:
        "vertex"
        |
        "edge"
        |
        "face";

}



export class BRepTopologyGraph {



    public vertices:
        Map<string, BRepVertex>;



    public edges:
        Map<string, BRepEdge>;



    public faces:
        Map<string, BRepFace>;



    /**
     * Vertex bağlantıları
     */
    public vertexGraph:
        Map<string,string[]>;



    /**
     * Face komşulukları
     */
    public faceGraph:
        Map<string,string[]>;



    constructor(){


        this.vertices =
            new Map();



        this.edges =
            new Map();



        this.faces =
            new Map();



        this.vertexGraph =
            new Map();



        this.faceGraph =
            new Map();

    }





    /**
     * Solid'den graph oluşturma
     */
    static fromSolid(

        solid:BRepSolid

    ):BRepTopologyGraph {


        const graph =
            new BRepTopologyGraph();



        for(
            const shell of solid.shells
        ){

            graph.addShell(
                shell
            );

        }



        return graph;

    }





    /**
     * Shell ekleme
     */
    addShell(

        shell:BRepShell

    ):void {


        for(
            const face of shell.faces
        ){

            this.addFace(
                face
            );

        }

    }





    /**
     * Face ekleme
     */
    addFace(

        face:BRepFace

    ):void {


        this.faces.set(

            face.id,

            face

        );



        this.faceGraph.set(

            face.id,

            []

        );



        this.processLoop(

            face

        );

    }





    /**
     * Loop işleme
     */
    private processLoop(

        face:BRepFace

    ):void {


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


                this.addEdge(

                    edge

                );


                this.linkFaceEdge(

                    face,

                    edge

                );

            }

        }

    }





    /**
     * Edge ekleme
     */
    addEdge(

        edge:BRepEdge

    ):void {


        this.edges.set(

            edge.id,

            edge

        );



        this.addVertex(

            edge.startVertex

        );


        this.addVertex(

            edge.endVertex

        );



        this.connectVertices(

            edge.startVertex,

            edge.endVertex

        );

    }





    /**
     * Vertex ekleme
     */
    addVertex(

        vertex:BRepVertex

    ):void {


        if(
            !this.vertices.has(
                vertex.id
            )
        ){

            this.vertices.set(

                vertex.id,

                vertex

            );


            this.vertexGraph.set(

                vertex.id,

                []

            );

        }

    }





    /**
     * Vertex bağlantısı
     */
    private connectVertices(

        a:BRepVertex,

        b:BRepVertex

    ):void {


        this.vertexGraph
            .get(a.id)
            ?.push(
                b.id
            );



        this.vertexGraph
            .get(b.id)
            ?.push(
                a.id
            );

    }





    /**
     * Face adjacency bağlantısı
     */
    private linkFaceEdge(

        face:BRepFace,

        edge:BRepEdge

    ):void {


        for(
            const otherFace of edge.faces
        ){


            if(
                otherFace !== face.id
            ){

                this.faceGraph
                    .get(face.id)
                    ?.push(
                        otherFace
                    );

            }

        }

    }





    /**
     * Vertex komşuları
     */
    vertexNeighbors(

        vertexId:string

    ):string[] {


        return (

            this.vertexGraph
                .get(vertexId)
            ??
            []

        );

    }





    /**
     * Face komşuları
     */
    faceNeighbors(

        faceId:string

    ):string[] {


        return (

            this.faceGraph
                .get(faceId)
            ??
            []

        );

    }





    /**
     * Edge alma
     */
    getEdge(

        id:string

    ):BRepEdge | undefined {


        return this.edges.get(
            id
        );

    }





    /**
     * Face alma
     */
    getFace(

        id:string

    ):BRepFace | undefined {


        return this.faces.get(
            id
        );

    }





    /**
     * Graph node sayıları
     */
    statistics(){


        return {


            vertices:
                this.vertices.size,


            edges:
                this.edges.size,


            faces:
                this.faces.size


        };

    }





    /**
     * Debug
     */
    info(){


        return {


            engine:
                "BRepTopologyGraph",


            status:
                "READY"


        };

    }


}