import { Solid }
from "../core/Solid";


import { Face }
from "../core/Face";


import { Edge }
from "../core/Edge";


import { Vertex }
from "../core/Vertex";


import { Shell }
from "../core/Shell";







export interface ValidationResult {


    valid:boolean;


    errors:string[];


}







export class TopologyValidator {







    validate(

        solid:Solid

    ):

    ValidationResult {



        const errors:

        string[] = [];





        this.validateSolid(

            solid,

            errors

        );





        this.validateShells(

            solid,

            errors

        );





        this.validateFaces(

            solid,

            errors

        );





        this.validateEdges(

            solid,

            errors

        );





        this.validateVertices(

            solid,

            errors

        );





        this.validateEuler(

            solid,

            errors

        );





        return {


            valid:

            errors.length === 0,


            errors

        };

    }









    private validateSolid(

        solid:Solid,


        errors:string[]

    ):

    void {



        if(

            !solid

        ){



            errors.push(

                "Solid is null"

            );

        }



    }









    private validateShells(

        solid:Solid,


        errors:string[]

    ):

    void {



        const shells =

        solid.getShells();





        if(

            shells.length === 0

        ){



            errors.push(

                "Solid has no shells"

            );


            return;

        }









        for(

            const shell of

            shells

        ){



            if(

                !shell.isClosed()

            ){



                errors.push(

                    "Shell is not closed"

                );

            }





            if(

                shell.faceCount()

                ===

                0

            ){



                errors.push(

                    "Empty shell"

                );

            }

        }

    }









    private validateFaces(

        solid:Solid,


        errors:string[]

    ):

    void {



        const faces =

        solid.getFaces();





        for(

            const face of

            faces

        ){



            const wire =

            face.getOuterWire();





            if(

                !wire

            ){



                errors.push(

                    "Face has no outer wire"

                );


                continue;

            }





            if(

                !wire.isClosed()

            ){



                errors.push(

                    "Face wire is open"

                );

            }





            if(

                wire.length()

                ===

                0

            ){



                errors.push(

                    "Face has zero length wire"

                );

            }





            this.validateWire(

                wire,

                errors

            );

        }

    }









    private validateWire(

        wire:any,


        errors:string[]

    ):

    void {



        const edges =

        wire.getEdges();





        for(

            let i = 0;

            i < edges.length-1;

            i++

        ){



            if(

                edges[i].end !==

                edges[i+1].start

            ){



                errors.push(

                    "Wire edge continuity broken"

                );

            }

        }

    }









    private validateEdges(

        solid:Solid,


        errors:string[]

    ):

    void {



        const edges =

        solid.getEdges();





        const duplicate:

        Edge[] = [];





        for(

            const edge of

            edges

        ){



            if(

                !edge.start

                ||

                !edge.end

            ){



                errors.push(

                    "Edge has invalid vertex"

                );


                continue;

            }





            if(

                edge.start ===

                edge.end

            ){



                errors.push(

                    "Zero length edge"

                );

            }





            for(

                const other of

                edges

            ){



                if(

                    edge !== other

                    &&

                    edge.equals(

                        other

                    )

                ){



                    duplicate.push(

                        edge

                    );

                }

            }

        }





        if(

            duplicate.length

        ){



            errors.push(

                "Duplicate edges detected"

            );

        }

    }









    private validateVertices(

        solid:Solid,


        errors:string[]

    ):

    void {



        const vertices =

        solid.getVertices();





        for(

            const vertex of

            vertices

        ){



            if(

                !vertex.position

            ){



                errors.push(

                    "Vertex has no position"

                );


                continue;

            }





            if(

                vertex.getEdges()

                .length === 0

            ){



                errors.push(

                    "Dangling vertex"

                );

            }

        }

    }









    private validateEuler(

        solid:Solid,


        errors:string[]

    ):

    void {



        const V =

        solid.getVertices()

        .length;



        const E =

        solid.getEdges()

        .length;



        const F =

        solid.getFaces()

        .length;





        const chi =

        V - E + F;





        if(

            chi !== 2

        ){



            errors.push(

                "Euler characteristic invalid: "

                +

                chi

            );

        }

    }









    isManifold(

        solid:Solid

    ):

    boolean {



        for(

            const edge of

            solid.getEdges()

        ){



            let usage =

            0;





            for(

                const face of

                solid.getFaces()

            ){



                if(

                    face.containsEdge(

                        edge

                    )

                ){



                    usage++;

                }

            }





            if(

                usage !== 2

            ){



                return false;

            }

        }





        return true;

    }









    hasOpenEdges(

        solid:Solid

    ):

    boolean {



        for(

            const edge of

            solid.getEdges()

        ){



            let count =

            0;





            for(

                const face of

                solid.getFaces()

            ){



                if(

                    face.containsEdge(

                        edge

                    )

                ){



                    count++;

                }

            }





            if(

                count !== 2

            ){



                return true;

            }

        }





        return false;

    }







}