import { Vector3 } 
from "./Vector3";


import { Transform }
from "./Transform";


export class Point {


    constructor(

        public x:number = 0,

        public y:number = 0,

        public z:number = 0

    ){}



    distanceTo(

        other:Point

    ):number {


        const dx =

        this.x - other.x;


        const dy =

        this.y - other.y;


        const dz =

        this.z - other.z;



        return Math.sqrt(

            dx*dx +

            dy*dy +

            dz*dz

        );

    }



    subtract(

        other:Point

    ):Vector3 {


        return new Vector3(

            this.x - other.x,

            this.y - other.y,

            this.z - other.z

        );

    }



    addVector(

        vector:Vector3

    ):Point {


        return new Point(

            this.x + vector.x,

            this.y + vector.y,

            this.z + vector.z

        );

    }



    transform(

        transform:Transform

    ):Point {


        return transform.applyToPoint(

            this

        );

    }



    equals(

        other:Point,

        tolerance:number = 1e-6

    ):boolean {


        return (

            Math.abs(
                this.x - other.x
            )
            < tolerance

            &&

            Math.abs(
                this.y - other.y
            )
            < tolerance

            &&

            Math.abs(
                this.z - other.z
            )
            < tolerance

        );

    }



    clone():Point {


        return new Point(

            this.x,

            this.y,

            this.z

        );

    }



    toArray():

    number[]{


        return [

            this.x,

            this.y,

            this.z

        ];

    }



    static fromArray(

        values:number[]

    ):Point {


        return new Point(

            values[0] ?? 0,

            values[1] ?? 0,

            values[2] ?? 0

        );

    }



    toString():

    string {


        return `Point(${this.x}, ${this.y}, ${this.z})`;

    }


}