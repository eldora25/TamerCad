import { Point }
from "./Point";


import { Direction }
from "./Direction";


import { Transform }
from "./Transform";


import { Vector3 }
from "./Vector3";



export class Line {



    constructor(

        public origin:Point,

        public direction:Direction

    ){}




    /**
     * L(t)=P+tD
     */
    pointAt(

        parameter:number

    ):Point {


        const offset =

        this.direction

        .toVector()

        .multiply(

            parameter

        );


        return this.origin.addVector(

            offset

        );

    }





    /**
     * Noktanın doğru üzerindeki izdüşümü
     */
    projectPoint(

        point:Point

    ):Point {


        const vector =

        point.subtract(

            this.origin

        );


        const distance =

        vector.dot(

            this.direction.toVector()

        );



        return this.pointAt(

            distance

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





    closestParameter(

        point:Point

    ):number {


        const vector =

        point.subtract(

            this.origin

        );



        return vector.dot(

            this.direction.toVector()

        );

    }





    isParallel(

        other:Line

    ):boolean {


        return this.direction.isParallel(

            other.direction

        );

    }





    isCoincident(

        other:Line

    ):boolean {


        if(
            !this.isParallel(other)
        ){

            return false;

        }



        return this.distanceToPoint(

            other.origin

        )

        <

        1e-6;


    }





    reverse():

    Line {


        return new Line(

            this.origin.clone(),

            this.direction.reverse()

        );

    }





    transform(

        transform:Transform

    ):

    Line {


        return new Line(

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





    toString():

    string {


        return (

            `Line(` +

            `${this.origin.toString()}, ` +

            `${this.direction.toVector().toString()}` +

            `)`

        );

    }




    static fromPoints(

        a:Point,

        b:Point

    ):

    Line {


        return new Line(

            a.clone(),

            new Direction(

                b.subtract(a)

            )

        );

    }


}