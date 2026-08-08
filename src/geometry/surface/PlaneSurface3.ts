import { Surface3 } from "./Surface3";
import { Point3 } from "../point/Point3";
import { Vector3 } from "../../math/vector/Vector3";


export class PlaneSurface3 extends Surface3 {


    public origin:Point3;

    public normalVector:Vector3;

    public uDirection:Vector3;

    public vDirection:Vector3;



    constructor(
        origin:Point3,
        normal:Vector3 = new Vector3(0,0,1)
    ){

        super();


        this.origin =
            origin.clone();


        this.normalVector =
            normal.normalize();



        /*
            Plane koordinat sistemi oluşturma
        */

        let reference =
            new Vector3(
                1,
                0,
                0
            );



        if(
            Math.abs(
                this.normalVector.dot(reference)
            ) > 0.9
        ){

            reference =
                new Vector3(
                    0,
                    1,
                    0
                );

        }



        this.uDirection =
            this.normalVector
                .cross(reference)
                .normalize();



        this.vDirection =
            this.normalVector
                .cross(
                    this.uDirection
                )
                .normalize();

    }



    /**
     * Plane parametric evaluation
     *
     * P(u,v)=O+uU+vV
     */
    evaluate(
        u:number,
        v:number
    ):Point3 {


        const uVector =
            this.uDirection
                .multiply(u);



        const vVector =
            this.vDirection
                .multiply(v);



        return this.origin
            .add(
                uVector.add(vVector)
            );

    }



    startPoint():Point3 {


        return this.origin.clone();

    }



    normal(
        _u:number,
        _v:number
    ):Vector3 {


        return new Vector3(

            this.normalVector.x,

            this.normalVector.y,

            this.normalVector.z

        );

    }



    distanceToPoint(
        point:Point3
    ):number {


        const vector =
            point.subtract(
                this.origin
            );


        return Math.abs(

            vector.dot(
                this.normalVector
            )

        );

    }



    projectPoint(
        point:Point3
    ):Point3 {


        const distance =
            point
            .subtract(
                this.origin
            )
            .dot(
                this.normalVector
            );



        return point.add(

            this.normalVector
                .multiply(
                    -distance
                )

        );

    }



    containsPoint(
        point:Point3,
        tolerance:number = 0.000001
    ):boolean {


        return (
            this.distanceToPoint(point)
            <
            tolerance
        );

    }



    type():string {


        return "PlaneSurface3";

    }



    clone():PlaneSurface3 {


        return new PlaneSurface3(

            this.origin.clone(),

            new Vector3(

                this.normalVector.x,

                this.normalVector.y,

                this.normalVector.z

            )

        );

    }



    toString():string {


        return (
            `PlaneSurface3(` +
            `Origin:${this.origin.toString()}, ` +
            `Normal:${this.normalVector.x},` +
            `${this.normalVector.y},` +
            `${this.normalVector.z})`
        );

    }

}