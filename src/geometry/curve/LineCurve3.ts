import { Curve3 } from "./Curve3";
import { Point3 } from "../point/Point3";
import { Vector3 } from "../../math/vector/Vector3";


export class LineCurve3 extends Curve3 {


    public start: Point3;

    public end: Point3;



    constructor(
        start: Point3,
        end: Point3
    ){

        super();

        this.start = start;
        this.end = end;

    }



    /**
     * Parametric evaluation
     *
     * t = 0  başlangıç
     * t = 1  bitiş
     */
    evaluate(
        t:number
    ):Point3 {


        return new Point3(

            this.start.x +
            (
                this.end.x -
                this.start.x
            ) * t,


            this.start.y +
            (
                this.end.y -
                this.start.y
            ) * t,


            this.start.z +
            (
                this.end.z -
                this.start.z
            ) * t

        );

    }



    startPoint():Point3 {

        return this.start.clone();

    }



    endPoint():Point3 {

        return this.end.clone();

    }



    direction():Vector3 {


        return this.end
            .subtract(
                this.start
            )
            .normalize();

    }



    length():number {


        return this.start
            .distanceTo(
                this.end
            );

    }



    tangent(
        _t:number = 0
    ):Vector3 {


        return this.direction();

    }



    reverse():LineCurve3 {


        return new LineCurve3(

            this.end.clone(),

            this.start.clone()

        );

    }



    closestPoint(
        point:Point3
    ):Point3 {


        const line =
            this.end
                .subtract(
                    this.start
                );



        const toPoint =
            point.subtract(
                this.start
            );



        const lengthSquared =
            line.dot(line);



        if(lengthSquared === 0)
            return this.start.clone();



        let t =
            toPoint.dot(line)
            /
            lengthSquared;



        t =
            Math.max(
                0,
                Math.min(
                    1,
                    t
                )
            );



        return this.evaluate(t);

    }



    split(
        t:number
    ):{first:LineCurve3, second:LineCurve3} {


        const middle =
            this.evaluate(t);



        return {


            first:
                new LineCurve3(

                    this.start.clone(),

                    middle

                ),



            second:
                new LineCurve3(

                    middle,

                    this.end.clone()

                )

        };

    }



    clone():LineCurve3 {


        return new LineCurve3(

            this.start.clone(),

            this.end.clone()

        );

    }



    toString():string {


        return (
            `LineCurve3(` +
            `${this.start.toString()} -> ` +
            `${this.end.toString()})`
        );

    }

}