import { Curve3 } from "./Curve3";
import { Point3 } from "../point/Point3";
import { Vector3 } from "../../math/vector/Vector3";


export class BezierCurve3 extends Curve3 {


    public controlPoints: Point3[];



    constructor(
        controlPoints: Point3[]
    ){

        super();


        if(controlPoints.length < 2){

            throw new Error(
                "Bezier curve requires at least 2 control points"
            );

        }


        this.controlPoints =
            controlPoints.map(
                p => p.clone()
            );

    }



    /**
     * Degree of Bezier curve
     */
    degree():number {

        return this.controlPoints.length - 1;

    }



    /**
     * De Casteljau algorithm
     */
    evaluate(
        t:number
    ):Point3 {


        let points =
            this.controlPoints.map(
                p => p.clone()
            );



        while(points.length > 1){


            const next:Point3[] = [];



            for(
                let i = 0;
                i < points.length - 1;
                i++
            ){


                const a =
                    points[i];


                const b =
                    points[i+1];



                next.push(

                    new Point3(

                        a.x +
                        (b.x-a.x)*t,


                        a.y +
                        (b.y-a.y)*t,


                        a.z +
                        (b.z-a.z)*t

                    )

                );

            }


            points = next;

        }



        return points[0];

    }



    startPoint():Point3 {


        return this.controlPoints[0]
            .clone();

    }



    endPoint():Point3 {


        return this.controlPoints[
            this.controlPoints.length - 1
        ]
        .clone();

    }



    tangent(
        t:number
    ):Vector3 {


        const delta =
            0.00001;



        const p1 =
            this.evaluate(
                Math.max(
                    0,
                    t-delta
                )
            );


        const p2 =
            this.evaluate(
                Math.min(
                    1,
                    t+delta
                )
            );



        return p2
            .subtract(p1)
            .normalize();

    }



    length(
        segments:number = 100
    ):number {


        let total = 0;


        let previous =
            this.evaluate(0);



        for(
            let i=1;
            i<=segments;
            i++
        ){


            const current =
                this.evaluate(
                    i / segments
                );


            total +=
                previous.distanceTo(
                    current
                );


            previous =
                current;

        }


        return total;

    }



    addControlPoint(
        point:Point3
    ):void {


        this.controlPoints.push(
            point.clone()
        );

    }



    removeControlPoint(
        index:number
    ):void {


        if(
            index >=0 &&
            index < this.controlPoints.length
        ){

            this.controlPoints.splice(
                index,
                1
            );

        }

    }



    getControlPoints():Point3[] {


        return this.controlPoints.map(
            p => p.clone()
        );

    }



    reverse():BezierCurve3 {


        return new BezierCurve3(

            [
                ...this.controlPoints
            ]
            .reverse()

        );

    }



    clone():BezierCurve3 {


        return new BezierCurve3(

            this.controlPoints.map(
                p => p.clone()
            )

        );

    }



    toString():string {


        return (
            `BezierCurve3(Degree:${this.degree()}, ` +
            `ControlPoints:${this.controlPoints.length})`
        );

    }

}