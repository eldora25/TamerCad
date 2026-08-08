import { Solid }
from "../../topology/core/Solid";


import { Edge }
from "../../topology/core/Edge";


import { Face }
from "../../topology/core/Face";


import { Wire }
from "../../topology/core/Wire";


import { PlaneSurface }
from "../../geometry/surface/PlaneSurface";


import { BRepBuilder }
from "../../topology/brep/BRepBuilder";







export interface FilletOptions {


    segments?:number;


    preserveTopology?:boolean;


    smooth?:boolean;


}







export class Fillet {



    constructor(


        public solid:Solid,


        public edges:Edge[],


        public radius:number,


        public options:

        FilletOptions = {}

    ){



        if(

            radius <= 0

        ){

            throw new Error(

                "Fillet radius must be positive"

            );

        }





        if(

            edges.length === 0

        ){

            throw new Error(

                "Fillet requires at least one edge"

            );

        }

    }









    build():

    Solid {



        const builder =

        new BRepBuilder();





        const faces:

        Face[] = [];





        for(

            const face of

            this.solid.getFaces()

        ){



            if(

                this.isAffected(face)

            ){



                faces.push(

                    this.createFilletFace(

                        face

                    )

                );

            }

            else {



                faces.push(

                    face

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









    private isAffected(

        face:Face

    ):

    boolean {



        return face

        .getEdges()

        .some(

            edge =>

            this.edges.includes(edge)

        );

    }









    private createFilletFace(

        face:Face

    ):

    Face {



        /*


            Gerçek CAD kernel aşaması:


            1- Edge komşu yüzleri alınır


            2- Edge boyunca tangent hesaplanır


            3- Radius kadar offset alınır


            4- Arc/cylinder blend surface oluşturulur


            5- Trim uygulanır


            6- Yeni Face oluşturulur



            Şimdilik topology korunur.


        */





        const surface =

        new PlaneSurface();





        return new Face(

            surface,

            face.outerWire

        );

    }









    private getAdjacentFaces(

        edge:Edge

    ):

    Face[] {



        const result:

        Face[] = [];





        for(

            const face of

            this.solid.getFaces()

        ){



            if(

                face

                .getEdges()

                .includes(

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









    getRadius():

    number {



        return this.radius;

    }









    getEdges():

    Edge[] {



        return this.edges;

    }









    getSegments():

    number {



        return (

            this.options.segments ??

            16

        );

    }









    isSmooth():

    boolean {



        return (

            this.options.smooth === true

        );

    }









    preserveTopology():

    boolean {



        return (

            this.options.preserveTopology !== false

        );

    }



}