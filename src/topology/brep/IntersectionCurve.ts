import { Curve }
from "../../geometry/curve/Curve";

import { Point }
from "../../geometry/core/Point";

import { Face }
from "../core/Face";

import { Edge }
from "../core/Edge";

import { Vertex }
from "../core/Vertex";







export enum IntersectionType {


    CURVE = "curve",


    LINE = "line",


    POINT = "point",


    NONE = "none"


}







export interface IntersectionSample {


    parameter:number;


    point:Point;


}







export class IntersectionCurve {







    public samples:

    IntersectionSample[] = [];





    public type:

    IntersectionType =

    IntersectionType.CURVE;







    constructor(


        public faceA:Face,


        public faceB:Face,


        public curve:

        Curve|null = null


    ){



        if(

            !faceA

            ||

            !faceB

        ){

            throw new Error(

                "IntersectionCurve requires two faces"

            );

        }

    }









    evaluate(

        t:number

    ):

    Point|null {



        if(

            !this.curve

        ){



            return this.interpolateSamples(

                t

            );

        }





        return this.curve.evaluate(

            t

        );

    }









    tangent(

        t:number

    ) {



        if(

            !this.curve

        ){

            return null;

        }





        return this.curve.tangent(

            t

        );

    }









    addSample(

        parameter:number,

        point:Point

    ):

    void {



        this.samples.push({


            parameter,


            point


        });

    }









    getSamples():

    IntersectionSample[] {



        return [

            ...this.samples

        ];

    }









    startPoint():

    Point|null {



        if(

            this.samples.length === 0

        ){

            return null;

        }





        return this.samples[0].point;

    }









    endPoint():

    Point|null {



        if(

            this.samples.length === 0

        ){

            return null;

        }





        return this.samples[

            this.samples.length - 1

        ]

        .point;

    }









    length():

    number {



        if(

            this.curve

        ){



            return this.curve.length();

        }





        let total =

        0;





        for(

            let i = 1;

            i < this.samples.length;

            i++

        ){



            total +=

            this.samples[i-1]

            .point

            .distanceTo(

                this.samples[i].point

            );

        }





        return total;

    }









    toEdge():

    Edge|null {



        const start =

        this.startPoint();



        const end =

        this.endPoint();





        if(

            !start

            ||

            !end

        ){

            return null;

        }





        const startVertex =

        new Vertex(

            start

        );





        const endVertex =

        new Vertex(

            end

        );





        return new Edge(

            startVertex,

            endVertex,

            this.curve

        );

    }









    reverse():

    IntersectionCurve {



        const reversed =

        new IntersectionCurve(

            this.faceB,

            this.faceA,

            this.curve

        );





        reversed.type =

        this.type;





        reversed.samples =

        [

            ...

            this.samples

        ]

        .reverse()

        .map(

            sample => ({


                parameter:

                1 -

                sample.parameter,


                point:

                sample.point.clone()


            })

        );





        return reversed;

    }









    isValid():

    boolean {



        return (

            this.faceA !== null

            &&

            this.faceB !== null

            &&

            (

                this.curve !== null

                ||

                this.samples.length >= 2

            )

        );

    }









    private interpolateSamples(

        t:number

    ):

    Point|null {



        if(

            this.samples.length === 0

        ){

            return null;

        }





        if(

            this.samples.length === 1

        ){

            return this.samples[0]

            .point

            .clone();

        }









        let previous =

        this.samples[0];





        for(

            let i = 1;

            i < this.samples.length;

            i++

        ){



            const current =

            this.samples[i];





            if(

                t <= current.parameter

            ){



                const local =

                (

                    t -

                    previous.parameter

                )

                /

                (

                    current.parameter -

                    previous.parameter

                );





                return new Point(


                    previous.point.x +

                    (

                        current.point.x -

                        previous.point.x

                    )

                    *

                    local,



                    previous.point.y +

                    (

                        current.point.y -

                        previous.point.y

                    )

                    *

                    local,



                    previous.point.z +

                    (

                        current.point.z -

                        previous.point.z

                    )

                    *

                    local


                );

            }





            previous =

            current;

        }





        return this.samples[

            this.samples.length - 1

        ]

        .point

        .clone();

    }







}