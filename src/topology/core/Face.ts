import { Surface }
from "../../geometry/surface/Surface";


import { Wire }
from "./Wire";


import { Edge }
from "./Edge";


import { HalfEdge }
from "./HalfEdge";







export class Face {



    public innerWires:

    Wire[] = [];



    public reversed:

    boolean = false;







    constructor(

        public surface:

        Surface | null,


        public outerWire:

        Wire

    ){



        if(

            !outerWire

        ){

            throw new Error(

                "Face requires outer wire"

            );

        }

    }









    addInnerWire(

        wire:Wire

    ):

    void {



        if(

            !this.innerWires.includes(

                wire

            )

        ){



            this.innerWires.push(

                wire

            );

        }

    }









    removeInnerWire(

        wire:Wire

    ):

    boolean {



        const index =

        this.innerWires.indexOf(

            wire

        );





        if(

            index === -1

        ){

            return false;

        }





        this.innerWires.splice(

            index,

            1

        );





        return true;

    }









    getOuterWire():

    Wire {



        return this.outerWire;

    }









    getInnerWires():

    Wire[] {



        return [

            ...this.innerWires

        ];

    }









    getWires():

    Wire[] {



        return [

            this.outerWire,

            ...this.innerWires

        ];

    }









    getEdges():

    Edge[] {



        const result:

        Edge[] = [];





        for(

            const wire of

            this.getWires()

        ){



            for(

                const edge of

                wire.getEdges()

            ){



                if(

                    !result.some(

                        e =>

                        e.equals(

                            edge

                        )

                    )

                ){



                    result.push(

                        edge

                    );

                }

            }

        }





        return result;

    }









    getHalfEdges():

    HalfEdge[] {



        const result:

        HalfEdge[] = [];





        for(

            const wire of

            this.getWires()

        ){



            result.push(

                ...wire.getHalfEdges()

            );

        }





        return result;

    }









    normalAt(

        u:number,

        v:number

    ):

    any {



        if(

            !this.surface

        ){

            return null;

        }





        const normal =

        this.surface.normal(

            u,

            v

        );





        if(

            this.reversed

        ){



            return new (

                normal.constructor as any

            )(

                -normal.x,

                -normal.y,

                -normal.z

            );

        }





        return normal;

    }









    area():

    number {



        /*

            Face alanı surface alanı değildir.

            Trim edilmiş boundary alanıdır.



            Gerçek kernel:

            1- Wire triangulation

            2- Surface mapping

            3- Hole subtraction



            Şimdilik polygon yaklaşımı.

        */





        const vertices =

        this.outerWire

        .getVertices();





        if(

            vertices.length < 3

        ){

            return 0;

        }





        let area =

        0;





        for(

            let i = 0;

            i < vertices.length;

            i++

        ){



            const p1 =

            vertices[i]

            .position;



            const p2 =

            vertices[

                (

                    i + 1

                )

                %

                vertices.length

            ]

            .position;





            area +=

            (

                p1.x *

                p2.y

            )

            -

            (

                p2.x *

                p1.y

            );

        }





        area =

        Math.abs(

            area

            /

            2

        );









        // Hole alanlarını çıkar

        for(

            const hole of

            this.innerWires

        ){



            const holeVertices =

            hole.getVertices();





            let holeArea =

            0;





            for(

                let i = 0;

                i < holeVertices.length;

                i++

            ){



                const p1 =

                holeVertices[i]

                .position;



                const p2 =

                holeVertices[

                    (

                        i+1

                    )

                    %

                    holeVertices.length

                ]

                .position;





                holeArea +=

                (

                    p1.x *

                    p2.y

                )

                -

                (

                    p2.x *

                    p1.y

                );

            }





            area -=

            Math.abs(

                holeArea / 2

            );

        }





        return area;

    }









    reverse():

    Face {



        const reversedSurface =

        this.surface

        ?

        this.surface.reverse()

        :

        null;





        const face =

        new Face(

            reversedSurface,

            this.outerWire.clone()

        );





        face.outerWire.close();





        for(

            const wire of

            this.innerWires

        ){



            const inner =

            wire.clone();



            inner.close();



            face.addInnerWire(

                inner

            );

        }





        face.reversed =

        !this.reversed;





        return face;

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









    clone():

    Face {



        const face =

        new Face(

            this.surface,

            this.outerWire.clone()

        );





        for(

            const wire of

            this.innerWires

        ){



            face.addInnerWire(

                wire.clone()

            );

        }





        face.reversed =

        this.reversed;





        return face;

    }









    isValid():

    boolean {



        return (

            this.outerWire

            .getEdges()

            .length > 0

            &&

            this.outerWire

            .isClosed()

        );

    }







}