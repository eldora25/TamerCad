import { Solid }
from "../../topology/core/Solid";


import { Face }
from "../../topology/core/Face";


import { Vector3 }
from "../../geometry/core/Vector3";


import { Point }
from "../../geometry/core/Point";


import { BRepBuilder }
from "../../topology/brep/BRepBuilder";







export interface DraftOptions {


    direction?:Vector3;


    preserveTopology?:boolean;


}







export class Draft {



    private draftDirection:

    Vector3 | undefined;







    constructor(


        public solid:Solid,


        public faces:Face[],


        public angle:number,


        public neutralPlane:Point,


        public options:

        DraftOptions = {}

    ){



        if(

            angle === 0

        ){

            throw new Error(

                "Draft angle cannot be zero"

            );

        }





        if(

            angle <= -Math.PI ||

            angle >= Math.PI

        ){

            throw new Error(

                "Draft angle must be between -PI and PI"

            );

        }





        if(

            faces.length === 0

        ){

            throw new Error(

                "Draft requires at least one face"

            );

        }





        if(

            options.direction

        ){



            this.draftDirection =

            this.normalize(

                options.direction

            );

        }

    }









    build():

    Solid {



        const builder =

        new BRepBuilder();





        const resultFaces:

        Face[] = [];





        for(

            const face of

            this.solid.getFaces()

        ){



            if(

                this.isDraftFace(

                    face

                )

            ){



                resultFaces.push(

                    this.applyDraft(

                        face

                    )

                );

            }

            else {



                resultFaces.push(

                    face

                );

            }

        }









        const shell =

        builder.createShell(

            resultFaces

        );





        return builder.createSolid(

            shell

        );

    }









    private isDraftFace(

        face:Face

    ):

    boolean {



        return this.faces

        .includes(

            face

        );

    }









    private applyDraft(

        face:Face

    ):

    Face {



        /*


            Gerçek CAD kernel aşaması:


            1- Face surface alınır


            2- Neutral plane referansı hesaplanır


            3- Draft direction belirlenir


            4- Angle kadar taper uygulanır


            5- Yeni surface oluşturulur


            6- Face trim edilir


            7- Topology yeniden bağlanır



            Şimdilik topology korunur.


        */





        return face;

    }









    private normalize(

        vector:Vector3

    ):

    Vector3 {



        const length =

        Math.sqrt(

            vector.x * vector.x +

            vector.y * vector.y +

            vector.z * vector.z

        );





        if(

            length === 0

        ){

            throw new Error(

                "Draft direction cannot be zero"

            );

        }





        return new Vector3(


            vector.x /

            length,


            vector.y /

            length,


            vector.z /

            length


        );

    }









    getAngle():

    number {



        return this.angle;

    }









    getNeutralPlane():

    Point {



        return this.neutralPlane;

    }









    getFaces():

    Face[] {



        return this.faces;

    }









    getDirection():

    Vector3 | undefined {



        return this.draftDirection;

    }









    preserveTopology():

    boolean {



        return (

            this.options.preserveTopology !== false

        );

    }



}