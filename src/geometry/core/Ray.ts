import { Point }
from "./Point";


import { Direction }
from "./Direction";


import { Transform }
from "./Transform";


import { Line }
from "./Line";



export class Ray {



    constructor(

        public origin:Point,

        public direction:Direction

    ){}





    /**
     * R(t)=P+tD
     * t >= 0
     */
    pointAt(

        t:number

    ):Point {


        if(t < 0){

            throw new Error(

                "Ray parameter cannot be negative"

            );

        }



        return this.origin.addVector(

            this.direction

            .toVector()

            .multiply(t)

        );

    }





    closestParameter(

        point:Point

    ):number {


        const vector =

        point.subtract(

            this.origin

        );



        return Math.max(

            0,

            vector.dot(

                this.direction.toVector()

            )

        );

    }





    projectPoint(

        point:Point

    ):Point {


        return this.pointAt(

            this.closestParameter(

                point

            )

        );

    }





    distanceToPoint(

        point:Point

    ):number {


        return point.distanceTo(

            this.projectPoint(

                point

            )

        );

    }





    containsPoint(

        point:Point,

        tolerance:number=1e-6

    ):boolean {


        return (

            this.distanceToPoint(

                point

            )

            <

            tolerance

        );

    }





    toLine():

    Line {


        return new Line(

            this.origin.clone(),

            this.direction

        );

    }





    reverse():

    Ray {


        return new Ray(

            this.origin.clone(),

            this.direction.reverse()

        );

    }





    transform(

        transform:Transform

    ):

    Ray {


        return new Ray(

            transform.applyToPoint(

                this.origin

            ),


            new Direction(

                transform.applyToVector(

                    this.direction.toVector()

                )

            )

        );

    }





    clone():

    Ray {


        return new Ray(

            this.origin.clone(),

            this.direction

        );

    }





    static fromPoints(

        start:Point,

        through:Point

    ):

    Ray {


        return new Ray(

            start.clone(),

            Direction.fromPoints(

                start,

                through

            )

        );

    }


}