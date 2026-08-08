import { Point }
from "./Point";


import { Direction }
from "./Direction";


import { Vector3 }
from "./Vector3";


import { Transform }
from "./Transform";



export class Axis {



    constructor(

        public origin:Point,

        public direction:Direction

    ){}



    pointAt(

        distance:number

    ):Point {


        const offset =

        this.direction

        .toVector()

        .multiply(

            distance

        );



        return this.origin.addVector(

            offset

        );

    }




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


        const projection =

        this.projectPoint(

            point

        );


        return point.distanceTo(

            projection

        );

    }





    reverse():

    Axis {


        return new Axis(

            this.origin.clone(),

            this.direction.reverse()

        );

    }





    transform(

        transform:Transform

    ):

    Axis {


        return new Axis(

            transform.applyToPoint(

                this.origin

            ),


            transform.applyToVector(

                this.direction.toVector()

            )

            instanceof Direction

            ?

            transform.applyToVector(

                this.direction.toVector()

            )

            :

            new Direction(

                transform.applyToVector(

                    this.direction.toVector()

                )

            )

        );

    }





    equals(

        other:Axis

    ):boolean {


        return (

            this.origin.equals(

                other.origin

            )

            &&

            this.direction.equals(

                other.direction

            )

        );

    }





    static X_AXIS():

    Axis {


        return new Axis(

            new Point(),

            Direction.X()

        );

    }




    static Y_AXIS():

    Axis {


        return new Axis(

            new Point(),

            Direction.Y()

        );

    }




    static Z_AXIS():

    Axis {


        return new Axis(

            new Point(),

            Direction.Z()

        );

    }




}