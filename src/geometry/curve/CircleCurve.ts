import { Curve }
from "./Curve";


import { Point }
from "../core/Point";


import { Vector3 }
from "../core/Vector3";


import { Direction }
from "../core/Direction";


import { Plane }
from "../core/Plane";


import { BoundingBox }
from "../core/BoundingBox";


import { Transform }
from "../core/Transform";



export class CircleCurve extends Curve {



    constructor(

        public center:Point,

        public radius:number,

        public plane:Plane = Plane.XY()

    ){

        super();


        if(radius <= 0){

            throw new Error(

                "Circle radius must be positive"

            );

        }

    }




    get startParameter():

    number {

        return 0;

    }





    get endParameter():

    number {

        return Math.PI * 2;

    }





    /**
     * C(t)
     */
    evaluate(

        t:number

    ):

    Point {


        const normal =

        this.plane.normal.toVector();



        let xAxis =

        new Vector3(

            1,

            0,

            0

        );



        if(

            Math.abs(

                normal.dot(xAxis)

            )

            >

            0.99

        ){

            xAxis =

            new Vector3(

                0,

                1,

                0

            );

        }



        const yAxis =

        normal.cross(

            xAxis

        )

        .normalize();



        xAxis =

        yAxis.cross(

            normal

        )

        .normalize();



        const point =

        this.center

        .addVector(

            xAxis.multiply(

                Math.cos(t)

                *

                this.radius

            )

        )

        .addVector(

            yAxis.multiply(

                Math.sin(t)

                *

                this.radius

            )

        );



        return point;

    }





    derivative(

        t:number

    ):

    Vector3 {


        const delta =

        0.000001;



        return this.evaluate(

            t + delta

        )

        .subtract(

            this.evaluate(t)

        )

        .multiply(

            1/delta

        );

    }





    length():

    number {


        return (

            2 *

            Math.PI *

            this.radius

        );

    }





    boundingBox():

    BoundingBox {


        return new BoundingBox(

            new Point(

                this.center.x-this.radius,

                this.center.y-this.radius,

                this.center.z-this.radius

            ),


            new Point(

                this.center.x+this.radius,

                this.center.y+this.radius,

                this.center.z+this.radius

            )

        );

    }





    closestPoint(

        point:Point

    ):

    Point {


        const direction =

        Direction.fromPoints(

            this.center,

            point

        );



        return this.center.addVector(

            direction

            .toVector()

            .multiply(

                this.radius

            )

        );

    }





    reverse():

    CircleCurve {


        return new CircleCurve(

            this.center.clone(),

            this.radius,

            this.plane.reverse()

        );

    }





    transform(

        transform:Transform

    ):

    CircleCurve {


        return new CircleCurve(

            transform.applyToPoint(

                this.center

            ),


            this.radius,


            this.plane.transform(

                transform

            )

        );

    }




}