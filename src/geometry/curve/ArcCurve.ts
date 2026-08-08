import { Curve }
from "./Curve";


import { Point }
from "../core/Point";


import { Vector3 }
from "../core/Vector3";


import { Plane }
from "../core/Plane";


import { Direction }
from "../core/Direction";


import { BoundingBox }
from "../core/BoundingBox";


import { Transform }
from "../core/Transform";



export class ArcCurve extends Curve {



    constructor(

        public center:Point,

        public radius:number,

        public plane:Plane,

        public startAngle:number,

        public endAngle:number

    ){

        super();


        if(radius <= 0){

            throw new Error(

                "Arc radius must be positive"

            );

        }


        if(endAngle < startAngle){

            throw new Error(

                "Invalid arc angle range"

            );

        }

    }





    get startParameter():

    number {

        return this.startAngle;

    }





    get endParameter():

    number {

        return this.endAngle;

    }





    evaluate(

        t:number

    ):

    Point {


        if(

            t < this.startAngle ||

            t > this.endAngle

        ){

            throw new Error(

                "Parameter outside arc domain"

            );

        }



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




        return this.center

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

            this.endAngle -

            this.startAngle

        )

        *

        this.radius;

    }





    startPoint():

    Point {


        return this.evaluate(

            this.startAngle

        );

    }





    endPoint():

    Point {


        return this.evaluate(

            this.endAngle

        );

    }





    boundingBox():

    BoundingBox {


        const box =

        BoundingBox.empty();



        const samples = 32;



        for(

            let i=0;

            i<=samples;

            i++

        ){

            const t =

            this.startAngle +

            (

                (

                    this.endAngle -

                    this.startAngle

                )

                *

                i

                /

                samples

            );



            box.expand(

                this.evaluate(t)

            );

        }



        return box;

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



        const projected =

        this.center.addVector(

            direction

            .toVector()

            .multiply(

                this.radius

            )

        );



        const angle =

        Math.atan2(

            projected.y-this.center.y,

            projected.x-this.center.x

        );



        if(

            angle < this.startAngle

        ){

            return this.startPoint();

        }



        if(

            angle > this.endAngle

        ){

            return this.endPoint();

        }



        return projected;

    }





    reverse():

    ArcCurve {


        return new ArcCurve(

            this.center.clone(),

            this.radius,

            this.plane.reverse(),

            this.endAngle,

            this.startAngle

        );

    }





    transform(

        transform:Transform

    ):

    ArcCurve {


        return new ArcCurve(

            transform.applyToPoint(

                this.center

            ),

            this.radius,

            this.plane.transform(

                transform

            ),

            this.startAngle,

            this.endAngle

        );

    }




}