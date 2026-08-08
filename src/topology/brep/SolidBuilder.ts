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

import { ShellBuilder }
from "./ShellBuilder";







export interface SolidBuildOptions {


    requireClosed?:boolean;


    validateManifold?:boolean;


    orientShells?:boolean;


}







export interface SolidBuildResult {


    solid:Solid;


    valid:boolean;


    errors:string[];

}







export class SolidBuilder {







    constructor(

        private shellBuilder:

        ShellBuilder =

        new ShellBuilder()

    ){}



    







    build(

        shells:Shell[],

        options:

        SolidBuildOptions = {}

    ):

    SolidBuildResult {



        const errors:

        string[] = [];





        if(

            shells.length === 0

        ){



            return {


                solid:

                null as any,


                valid:false,


                errors:[

                    "Solid requires at least one shell"

                ]

            };

        }









        const solid =

        new Solid(

            shells[0]

        );









        for(

            let i = 1;

            i < shells.length;

            i++

        ){



            solid.addShell(

                shells[i]

            );

        }









        if(

            options.orientShells !== false

        ){



            this.orientShells(

                solid,

                errors

            );

        }









        if(

            options.validateManifold !== false

        ){



            if(

                !this.isManifold(

                    solid

                )

            ){



                errors.push(

                    "Solid is not manifold"

                );

            }

        }









        if(

            options.requireClosed

        ){



            if(

                !this.isClosed(

                    solid

                )

            ){



                errors.push(

                    "Solid contains open shell"

                );

            }

        }









        return {


            solid,


            valid:

            errors.length === 0,


            errors


        };

    }









    buildFromFaces(

        faces:Face[],

        options:

        SolidBuildOptions = {}

    ):

    SolidBuildResult {



        const shellResult =

        this.shellBuilder.build(

            faces,

            {

                requireClosed:

                options.requireClosed,

                orientFaces:true

            }

        );





        if(

            !shellResult.valid

        ){



            return {


                solid:

                null as any,


                valid:false,


                errors:

                shellResult.errors


            };

        }





        return this.build(

            [

                shellResult.shell

            ],

            options

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









    addShell(

        solid:Solid,

        shell:Shell

    ):

    void {



        solid.addShell(

            shell

        );

    }









    removeShell(

        solid:Solid,

        shell:Shell

    ):

    void {



        solid.removeShell(

            shell

        );

    }









    private isClosed(

        solid:Solid

    ):

    boolean {



        for(

            const shell of

            solid.getShells()

        ){



            if(

                !shell.isClosed()

            ){



                return false;

            }

        }





        return true;

    }









    private isManifold(

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









    private orientShells(

        solid:Solid,

        errors:string[]

    ):

    void {



        const shells =

        solid.getShells();





        if(

            shells.length === 0

        ){

            return;

        }





        const outer =

        shells[0];





        for(

            let i = 1;

            i < shells.length;

            i++

        ){



            const shell =

            shells[i];





            if(

                this.isSameOrientation(

                    outer,

                    shell

                )

            ){



                this.reverseShell(

                    shell

                );

            }

        }

    }









    private isSameOrientation(

        shellA:Shell,

        shellB:Shell

    ):

    boolean {



        const faceA =

        shellA.getFaces()[0];



        const faceB =

        shellB.getFaces()[0];





        if(

            !faceA

            ||

            !faceB

        ){

            return false;

        }





        return (

            faceA.reversed ===

            faceB.reversed

        );

    }









    private reverseShell(

        shell:Shell

    ):

    void {



        const faces =

        shell.getFaces();





        for(

            const face of

            faces

        ){



            face.reversed =

            !face.reversed;

        }

    }









    getVolume(

        solid:Solid

    ):

    number {



        /*

            Gerçek BRep kernel:

            ∑ face signed tetrahedron volume

            burada hesaplanır.

        */



        return solid.volume();

    }









    getSurfaceArea(

        solid:Solid

    ):

    number {



        return solid.surfaceArea();

    }









    validate(

        solid:Solid

    ):

    boolean {



        return (

            solid.isValid()

            &&

            this.isManifold(

                solid

            )

        );

    }







}