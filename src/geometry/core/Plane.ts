import { Point }
from "./Point";


import { Direction }
from "./Direction";


import { Vector3 }
from "./Vector3";


import { Transform }
from "./Transform";


import { Line }
from "./Line";



export class Plane {



    constructor(

        public origin:Point,

        public normal:Direction

    ){}





    /**
     * Noktanın düzleme izdüşümü
     */
    projectPoint(

        point:Point

    ):Point {


        const vector =

        point.subtract(

            this.origin

        );



        const distance =

        vector.dot(

            this.normal.toVector()

        );



        const correction =

        this.normal

        .toVector()

        .multiply(

            distance

        );



        return point.addVector(

            correction.multiply(-1)

        );

    }





    /**
     * Noktanın düzleme uzaklığı
     */
    distanceToPoint(

        point:Point

    ):number {


        const vector =

        point.subtract(

            this.origin

        );



        return Math.abs(

            vector.dot(

                this.normal.toVector()

            )

        );

    }





    /**
     * Nokta düzlem üzerinde mi?
     */
    containsPoint(

        point:Point,

        tolerance:number=1e-6

    ):boolean {


        return (

            this.distanceToPoint(

                point

            )

            <

            tolerance

        );

    }





    /**
     * Doğru düzleme paralel mi?
     */
    isLineParallel(

        line:Line

    ):boolean {


        return this.normal

        .isPerpendicular(

            line.direction

        );

    }





    /**
     * Düzlemin karşı tarafı
     */
    sideOfPoint(

        point:Point

    ):number {


        const value =

        point.subtract(

            this.origin

        )

        .dot(

            this.normal.toVector()

        );



        if(value > 0)

            return 1;



        if(value < 0)

            return -1;



        return 0;

    }





    /**
     * Normal yönünü ters çevirir
     */
    reverse():

    Plane {


        return new Plane(

            this.origin.clone(),

            this.normal.reverse()

        );

    }





    transform(

        transform:Transform

    ):

    Plane {


        return new Plane(

            transform.applyToPoint(

                this.origin

            ),


            new Direction(

                transform.applyToVector(

                    this.normal.toVector()

                )

            )

        );

    }





    /**
     * Üç noktadan düzlem oluşturma
     */
    static fromPoints(

        a:Point,

        b:Point,

        c:Point

    ):

    Plane {


        const ab =

        b.subtract(a);



        const ac =

        c.subtract(a);



        const normal =

        new Direction(

            ab.cross(ac)

        );



        return new Plane(

            a.clone(),

            normal

        );

    }




    static XY():

    Plane {


        return new Plane(

            new Point(),

            Direction.Z()

        );

    }




    static XZ():

    Plane {


        return new Plane(

            new Point(),

            Direction.Y()

        );

    }





    static YZ():

    Plane {


        return new Plane(

            new Point(),

            Direction.X()

        );

    }


}