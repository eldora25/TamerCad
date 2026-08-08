import { Shell }
from "./Shell";


import { Face }
from "./Face";


import { Edge }
from "./Edge";


import { Vertex }
from "./Vertex";







export class Solid {



    private shells:

    Shell[] = [];









    constructor(

        shell?:Shell

    ){



        if(

            shell

        ){

            this.shells.push(

                shell

            );

        }

    }









    addShell(

        shell:Shell

    ):

    void {



        if(

            !this.shells.includes(

                shell

            )

        ){



            this.shells.push(

                shell

            );

        }

    }









    removeShell(

        shell:Shell

    ):

    boolean {



        const index =

        this.shells.indexOf(

            shell

        );





        if(

            index === -1

        ){

            return false;

        }





        this.shells.splice(

            index,

            1

        );





        return true;

    }









    getShells():

    Shell[] {



        return [

            ...this.shells

        ];

    }









    getFaces():

    Face[] {



        const faces:

        Face[] = [];





        for(

            const shell of

            this.shells

        ){



            for(

                const face of

                shell.getFaces()

            ){



                if(

                    !faces.includes(

                        face

                    )

                ){



                    faces.push(

                        face

                    );

                }

            }

        }





        return faces;

    }









    getEdges():

    Edge[] {



        const edges:

        Edge[] = [];





        for(

            const shell of

            this.shells

        ){



            for(

                const edge of

                shell.getEdges()

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

            const shell of

            this.shells

        ){



            for(

                const vertex of

                shell.getVertices()

            ){



                if(

                    !vertices.includes(

                        vertex

                    )

                ){



                    vertices.push(

                        vertex

                    );

                }

            }

        }





        return vertices;

    }









    isValid():

    boolean {



        if(

            this.shells.length === 0

        ){

            return false;

        }





        return this.shells

        .every(

            shell =>

            shell.isValid()

            &&

            shell.isClosed()

        );

    }









    volume():

    number {



        let volume =

        0;





        for(

            const face of

            this.getFaces()

        ){



            const wire =

            face.getOuterWire();



            const vertices =

            wire.getVertices();





            if(

                vertices.length < 3

            ){

                continue;

            }





            const origin =

            vertices[0]

            .position;





            for(

                let i = 1;

                i < vertices.length - 1;

                i++

            ){



                const a =

                vertices[i]

                .position;



                const b =

                vertices[i+1]

                .position;





                volume +=

                (

                    origin.x * (

                        a.y*b.z -

                        a.z*b.y

                    )

                    -

                    origin.y * (

                        a.x*b.z -

                        a.z*b.x

                    )

                    +

                    origin.z * (

                        a.x*b.y -

                        a.y*b.x

                    )

                )

                /

                6;

            }

        }





        return Math.abs(

            volume

        );

    }









    surfaceArea():

    number {



        let area =

        0;





        for(

            const face of

            this.getFaces()

        ){



            area +=

            face.area();

        }





        return area;

    }









    containsFace(

        face:Face

    ):

    boolean {



        return this.getFaces()

        .includes(

            face

        );

    }









    containsEdge(

        edge:Edge

    ):

    boolean {



        return this.getEdges()

        .some(

            e =>

            e.equals(

                edge

            )

        );

    }









    containsShell(

        shell:Shell

    ):

    boolean {



        return this.shells.includes(

            shell

        );

    }









    shellCount():

    number {



        return this.shells.length;

    }









    clear():

    void {



        this.shells = [];

    }









    clone():

    Solid {



        const solid =

        new Solid();





        for(

            const shell of

            this.shells

        ){



            solid.addShell(

                shell.clone()

            );

        }





        return solid;

    }



}