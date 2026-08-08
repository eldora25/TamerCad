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



export class TorusSurface

extends Surface {



    constructor(

        public center:Point,

        public axis:Direction,

        public majorRadius:number,

        public minorRadius:number

    ){

        super();



        if(

            majorRadius <= 0 ||

            minorRadius <= 0

        ){

            throw new Error(

                "Invalid torus radius"

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

        return 0;

    }





    get vMax():

    number {

        return Math.PI * 2;

    }







    private basis(){

        const z =

        this.axis

        .toVector()

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

            >0.99

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



        const tubeOffset =

        this.minorRadius *

        Math.cos(v);



        const radial =

        this.majorRadius +

        tubeOffset;



        return this.center

        .addVector(

            x.multiply(

                Math.cos(u)

                *

                radial

            )

        )

        .addVector(

            y.multiply(

                Math.sin(u)

                *

                radial

            )

        )

        .addVector(

            z.multiply(

                Math.sin(v)

                *

                this.minorRadius

            )

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



        const radial =

        this.majorRadius +

        this.minorRadius *

        Math.cos(v);



        return (

            x.multiply(

                -Math.sin(u)

                *

                radial

            )

            .add(

                y.multiply(

                    Math.cos(u)

                    *

                    radial

                )

            )

        );

    }







    derivativeV(

        u:number,

        v:number

    ):

    Vector3 {



        const {

            x,

            y,

            z

        } = this.basis();



        return (

            x.multiply(

                -Math.cos(u)

                *

                Math.sin(v)

                *

                this.minorRadius

            )

            .add(

                y.multiply(

                    -Math.sin(u)

                    *

                    Math.sin(v)

                    *

                    this.minorRadius

                )

            )

            .add(

                z.multiply(

                    Math.cos(v)

                    *

                    this.minorRadius

                )

            )

        );

    }







    boundingBox():

    BoundingBox {



        const r =

        this.majorRadius +

        this.minorRadius;



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

    TorusSurface {


        return new TorusSurface(

            this.center.clone(),

            this.axis.reverse(),

            this.majorRadius,

            this.minorRadius

        );

    }







    transform(

        transform:Transform

    ):

    TorusSurface {


        return new TorusSurface(

            transform.applyToPoint(

                this.center

            ),

            this.axis.transform(

                transform

            ),

            this.majorRadius,

            this.minorRadius

        );

    }



}