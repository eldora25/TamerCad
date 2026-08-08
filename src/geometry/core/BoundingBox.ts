import { Point }
from "./Point";


import { Transform }
from "./Transform";



export class BoundingBox {



    constructor(

        public min:Point,

        public max:Point

    ){}





    center():

    Point {


        return new Point(

            (

                this.min.x +

                this.max.x

            ) / 2,


            (

                this.min.y +

                this.max.y

            ) / 2,


            (

                this.min.z +

                this.max.z

            ) / 2

        );

    }





    size():

    {

        x:number,

        y:number,

        z:number

    } {


        return {

            x:

            this.max.x -

            this.min.x,


            y:

            this.max.y -

            this.min.y,


            z:

            this.max.z -

            this.min.z

        };

    }





    containsPoint(

        point:Point

    ):

    boolean {


        return (

            point.x >= this.min.x

            &&

            point.x <= this.max.x


            &&


            point.y >= this.min.y

            &&

            point.y <= this.max.y


            &&


            point.z >= this.min.z

            &&

            point.z <= this.max.z

        );

    }





    expand(

        point:Point

    ):


    void {


        this.min.x = Math.min(

            this.min.x,

            point.x

        );


        this.min.y = Math.min(

            this.min.y,

            point.y

        );


        this.min.z = Math.min(

            this.min.z,

            point.z

        );



        this.max.x = Math.max(

            this.max.x,

            point.x

        );


        this.max.y = Math.max(

            this.max.y,

            point.y

        );


        this.max.z = Math.max(

            this.max.z,

            point.z

        );

    }





    intersects(

        other:BoundingBox

    ):

    boolean {


        return !(

            this.max.x < other.min.x ||

            this.min.x > other.max.x ||


            this.max.y < other.min.y ||

            this.min.y > other.max.y ||


            this.max.z < other.min.z ||

            this.min.z > other.max.z

        );

    }





    union(

        other:BoundingBox

    ):

    BoundingBox {


        return new BoundingBox(

            new Point(

                Math.min(

                    this.min.x,

                    other.min.x

                ),

                Math.min(

                    this.min.y,

                    other.min.y

                ),

                Math.min(

                    this.min.z,

                    other.min.z

                )

            ),


            new Point(

                Math.max(

                    this.max.x,

                    other.max.x

                ),

                Math.max(

                    this.max.y,

                    other.max.y

                ),

                Math.max(

                    this.max.z,

                    other.max.z

                )

            )

        );

    }





    transform(

        transform:Transform

    ):

    BoundingBox {


        const corners = [

            new Point(

                this.min.x,

                this.min.y,

                this.min.z

            ),


            new Point(

                this.max.x,

                this.min.y,

                this.min.z

            ),


            new Point(

                this.min.x,

                this.max.y,

                this.min.z

            ),


            new Point(

                this.min.x,

                this.min.y,

                this.max.z

            ),


            new Point(

                this.max.x,

                this.max.y,

                this.max.z

            )

        ];



        const first =

        transform.applyToPoint(

            corners[0]

        );



        const result =

        new BoundingBox(

            first.clone(),

            first.clone()

        );



        for(

            const corner of corners

        ){

            result.expand(

                transform.applyToPoint(

                    corner

                )

            );

        }



        return result;

    }





    static empty():

    BoundingBox {


        return new BoundingBox(

            new Point(

                Infinity,

                Infinity,

                Infinity

            ),


            new Point(

                -Infinity,

                -Infinity,

                -Infinity

            )

        );

    }





}