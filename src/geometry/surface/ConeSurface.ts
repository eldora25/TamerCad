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



export class ConeSurface

extends Surface {



    constructor(

        public apex:Point,

        public axis:Direction,

        public angle:number,

        public height:number

    ){

        super();



        if(angle <= 0 || angle >= Math.PI/2){

            throw new Error(

                "Invalid cone angle"

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

        return this.height;

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

            ) > 0.99

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





        const radius =

        v *

        Math.tan(

            this.angle

        );



        return this.apex

        .addVector(

            z.multiply(v)

        )

        .addVector(

            x.multiply(

                Math.cos(u)

                *

                radius

            )

        )

        .addVector(

            y.multiply(

                Math.sin(u)

                *

                radius

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



        const radius =

        v *

        Math.tan(

            this.angle

        );



        return (

            x.multiply(

                -Math.sin(u)

                *

                radius

            )

            .add(

                y.multiply(

                    Math.cos(u)

                    *

                    radius

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



        const scale =

        Math.tan(

            this.angle

        );



        return z.add(

            x.multiply(

                Math.cos(u)

                *

                scale

            )

        )

        .add(

            y.multiply(

                Math.sin(u)

                *

                scale

            )

        );

    }







    boundingBox():

    BoundingBox {


        const r =

        this.height *

        Math.tan(

            this.angle

        );



        return new BoundingBox(

            new Point(

                this.apex.x-r,

                this.apex.y-r,

                this.apex.z

            ),


            new Point(

                this.apex.x+r,

                this.apex.y+r,

                this.apex.z+

                this.height

            )

        );

    }







    reverse():

    ConeSurface {


        return new ConeSurface(

            this.apex.clone(),

            this.axis.reverse(),

            this.angle,

            this.height

        );

    }







    transform(

        transform:Transform

    ):

    ConeSurface {


        return new ConeSurface(

            transform.applyToPoint(

                this.apex

            ),

            this.axis.transform(

                transform

            ),

            this.angle,

            this.height

        );

    }



}