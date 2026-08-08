import { Point }
from "../../geometry/core/Point";


import { Vector3 }
from "../../geometry/core/Vector3";


import { Wire }
from "../../topology/core/Wire";


import { Edge }
from "../../topology/core/Edge";


import { Vertex }
from "../../topology/core/Vertex";


import { Face }
from "../../topology/core/Face";


import { Solid }
from "../../topology/core/Solid";


import { BRepBuilder }
from "../../topology/brep/BRepBuilder";







export interface RevolveOptions {


    segments?:number;


    makeSolid?:boolean;


    capStart?:boolean;


    capEnd?:boolean;


}







export class Revolve {



    private normalizedAxis:

    Vector3;







    constructor(


        public profile:Wire,


        public axisPoint:Point,


        public axisDirection:Vector3,


        public angle:number =

        Math.PI * 2,


        public options:

        RevolveOptions = {}

    ){



        if(

            angle === 0

        ){

            throw new Error(

                "Revolve angle cannot be zero"

            );

        }





        if(

            !profile.isClosed()

        ){

            throw new Error(

                "Revolve profile must be closed"

            );

        }





        this.normalizedAxis =

        this.normalize(

            axisDirection

        );

    }









    build():

    Solid {



        const builder =

        new BRepBuilder();





        const segments =

        Math.max(

            this.options.segments ?? 32,

            3

        );





        const sections:

        Wire[] = [];





        for(

            let i = 0;

            i <= segments;

            i++

        ){



            const theta =

            this.angle *

            (

                i /

                segments

            );





            sections.push(

                this.rotateWire(

                    this.profile,

                    theta

                )

            );

        }





        const faces:

        Face[] = [];





        faces.push(

            ...this.createFaces(

                sections

            )

        );





        if(

            this.options.capStart !== false

        ){



            faces.push(

                new Face(

                    null as any,

                    sections[0]

                )

            );

        }





        if(

            this.options.capEnd !== false

        ){



            faces.push(

                new Face(

                    null as any,

                    sections[

                        sections.length-1

                    ]

                )

            );

        }





        const shell =

        builder.createShell(

            faces

        );





        return builder.createSolid(

            shell

        );

    }









    private rotatePoint(

        point:Point,


        angle:number

    ):

    Point {



        const px =

        point.x -

        this.axisPoint.x;


        const py =

        point.y -

        this.axisPoint.y;


        const pz =

        point.z -

        this.axisPoint.z;





        const axis =

        this.normalizedAxis;





        const cos =

        Math.cos(

            angle

        );


        const sin =

        Math.sin(

            angle

        );





        const dot =

        axis.x * px +

        axis.y * py +

        axis.z * pz;





        const crossX =

        axis.y * pz -

        axis.z * py;


        const crossY =

        axis.z * px -

        axis.x * pz;


        const crossZ =

        axis.x * py -

        axis.y * px;





        return new Point(


            this.axisPoint.x +

            px*cos +

            crossX*sin +

            axis.x *

            dot *

            (1-cos),



            this.axisPoint.y +

            py*cos +

            crossY*sin +

            axis.y *

            dot *

            (1-cos),



            this.axisPoint.z +

            pz*cos +

            crossZ*sin +

            axis.z *

            dot *

            (1-cos)

        );

    }









    private rotateWire(

        wire:Wire,


        angle:number

    ):

    Wire {



        const result =

        new Wire();





        for(

            const edge of

            wire.getEdges()

        ){



            const start =

            new Vertex(

                this.rotatePoint(

                    edge.start.position,

                    angle

                )

            );





            const end =

            new Vertex(

                this.rotatePoint(

                    edge.end.position,

                    angle

                )

            );





            result.addEdge(

                new Edge(

                    start,

                    end

                )

            );

        }





        return result;

    }









    private createFaces(

        sections:Wire[]

    ):

    Face[] {



        const faces:

        Face[] = [];





        for(

            let i=0;

            i<sections.length-1;

            i++

        ){



            const current =

            sections[i];


            const next =

            sections[i+1];





            const currentEdges =

            current.getEdges();


            const nextEdges =

            next.getEdges();





            const count =

            Math.min(

                currentEdges.length,

                nextEdges.length

            );





            for(

                let j=0;

                j<count;

                j++

            ){



                const a =

                currentEdges[j];


                const b =

                nextEdges[j];





                const wire =

                new Wire();





                wire.addEdge(

                    a

                );





                wire.addEdge(

                    new Edge(

                        a.end,

                        b.end

                    )

                );





                wire.addEdge(

                    new Edge(

                        b.end,

                        b.start

                    )

                );





                wire.addEdge(

                    new Edge(

                        b.start,

                        a.start

                    )

                );





                faces.push(

                    new Face(

                        null as any,

                        wire

                    )

                );

            }

        }





        return faces;

    }









    private normalize(

        vector:Vector3

    ):

    Vector3 {



        const length =

        Math.sqrt(

            vector.x *

            vector.x +

            vector.y *

            vector.y +

            vector.z *

            vector.z

        );





        if(

            length === 0

        ){

            throw new Error(

                "Revolve axis direction cannot be zero"

            );

        }





        return new Vector3(


            vector.x / length,


            vector.y / length,


            vector.z / length

        );

    }









    getAxis():

    Vector3 {



        return this.normalizedAxis;

    }









    getAngle():

    number {



        return this.angle;

    }









    getSegments():

    number {



        return this.options.segments ?? 32;

    }



}