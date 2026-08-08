import { Vector3 } from "../../math/vector/Vector3";
import { Matrix4 } from "../../math/matrix/Matrix4";


export class Point3 {


    public x:number;
    public y:number;
    public z:number;



    constructor(
        x:number = 0,
        y:number = 0,
        z:number = 0
    ){

        this.x = x;
        this.y = y;
        this.z = z;

    }



    static origin():Point3 {

        return new Point3(
            0,
            0,
            0
        );

    }



    toVector():Vector3 {


        return new Vector3(
            this.x,
            this.y,
            this.z
        );

    }



    static fromVector(
        vector:Vector3
    ):Point3 {


        return new Point3(
            vector.x,
            vector.y,
            vector.z
        );

    }



    add(
        vector:Vector3
    ):Point3 {


        return new Point3(

            this.x + vector.x,
            this.y + vector.y,
            this.z + vector.z

        );

    }



    subtract(
        point:Point3
    ):Vector3 {


        return new Vector3(

            this.x - point.x,
            this.y - point.y,
            this.z - point.z

        );

    }



    distanceTo(
        point:Point3
    ):number {


        const dx =
            this.x - point.x;


        const dy =
            this.y - point.y;


        const dz =
            this.z - point.z;



        return Math.sqrt(

            dx * dx +
            dy * dy +
            dz * dz

        );

    }



    midpoint(
        point:Point3
    ):Point3 {


        return new Point3(

            (this.x + point.x) / 2,
            (this.y + point.y) / 2,
            (this.z + point.z) / 2

        );

    }



    transform(
        matrix:Matrix4
    ):Point3 {


        const result =
            matrix.transformVector(
                this.x,
                this.y,
                this.z
            );


        return new Point3(

            result.x,
            result.y,
            result.z

        );

    }



    equals(
        point:Point3,
        tolerance:number = 0.000001
    ):boolean {


        return (

            Math.abs(this.x - point.x)
                < tolerance &&


            Math.abs(this.y - point.y)
                < tolerance &&


            Math.abs(this.z - point.z)
                < tolerance

        );

    }



    clone():Point3 {


        return new Point3(

            this.x,
            this.y,
            this.z

        );

    }



    toString():string {


        return `Point3(${this.x}, ${this.y}, ${this.z})`;

    }


}