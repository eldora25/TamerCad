import { Surface }
from "./Surface";


import { Point }
from "../core/Point";


import { Vector3 }
from "../core/Vector3";


import { Direction }
from "../core/Direction";


import { BoundingBox }
from "../core/BoundingBox";


import { Transform }
from "../core/Transform";



export class CylinderSurface

extends Surface {



    constructor(

        public center:Point,

        public axis:Direction,

        public radius:number,

        public height:number = 100

    ){

        super();



        if(radius <= 0){

            throw new Error(

                "Cylinder radius must be positive"

            );

        }

    }





    get uMin():

    number {

        return 0;

    }





    get uMax():

    number {

        return Math.PI * 2;

    }





    get vMin():

    number {

        return -this.height/2;

    }





    get vMax():

    number {

        return this.height/2;

    }





    private basis():

    {

        x:Vector3,

        y:Vector3,

        z:Vector3

    } {



        const z =

        this.axis.toVector()

        .normalize();



        let x =

        new Vector3(

            1,

            0,

            0

        );



        if(

            Math.abs(

                z.dot(x)

            )

            >

            0.99

        ){

            x =

            new Vector3(

                0,

                1,

                0

            );

        }



        const y =

        z.cross(x)

        .normalize();



        x =

        y.cross(z)

        .normalize();



        return {

            x,

            y,

            z

        };

    }







    evaluate(

        u:number,

        v:number

    ):

    Point {



        const {

            x,

            y,

            z

        } = this.basis();



        return this.center

        .addVector(

            x.multiply(

                Math.cos(u)

                *

                this.radius

            )

        )

        .addVector(

            y.multiply(

                Math.sin(u)

                *

                this.radius

            )

        )

        .addVector(

            z.multiply(v)

        );

    }







    derivativeU(

        u:number,

        v:number

    ):

    Vector3 {


        const {

            x,

            y

        } = this.basis();



        return (

            x.multiply(

                -Math.sin(u)

                *

                this.radius

            )

            .add(

                y.multiply(

                    Math.cos(u)

                    *

                    this.radius

                )

            )

        );

    }







    derivativeV(

        u:number,

        v:number

    ):

    Vector3 {


        return this.axis

        .toVector()

        .normalize();

    }







    boundingBox():

    BoundingBox {


        const {

            x,

            y,

            z

        } = this.basis();



        const r =

        this.radius;



        const h =

        this.height/2;



        return new BoundingBox(

            this.center

            .addVector(

                new Vector3(

                    -r,

                    -r,

                    -h

                )

            ),


            this.center

            .addVector(

                new Vector3(

                    r,

                    r,

                    h

                )

            )

        );

    }







    reverse():

    CylinderSurface {


        return new CylinderSurface(

            this.center.clone(),

            this.axis.reverse(),

            this.radius,

            this.height

        );

    }







    transform(

        transform:Transform

    ):

    CylinderSurface {


        return new CylinderSurface(

            transform.applyToPoint(

                this.center

            ),

            this.axis.transform(

                transform

            ),

            this.radius,

            this.height

        );

    }



}