import { Point }
from "./Point";


import { Vector3 }
from "./Vector3";


import { Direction }
from "./Direction";


import { Transform }
from "./Transform";


import { Line }
from "./Line";



export class Segment {



    constructor(

        public start:Point,

        public end:Point

    ){}




    direction():

    Direction {


        return Direction.fromPoints(

            this.start,

            this.end

        );

    }




    length():

    number {


        return this.start.distanceTo(

            this.end

        );

    }





    midpoint():

    Point {


        return new Point(

            (

                this.start.x +

                this.end.x

            ) / 2,


            (

                this.start.y +

                this.end.y

            ) / 2,


            (

                this.start.z +

                this.end.z

            ) / 2

        );

    }





    pointAt(

        t:number

    ):

    Point {


        return new Point(

            this.start.x +

            (

                this.end.x -

                this.start.x

            )

            *

            t,



            this.start.y +

            (

                this.end.y -

                this.start.y

            )

            *

            t,



            this.start.z +

            (

                this.end.z -

                this.start.z

            )

            *

            t

        );

    }





    containsPoint(

        point:Point,

        tolerance:number=1e-6

    ):

    boolean {



        const line =

        this.toLine();



        const distance =

        line.distanceToPoint(

            point

        );



        if(

            distance > tolerance

        ){

            return false;

        }



        const t =

        line.closestParameter(

            point

        );



        return (

            t >= -tolerance

            &&

            t <= this.length()+tolerance

        );

    }





    projectPoint(

        point:Point

    ):

    Point {



        const line =

        this.toLine();



        const projected =

        line.projectPoint(

            point

        );



        const t =

        this.parameterOf(

            projected

        );



        if(t < 0)

            return this.start.clone();



        if(t > 1)

            return this.end.clone();



        return projected;

    }





    parameterOf(

        point:Point

    ):

    number {


        const length =

        this.length();



        if(length===0)

            return 0;



        return (

            point.distanceTo(

                this.start

            )

            /

            length

        );

    }





    toLine():

    Line {


        return new Line(

            this.start.clone(),

            this.direction()

        );

    }





    reverse():

    Segment {


        return new Segment(

            this.end.clone(),

            this.start.clone()

        );

    }





    transform(

        transform:Transform

    ):

    Segment {


        return new Segment(

            transform.applyToPoint(

                this.start

            ),


            transform.applyToPoint(

                this.end

            )

        );

    }





    clone():

    Segment {


        return new Segment(

            this.start.clone(),

            this.end.clone()

        );

    }





    static fromLine(

        line:Line,

        length:number

    ):

    Segment {


        return new Segment(

            line.pointAt(0),

            line.pointAt(length)

        );

    }


}