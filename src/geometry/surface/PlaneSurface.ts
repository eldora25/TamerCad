import { Surface }
from "./Surface";


import { Point }
from "../core/Point";


import { Vector3 }
from "../core/Vector3";


import { Plane }
from "../core/Plane";


import { BoundingBox }
from "../core/BoundingBox";


import { Transform }
from "../core/Transform";







export class PlaneSurface

extends Surface {



    constructor(

        public plane:Plane,

        public size:number = 1000

    ){

        super();

    }







    get uMin():

    number {



        return -this.size;

    }









    get uMax():

    number {



        return this.size;

    }









    get vMin():

    number {



        return -this.size;

    }









    get vMax():

    number {



        return this.size;

    }









    evaluate(

        u:number,

        v:number

    ):

    Point {



        const uAxis =

        this.plane

        .xAxis

        .toVector();



        const vAxis =

        this.plane

        .yAxis

        .toVector();





        return this.plane

        .origin

        .addVector(

            uAxis.multiply(

                u

            )

        )

        .addVector(

            vAxis.multiply(

                v

            )

        );

    }









    derivativeU(

        u:number,

        v:number

    ):

    Vector3 {



        return this.plane

        .xAxis

        .toVector()

        .normalize();

    }









    derivativeV(

        u:number,

        v:number

    ):

    Vector3 {



        return this.plane

        .yAxis

        .toVector()

        .normalize();

    }









    normal(

        u:number,

        v:number

    ):

    Vector3 {



        const du =

        this.derivativeU(

            u,

            v

        );



        const dv =

        this.derivativeV(

            u,

            v

        );





        return new Vector3(

            du.y * dv.z -

            du.z * dv.y,


            du.z * dv.x -

            du.x * dv.z,


            du.x * dv.y -

            du.y * dv.x

        )

        .normalize();

    }









    area():

    number {



        /*

            PlaneSurface sonsuzdur.

            Trimlenmiş Face alanı

            Face boundary wire üzerinden

            hesaplanmalıdır.


        */



        return Infinity;

    }









    boundingBox():

    BoundingBox {



        const points =


        [


            this.evaluate(

                this.uMin,

                this.vMin

            ),


            this.evaluate(

                this.uMax,

                this.vMin

            ),


            this.evaluate(

                this.uMax,

                this.vMax

            ),


            this.evaluate(

                this.uMin,

                this.vMax

            )


        ];





        let minX =

        Infinity;


        let minY =

        Infinity;


        let minZ =

        Infinity;



        let maxX =

        -Infinity;


        let maxY =

        -Infinity;


        let maxZ =

        -Infinity;





        for(

            const p of

            points

        ){



            minX =

            Math.min(

                minX,

                p.x

            );



            minY =

            Math.min(

                minY,

                p.y

            );



            minZ =

            Math.min(

                minZ,

                p.z

            );





            maxX =

            Math.max(

                maxX,

                p.x

            );



            maxY =

            Math.max(

                maxY,

                p.y

            );



            maxZ =

            Math.max(

                maxZ,

                p.z

            );

        }





        return new BoundingBox(

            new Point(

                minX,

                minY,

                minZ

            ),


            new Point(

                maxX,

                maxY,

                maxZ

            )

        );

    }









    reverse():

    PlaneSurface {



        return new PlaneSurface(

            this.plane.reverse(),

            this.size

        );

    }









    transform(

        transform:Transform

    ):

    PlaneSurface {



        return new PlaneSurface(

            this.plane.transform(

                transform

            ),

            this.size

        );

    }







}