import { Point }
from "../../../geometry/core/Point";


import { Vector3 }
from "../../../geometry/core/Vector3";


import { Edge }
from "../../../topology/core/Edge";


import { SketchEntity,
         SketchEntityType }

from "../SketchEntity";







export class ArcEntity

extends SketchEntity {



    constructor(

        id:string,


        public center:Point,


        public radius:number,


        public startAngle:number,


        public endAngle:number

    ){



        super(

            id,

            SketchEntityType.Arc

        );

    }







    getPoints():

    Point[] {



        return [

            this.startPoint(),

            this.endPoint()

        ];

    }







    evaluate(

        t:number

    ):

    Point {



        if(

            t < 0 ||

            t > 1

        ){

            throw new Error(

                "Arc parameter must be between 0 and 1"

            );

        }



        const angle =

        this.startAngle +

        (

            this.endAngle -

            this.startAngle

        )

        * t;



        return new Point(

            this.center.x +

            Math.cos(angle)

            *

            this.radius,


            this.center.y +

            Math.sin(angle)

            *

            this.radius,


            this.center.z

        );

    }







    startPoint():

    Point {



        return new Point(

            this.center.x +

            Math.cos(

                this.startAngle

            )

            *

            this.radius,


            this.center.y +

            Math.sin(

                this.startAngle

            )

            *

            this.radius,


            this.center.z

        );

    }







    endPoint():

    Point {



        return new Point(

            this.center.x +

            Math.cos(

                this.endAngle

            )

            *

            this.radius,


            this.center.y +

            Math.sin(

                this.endAngle

            )

            *

            this.radius,


            this.center.z

        );

    }







    sweepAngle():

    number {



        return (

            this.endAngle -

            this.startAngle

        );

    }







    length():

    number {



        return Math.abs(

            this.sweepAngle()

        )

        *

        this.radius;

    }







    midpoint():

    Point {



        return this.evaluate(

            0.5

        );

    }







    reverse():

    void {



        const temp =

        this.startAngle;



        this.startAngle =

        this.endAngle;



        this.endAngle =

        temp;

    }







    translate(

        vector:Vector3

    ):

    void {



        this.center.x +=

        vector.x;



        this.center.y +=

        vector.y;



        this.center.z +=

        vector.z;

    }







    toEdge():

    Edge {



        return new Edge(

            this.startPoint(),

            this.endPoint()

        );

    }







    clone():

    ArcEntity {



        return new ArcEntity(

            this.id,


            new Point(

                this.center.x,

                this.center.y,

                this.center.z

            ),


            this.radius,


            this.startAngle,


            this.endAngle

        );

    }



}