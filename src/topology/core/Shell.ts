import { Face }
from "./Face";


import { Edge }
from "./Edge";


import { Vertex }
from "./Vertex";







export class Shell {



    private faces:

    Face[] = [];



    public reversed:

    boolean = false;







    constructor(

        faces:Face[] = []

    ){



        this.faces =

        [

            ...faces

        ];

    }









    addFace(

        face:Face

    ):

    void {



        if(

            !this.faces.includes(

                face

            )

        ){



            this.faces.push(

                face

            );

        }

    }









    removeFace(

        face:Face

    ):

    boolean {



        const index =

        this.faces.indexOf(

            face

        );





        if(

            index === -1

        ){

            return false;

        }





        this.faces.splice(

            index,

            1

        );





        return true;

    }









    getFaces():

    Face[] {



        return [

            ...this.faces

        ];

    }









    getEdges():

    Edge[] {



        const edges:

        Edge[] = [];





        for(

            const face of

            this.faces

        ){



            for(

                const edge of

                face.getEdges()

            ){



                if(

                    !edges.some(

                        e =>

                        e.equals(

                            edge

                        )

                    )

                ){



                    edges.push(

                        edge

                    );

                }

            }

        }





        return edges;

    }









    getVertices():

    Vertex[] {



        const vertices:

        Vertex[] = [];





        for(

            const edge of

            this.getEdges()

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









    isClosed():

    boolean {



        const usage:

        Map<string,number> =

        new Map();





        for(

            const edge of

            this.getEdges()

        ){



            const key =

            [

                edge.start.position.x,

                edge.start.position.y,

                edge.start.position.z,

                edge.end.position.x,

                edge.end.position.y,

                edge.end.position.z

            ]

            .join(",");





            const reverseKey =

            [

                edge.end.position.x,

                edge.end.position.y,

                edge.end.position.z,

                edge.start.position.x,

                edge.start.position.y,

                edge.start.position.z

            ]

            .join(",");





            if(

                usage.has(

                    reverseKey

                )

            ){



                usage.set(

                    reverseKey,

                    usage.get(

                        reverseKey

                    )! - 1

                );

            }

            else {



                usage.set(

                    key,

                    (

                        usage.get(key)

                        ??

                        0

                    )

                    +

                    1

                );

            }

        }





        for(

            const value of

            usage.values()

        ){



            if(

                value !== 0

            ){

                return false;

            }

        }





        return true;

    }









    containsFace(

        face:Face

    ):

    boolean {



        return this.faces.includes(

            face

        );

    }









    faceCount():

    number {



        return this.faces.length;

    }









    reverse():

    Shell {



        const shell =

        new Shell(

            this.faces

            .map(

                face =>

                face.reverse()

            )

        );





        shell.reversed =

        !this.reversed;





        return shell;

    }









    clear():

    void {



        this.faces = [];

    }









    clone():

    Shell {



        return new Shell(

            this.faces.map(

                face =>

                face.clone()

            )

        );

    }









    isValid():

    boolean {



        if(

            this.faces.length === 0

        ){

            return false;

        }





        return this.faces

        .every(

            face =>

            face.isValid()

        );

    }



}