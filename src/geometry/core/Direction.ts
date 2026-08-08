import { Vector3 }
from "./Vector3";


import { Transform }
from "./Transform";


import { Tolerance }
from "./Tolerance";



export class Direction {



    private vector:Vector3;



    constructor(

        vector:Vector3

    ){


        const length =

        vector.length();



        if(
            Tolerance.isZero(length)
        ){

            throw new Error(

                "Direction cannot be zero vector"

            );

        }



        this.vector =

        vector.normalize();

    }



    get x():

    number {

        return this.vector.x;

    }



    get y():

    number {

        return this.vector.y;

    }



    get z():

    number {

        return this.vector.z;

    }




    toVector():

    Vector3 {


        return this.vector.clone();

    }




    reverse():

    Direction {


        return new Direction(

            this.vector.multiply(-1)

        );

    }




    dot(

        other:Direction

    ):number {


        return this.vector.dot(

            other.vector

        );

    }




    cross(

        other:Direction

    ):Direction {


        return new Direction(

            this.vector.cross(

                other.vector

            )

        );

    }




    angleTo(

        other:Direction

    ):number {


        return this.vector.angleTo(

            other.vector

        );

    }




    isParallel(

        other:Direction,

        tolerance:number = 1e-8

    ):boolean {


        const cross =

        this.vector.cross(

            other.vector

        );



        return (

            cross.length()

            <

            tolerance

        );

    }




    isPerpendicular(

        other:Direction,

        tolerance:number = 1e-8

    ):boolean {


        return Math.abs(

            this.dot(other)

        )

        <

        tolerance;

    }




    transform(

        transform:Transform

    ):

    Direction {


        return new Direction(

            transform.applyToVector(

                this.vector

            )

        );

    }




    equals(

        other:Direction,

        tolerance:number = 1e-8

    ):

    boolean {


        return this.vector.equals(

            other.vector,

            tolerance

        );

    }




    static X():

    Direction {


        return new Direction(

            new Vector3(

                1,0,0

            )

        );

    }




    static Y():

    Direction {


        return new Direction(

            new Vector3(

                0,1,0

            )

        );

    }




    static Z():

    Direction {


        return new Direction(

            new Vector3(

                0,0,1

            )

        );

    }




    static fromPoints(

        a:Vector3,

        b:Vector3

    ):

    Direction {


        return new Direction(

            b.subtract(a)

        );

    }


}