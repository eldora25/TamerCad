import { Transform }
from "./Transform";


export class Vector3 {


    constructor(

        public x:number = 0,

        public y:number = 0,

        public z:number = 0

    ){}



    add(

        other:Vector3

    ):Vector3 {


        return new Vector3(

            this.x + other.x,

            this.y + other.y,

            this.z + other.z

        );

    }



    subtract(

        other:Vector3

    ):Vector3 {


        return new Vector3(

            this.x - other.x,

            this.y - other.y,

            this.z - other.z

        );

    }



    multiply(

        scalar:number

    ):Vector3 {


        return new Vector3(

            this.x * scalar,

            this.y * scalar,

            this.z * scalar

        );

    }



    divide(

        scalar:number

    ):Vector3 {


        return new Vector3(

            this.x / scalar,

            this.y / scalar,

            this.z / scalar

        );

    }



    length():

    number {


        return Math.sqrt(

            this.x*this.x +

            this.y*this.y +

            this.z*this.z

        );

    }



    lengthSquared():

    number {


        return (

            this.x*this.x +

            this.y*this.y +

            this.z*this.z

        );

    }



    normalize():

    Vector3 {


        const len =

        this.length();



        if(len===0){

            return new Vector3();

        }



        return this.divide(len);

    }



    dot(

        other:Vector3

    ):number {


        return (

            this.x*other.x +

            this.y*other.y +

            this.z*other.z

        );

    }



    cross(

        other:Vector3

    ):Vector3 {


        return new Vector3(

            this.y*other.z -
            this.z*other.y,


            this.z*other.x -
            this.x*other.z,


            this.x*other.y -
            this.y*other.x

        );

    }



    angleTo(

        other:Vector3

    ):number {


        const denominator =

        this.length() *

        other.length();



        if(
            denominator===0
        ){

            return 0;

        }



        const value =

        this.dot(other)

        /

        denominator;



        return Math.acos(

            Math.max(

                -1,

                Math.min(

                    1,

                    value

                )

            )

        );

    }




    projectOn(

        other:Vector3

    ):Vector3 {


        const denom =

        other.lengthSquared();



        if(denom===0){

            return new Vector3();

        }



        return other.multiply(

            this.dot(other)

            /

            denom

        );

    }




    distanceTo(

        other:Vector3

    ):number {


        return this.subtract(

            other

        ).length();

    }




    transform(

        transform:Transform

    ):Vector3 {


        return transform.applyToVector(

            this

        );

    }




    equals(

        other:Vector3,

        tolerance:number=1e-6

    ):boolean {


        return (

            Math.abs(
                this.x-other.x
            )

            < tolerance


            &&


            Math.abs(
                this.y-other.y
            )

            < tolerance


            &&


            Math.abs(
                this.z-other.z
            )

            < tolerance

        );

    }




    clone():

    Vector3 {


        return new Vector3(

            this.x,

            this.y,

            this.z

        );

    }




    static zero():

    Vector3 {


        return new Vector3(
            0,
            0,
            0
        );

    }




    static xAxis():

    Vector3 {


        return new Vector3(
            1,
            0,
            0
        );

    }




    static yAxis():

    Vector3 {


        return new Vector3(
            0,
            1,
            0
        );

    }




    static zAxis():

    Vector3 {


        return new Vector3(
            0,
            0,
            1
        );

    }


}