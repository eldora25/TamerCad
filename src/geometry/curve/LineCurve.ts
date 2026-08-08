import { Curve }
from "./Curve";


import { Point }
from "../core/Point";


import { Vector3 }
from "../core/Vector3";


import { Direction }
from "../core/Direction";


import { Line }
from "../core/Line";


import { BoundingBox }
from "../core/BoundingBox";


import { Transform }
from "../core/Transform";



export class LineCurve extends Curve {



    private line:Line;



    constructor(

        origin:Point,

        direction:Direction

    ){

        super();


        this.line =

        new Line(

            origin,

            direction

        );

    }




    get startParameter():

    number {

        return -Infinity;

    }





    get endParameter():

    number {

        return Infinity;

    }





    evaluate(

        t:number

    ):

    Point {


        return this.line.pointAt(

            t

        );

    }





    derivative(

        t:number

    ):

    Vector3 {


        return this.line.direction

        .toVector();

    }





    length():

    number {


        return Infinity;

    }





    boundingBox():

    BoundingBox {


        return new BoundingBox(

            new Point(

                -Infinity,

                -Infinity,

                -Infinity

            ),


            new Point(

                Infinity,

                Infinity,

                Infinity

            )

        );

    }





    closestPoint(

        point:Point

    ):

    Point {


        return this.line.projectPoint(

            point

        );

    }





    reverse():

    LineCurve {


        return new LineCurve(

            this.line.origin.clone(),

            this.line.direction.reverse()

        );

    }





    transform(

        transform:Transform

    ):

    LineCurve {


        return new LineCurve(

            transform.applyToPoint(

                this.line.origin

            ),


            new Direction(

                transform.applyToVector(

                    this.line.direction.toVector()

                )

            )

        );

    }





    getLine():

    Line {


        return this.line;

    }





    static fromPoints(

        start:Point,

        end:Point

    ):

    LineCurve {


        return new LineCurve(

            start,

            Direction.fromPoints(

                start,

                end

            )

        );

    }



}