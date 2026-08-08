import { SketchEntity }
from "./SketchEntity";


import { LineEntity }
from "./entities/LineEntity";


import { CircleEntity }
from "./entities/CircleEntity";


import { Point }
from "../../geometry/core/Point";


import { Wire }
from "../../topology/core/Wire";







export enum ProfileType {


    Closed = "Closed",


    Open = "Open",


    Invalid = "Invalid"

}







export class SketchProfile {



    public innerLoops:

    SketchEntity[][] = [];





    constructor(

        public outerLoop:

        SketchEntity[]

    ){}



    addInnerLoop(

        loop:SketchEntity[]

    ):

    void {



        this.innerLoops.push(

            loop

        );

    }







    type():

    ProfileType {



        if(

            this.isClosed()

        ){

            return ProfileType.Closed;

        }



        if(

            this.outerLoop.length > 0

        ){

            return ProfileType.Open;

        }



        return ProfileType.Invalid;

    }







    isClosed():

    boolean {



        if(

            this.outerLoop.length === 0

        ){

            return false;

        }



        const first =

        this.getStartPoint(

            this.outerLoop[0]

        );



        const last =

        this.getEndPoint(

            this.outerLoop[

                this.outerLoop.length-1

            ]

        );



        return (

            Math.abs(

                first.x-last.x

            ) < 1e-6 &&


            Math.abs(

                first.y-last.y

            ) < 1e-6

        );

    }







    toWire():

    Wire {



        const wire =

        new Wire();



        for(

            const entity of

            this.outerLoop

        ){



            wire.addEdge(

                entity.toEdge()

            );

        }



        return wire;

    }







    area():

    number {



        let area = 0;



        const points =

        this.samplePoints();



        for(

            let i=0;

            i<points.length;

            i++

        ){



            const p1 =

            points[i];



            const p2 =

            points[

                (i+1)

                %

                points.length

            ];



            area +=

            (

                p1.x*p2.y

                -

                p2.x*p1.y

            );

        }



        return Math.abs(

            area / 2

        );

    }







    containsPoint(

        point:Point

    ):

    boolean {



        let inside =

        false;



        const points =

        this.samplePoints();



        for(

            let i=0,j=points.length-1;

            i<points.length;

            j=i++

        ){



            const intersect =

            (

                points[i].y >

                point.y

            )

            !==

            (

                points[j].y >

                point.y

            )

            &&


            point.x <

            (

                points[j].x -

                points[i].x

            )

            *

            (

                point.y -

                points[i].y

            )

            /

            (

                points[j].y -

                points[i].y

            )

            +

            points[i].x;



            if(intersect)

            {

                inside =

                !inside;

            }

        }



        return inside;

    }







    private samplePoints():

    Point[] {



        const result:

        Point[] = [];



        for(

            const entity of

            this.outerLoop

        ){



            result.push(

                ...entity.getPoints()

            );

        }



        return result;

    }







    private getStartPoint(

        entity:

        SketchEntity

    ):

    Point {



        return entity.getPoints()[0];

    }







    private getEndPoint(

        entity:

        SketchEntity

    ):

    Point {



        const points =

        entity.getPoints();



        return points[

            points.length-1

        ];

    }



}