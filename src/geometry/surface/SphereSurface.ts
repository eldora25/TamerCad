import { Surface }
from "./Surface";


import { Point }
from "../core/Point";


import { Vector3 }
from "../core/Vector3";


import { BoundingBox }
from "../core/BoundingBox";


import { Transform }
from "../core/Transform";



export class SphereSurface

extends Surface {



    constructor(

        public center:Point,

        public radius:number

    ){

        super();



        if(radius <= 0){

            throw new Error(

                "Sphere radius must be positive"

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

        return -Math.PI / 2;

    }





    get vMax():

    number {

        return Math.PI / 2;

    }







    evaluate(

        u:number,

        v:number

    ):

    Point {



        const x =

        Math.cos(v)

        *

        Math.cos(u)

        *

        this.radius;



        const y =

        Math.cos(v)

        *

        Math.sin(u)

        *

        this.radius;



        const z =

        Math.sin(v)

        *

        this.radius;



        return this.center

        .addVector(

            new Vector3(

                x,

                y,

                z

            )

        );

    }







    derivativeU(

        u:number,

        v:number

    ):

    Vector3 {



        return new Vector3(

            -Math.cos(v)

            *

            Math.sin(u)

            *

            this.radius,


            Math.cos(v)

            *

            Math.cos(u)

            *

            this.radius,


            0

        );

    }







    derivativeV(

        u:number,

        v:number

    ):

    Vector3 {



        return new Vector3(

            -Math.sin(v)

            *

            Math.cos(u)

            *

            this.radius,


            -Math.sin(v)

            *

            Math.sin(u)

            *

            this.radius,


            Math.cos(v)

            *

            this.radius

        );

    }







    boundingBox():

    BoundingBox {


        const r =

        this.radius;



        return new BoundingBox(

            new Point(

                this.center.x-r,

                this.center.y-r,

                this.center.z-r

            ),


            new Point(

                this.center.x+r,

                this.center.y+r,

                this.center.z+r

            )

        );

    }







    reverse():

    SphereSurface {


        return new SphereSurface(

            this.center.clone(),

            this.radius

        );

    }







    transform(

        transform:Transform

    ):

    SphereSurface {


        return new SphereSurface(

            transform.applyToPoint(

                this.center

            ),

            this.radius

        );

    }



}