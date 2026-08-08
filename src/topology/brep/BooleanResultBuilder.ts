import { Face }
from "../core/Face";

import { Shell }
from "../core/Shell";

import { Solid }
from "../core/Solid";

import { FaceSewing }
from "./FaceSewing";

import { TopologyValidator }
from "./TopologyValidator";

import { TopologyExplorer }
from "../TopologyExplorer";







export interface BooleanBuildOptions {


    sew?:boolean;


    validate?:boolean;


}







export interface BooleanBuildResult {


    solid:Solid|null;


    success:boolean;


    errors:string[];

}







export class BooleanResultBuilder {







    private sewing:

    FaceSewing;





    private validator:

    TopologyValidator;







    constructor(

        public tolerance:number = 1e-6

    ){



        this.sewing =

        new FaceSewing(

            tolerance

        );



        this.validator =

        new TopologyValidator();

    }









    buildFromFaces(

        faces:Face[],

        options:

        BooleanBuildOptions = {}

    ):

    BooleanBuildResult {



        const errors:

        string[] = [];





        if(

            faces.length === 0

        ){



            return {


                solid:null,


                success:false,


                errors:[

                    "No faces supplied"

                ]

            };

        }









        let solid:

        Solid|null = null;









        try {



            if(

                options.sew !== false

            ){



                const sewn =

                this.sewing

                .sewFaces(

                    faces

                );





                if(

                    !sewn.sewn

                ){



                    errors.push(

                        ...sewn.errors

                    );

                }





                solid =

                new Solid(

                    sewn.shell

                );



            }

            else {



                solid =

                new Solid(

                    new Shell(

                        faces

                    )

                );

            }



        }

        catch(error:any){



            errors.push(

                error.message

            );

        }









        if(

            !solid

        ){



            return {


                solid:null,


                success:false,


                errors

            };

        }









        if(

            options.validate !== false

        ){



            const validation =

            this.validator

            .validate(

                solid

            );





            if(

                !validation.valid

            ){



                errors.push(

                    ...validation.errors

                );

            }

        }









        return {


            solid,


            success:

            errors.length === 0,


            errors

        };

    }









    unionFaces(

        facesA:Face[],

        facesB:Face[]

    ):

    BooleanBuildResult {



        return this.buildFromFaces(

            [

                ...facesA,

                ...facesB

            ]

        );

    }









    buildShell(

        faces:Face[]

    ):

    Shell {



        const result =

        this.sewing

        .sewFaces(

            faces

        );





        if(

            !result.sewn

        ){



            throw new Error(

                result.errors.join(

                    "\n"

                )

            );

        }





        return result.shell;

    }









    removeDuplicateFaces(

        faces:Face[]

    ):

    Face[] {



        const result:

        Face[] = [];





        for(

            const face of

            faces

        ){



            let duplicate =

            false;





            for(

                const existing of

                result

            ){



                if(

                    this.sameFace(

                        face,

                        existing

                    )

                ){



                    duplicate =

                    true;


                    break;

                }

            }





            if(

                !duplicate

            ){



                result.push(

                    face

                );

            }

        }





        return result;

    }









    filterFaces(

        faces:Face[],

        predicate:

        (

            face:Face

        )=>boolean

    ):

    Face[] {



        return faces.filter(

            predicate

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









    validate(

        solid:Solid

    ):

    boolean {



        return this.validator

        .validate(

            solid

        )

        .valid;

    }









    private sameFace(

        a:Face,

        b:Face

    ):

    boolean {



        const edgesA =

        a.getEdges();



        const edgesB =

        b.getEdges();





        if(

            edgesA.length !==

            edgesB.length

        ){

            return false;

        }





        for(

            const edge of

            edgesA

        ){



            const exists =

            edgesB.some(

                e =>

                e.equals(

                    edge,

                    this.tolerance

                )

            );





            if(

                !exists

            ){



                return false;

            }

        }





        return true;

    }







}