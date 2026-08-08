import { Solid }
from "../core/Solid";


import { Shell }
from "../core/Shell";


import { Face }
from "../core/Face";


import { Edge }
from "../core/Edge";


import { Vertex }
from "../core/Vertex";


import { Wire }
from "../core/Wire";







export class TopologyExplorer {



    constructor(

        public solid:Solid

    ){}



    







    getSolids():

    Solid[] {



        return [

            this.solid

        ];

    }









    getShells():

    Shell[] {



        return this.solid

        .getShells();

    }









    getFaces():

    Face[] {



        return this.solid

        .getFaces();

    }









    getEdges():

    Edge[] {



        return this.solid

        .getEdges();

    }









    getVertices():

    Vertex[] {



        return this.solid

        .getVertices();

    }









    getWires():

    Wire[] {



        const wires:

        Wire[] = [];





        for(

            const face of

            this.getFaces()

        ){



            for(

                const wire of

                face.getWires()

            ){



                if(

                    !wires.includes(

                        wire

                    )

                ){



                    wires.push(

                        wire

                    );

                }

            }

        }





        return wires;

    }









    getEdgesOfFace(

        face:Face

    ):

    Edge[] {



        return face

        .getEdges();

    }









    getVerticesOfFace(

        face:Face

    ):

    Vertex[] {



        const vertices:

        Vertex[] = [];





        for(

            const edge of

            face.getEdges()

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









    getFacesOfEdge(

        edge:Edge

    ):

    Face[] {



        const result:

        Face[] = [];





        for(

            const face of

            this.getFaces()

        ){



            if(

                face.containsEdge(

                    edge

                )

            ){



                result.push(

                    face

                );

            }

        }





        return result;

    }









    getEdgesOfVertex(

        vertex:Vertex

    ):

    Edge[] {



        return vertex

        .getEdges();

    }









    getFacesOfVertex(

        vertex:Vertex

    ):

    Face[] {



        const result:

        Face[] = [];





        for(

            const face of

            this.getFaces()

        ){



            if(

                face.getVertices()

                .includes(

                    vertex

                )

            ){



                result.push(

                    face

                );

            }

        }





        return result;

    }









    getConnectedFaces(

        face:Face

    ):

    Face[] {



        const connected:

        Face[] = [];





        for(

            const edge of

            face.getEdges()

        ){



            for(

                const neighbour of

                this.getFacesOfEdge(

                    edge

                )

            ){



                if(

                    neighbour !== face

                    &&

                    !connected.includes(

                        neighbour

                    )

                ){



                    connected.push(

                        neighbour

                    );

                }

            }

        }





        return connected;

    }









    getAdjacentEdges(

        edge:Edge

    ):

    Edge[] {



        const result:

        Edge[] = [];





        const vertices =

        [

            edge.start,

            edge.end

        ];





        for(

            const vertex of

            vertices

        ){



            for(

                const other of

                vertex.getEdges()

            ){



                if(

                    other !== edge

                    &&

                    !result.includes(

                        other

                    )

                ){



                    result.push(

                        other

                    );

                }

            }

        }





        return result;

    }









    findFaceByEdge(

        edge:Edge

    ):

    Face|null {



        const faces =

        this.getFacesOfEdge(

            edge

        );





        return faces.length

        ?

        faces[0]

        :

        null;

    }









    findFacesByEdge(

        edge:Edge

    ):

    Face[] {



        return this.getFacesOfEdge(

            edge

        );

    }









    findVertexByPosition(

        vertex:Vertex,

        tolerance:number = 1e-6

    ):

    Vertex|null {



        for(

            const v of

            this.getVertices()

        ){



            if(

                v.equals(

                    vertex,

                    tolerance

                )

            ){



                return v;

            }

        }





        return null;

    }









    countFaces():

    number {



        return this.getFaces()

        .length;

    }









    countEdges():

    number {



        return this.getEdges()

        .length;

    }









    countVertices():

    number {



        return this.getVertices()

        .length;

    }









    isManifold():

    boolean {



        for(

            const edge of

            this.getEdges()

        ){



            const faces =

            this.getFacesOfEdge(

                edge

            );





            if(

                faces.length !== 2

            ){



                return false;

            }

        }





        for(

            const shell of

            this.getShells()

        ){



            if(

                !shell.isClosed()

            ){



                return false;

            }

        }





        return true;

    }







}