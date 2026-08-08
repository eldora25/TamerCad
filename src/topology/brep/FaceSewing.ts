import { Face } 
from "../core/Face";

import { Edge } 
from "../core/Edge";

import { HalfEdge } 
from "../core/HalfEdge";

import { Shell } 
from "../core/Shell";

import { Solid } 
from "../core/Solid";

import { EdgeMatcher }
from "./EdgeMatcher";







export interface SewingResult {


    shell:Shell;


    halfEdges:HalfEdge[];


    sewn:boolean;


    errors:string[];

}







export class FaceSewing {







    private matcher:

    EdgeMatcher;







    constructor(

        public tolerance:number = 1e-6

    ){



        this.matcher =

        new EdgeMatcher(

            tolerance

        );

    }









    sewFaces(

        faces:Face[]

    ):

    SewingResult {



        const shell =

        new Shell(

            faces

        );





        const errors:

        string[] = [];





        const halfEdges:

        HalfEdge[] = [];





        this.createHalfEdges(

            faces,

            halfEdges

        );





        this.connectTwins(

            halfEdges,

            errors

        );





        this.connectLoops(

            halfEdges

        );





        return {


            shell,


            halfEdges,


            sewn:

            errors.length === 0,


            errors


        };

    }









    createSolid(

        faces:Face[]

    ):

    Solid {



        const result =

        this.sewFaces(

            faces

        );





        if(

            !result.sewn

        ){

            throw new Error(

                result.errors.join("\n")

            );

        }





        return new Solid(

            result.shell

        );

    }









    private createHalfEdges(

        faces:Face[],

        output:HalfEdge[]

    ):

    void {



        for(

            const face of

            faces

        ){



            for(

                const wire of

                face.getWires()

            ){



                const hes:

                HalfEdge[] = [];





                for(

                    const edge of

                    wire.getEdges()

                ){



                    const he =

                    new HalfEdge(

                        edge,

                        edge.start,

                        edge.end

                    );





                    hes.push(

                        he

                    );


                    output.push(

                        he

                    );

                }





                wire.clear();





                for(

                    const he of

                    hes

                ){



                    wire.addHalfEdge(

                        he

                    );

                }

            }

        }

    }









    private connectTwins(

        halfEdges:

        HalfEdge[],

        errors:string[]

    ):

    void {



        for(

            let i = 0;

            i < halfEdges.length;

            i++

        ){



            const a =

            halfEdges[i];





            if(

                a.twin

            ){

                continue;

            }





            for(

                let j = i + 1;

                j < halfEdges.length;

            j++

            ){



                const b =

                halfEdges[j];





                if(

                    b.twin

                ){

                    continue;

                }





                const match =

                this.matcher.match(

                    a.edge,

                    b.edge

                );





                if(

                    match.type ===

                    "OppositeDirection"

                ){



                    a.setTwin(

                        b

                    );


                    break;

                }

            }

        }









        for(

            const he of

            halfEdges

        ){



            if(

                !he.twin

            ){



                errors.push(

                    "Unsewn boundary edge"

                );

            }

        }

    }









    private connectLoops(

        halfEdges:

        HalfEdge[]

    ):

    void {



        const outgoing =

        new Map<any, HalfEdge[]>();





        for(

            const he of

            halfEdges

        ){



            if(

                !outgoing.has(

                    he.start

                )

            ){



                outgoing.set(

                    he.start,

                    []

                );

            }





            outgoing.get(

                he.start

            )!

            .push(

                he

            );

        }









        for(

            const he of

            halfEdges

        ){



            const candidates =

            outgoing.get(

                he.end

            );





            if(

                !candidates

            ){

                continue;

            }





            const next =

            candidates.find(

                candidate =>

                candidate !== he.twin

            );





            if(

                next

            ){



                he.setNext(

                    next

                );


                next.setPrevious(

                    he

                );

            }

        }

    }









    getBoundaryEdges(

        shell:Shell

    ):

    Edge[] {



        const result:

        Edge[] = [];





        for(

            const edge of

            shell.getEdges()

        ){



            let uses =

            0;





            for(

                const face of

                shell.getFaces()

            ){



                for(

                    const candidate of

                    face.getEdges()

                ){



                    if(

                        this.matcher.equals(

                            edge,

                            candidate

                        )

                    ){

                        uses++;

                    }

                }

            }





            if(

                uses === 1

            ){



                result.push(

                    edge

                );

            }

        }





        return result;

    }









    isClosed(

        shell:Shell

    ):

    boolean {



        return (

            this.getBoundaryEdges(

                shell

            )

            .length === 0

        );

    }







}