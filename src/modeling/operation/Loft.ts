import { Wire }
from "../../topology/core/Wire";


import { Edge }
from "../../topology/core/Edge";


import { Face }
from "../../topology/core/Face";


import { Solid }
from "../../topology/core/Solid";


import { BRepBuilder }
from "../../topology/brep/BRepBuilder";







export interface LoftOptions {


    closed?:boolean;


    solid?:boolean;


    smooth?:boolean;


    capStart?:boolean;


    capEnd?:boolean;


}







export class Loft {



    constructor(


        public profiles:Wire[],


        public options:

        LoftOptions = {}

    ){



        if(

            profiles.length < 2

        ){

            throw new Error(

                "Loft requires at least two profiles"

            );

        }





        this.validateProfiles();

    }









    build():

    Solid {



        const builder =

        new BRepBuilder();





        const faces:

        Face[] = [];





        faces.push(

            ...this.createFaces()

        );









        if(

            this.options.closed

        ){



            faces.push(

                ...this.createClosingFaces()

            );

        }

        else {



            if(

                this.options.capStart !== false

            ){



                faces.push(

                    new Face(

                        null as any,

                        this.profiles[0]

                    )

                );

            }





            if(

                this.options.capEnd !== false

            ){



                faces.push(

                    new Face(

                        null as any,

                        this.profiles[

                            this.profiles.length - 1

                        ]

                    )

                );

            }

        }









        const shell =

        builder.createShell(

            faces

        );





        return builder.createSolid(

            shell

        );

    }









    private validateProfiles():

    void {



        const firstCount =

        this.profiles[0]

        .getEdges()

        .length;





        for(

            const profile of

            this.profiles

        ){



            if(

                !profile.isClosed()

            ){

                throw new Error(

                    "Loft profiles must be closed"

                );

            }





            if(

                profile.getEdges().length !== firstCount

            ){

                throw new Error(

                    "All loft profiles must have same edge count"

                );

            }

        }

    }









    private createFaces():

    Face[] {



        const faces:

        Face[] = [];





        for(

            let i = 0;

            i < this.profiles.length - 1;

            i++

        ){



            const current =

            this.profiles[i];



            const next =

            this.profiles[i + 1];





            const currentEdges =

            current.getEdges();



            const nextEdges =

            next.getEdges();





            for(

                let j = 0;

                j < currentEdges.length;

                j++

            ){



                faces.push(

                    this.createLoftFace(

                        currentEdges[j],

                        nextEdges[j]

                    )

                );

            }

        }





        return faces;

    }









    private createLoftFace(

        edgeA:Edge,


        edgeB:Edge

    ):

    Face {



        const wire =

        new Wire();





        wire.addEdge(

            edgeA

        );





        wire.addEdge(

            new Edge(

                edgeA.end,

                edgeB.end

            )

        );





        wire.addEdge(

            edgeB

        );





        wire.addEdge(

            new Edge(

                edgeB.start,

                edgeA.start

            )

        );





        return new Face(

            null as any,

            wire

        );

    }









    private createClosingFaces():

    Face[] {



        const faces:

        Face[] = [];





        const first =

        this.profiles[0];





        const last =

        this.profiles[

            this.profiles.length - 1

        ];





        const firstEdges =

        first.getEdges();



        const lastEdges =

        last.getEdges();





        for(

            let i = 0;

            i < firstEdges.length;

            i++

        ){



            faces.push(

                this.createLoftFace(

                    lastEdges[i],

                    firstEdges[i]

                )

            );

        }





        return faces;

    }









    getProfiles():

    Wire[] {



        return this.profiles;

    }









    isSmooth():

    boolean {



        return this.options.smooth === true;

    }









    isClosed():

    boolean {



        return this.options.closed === true;

    }



}