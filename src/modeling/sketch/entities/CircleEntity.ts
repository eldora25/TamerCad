import { Point }
from "../../../geometry/core/Point";


import { Vector3 }
from "../../../geometry/core/Vector3";


import { Edge }
from "../../../topology/core/Edge";


import { SketchEntity,
         SketchEntityType }

from "../SketchEntity";







export class CircleEntity

extends SketchEntity {



    constructor(

        id:string,


        public center:Point,


        public radius:number

    ){



        super(

            id,

            SketchEntityType.Circle

        );

    }







    getPoints():

    Point[] {



        return [

            this.center

        ];

    }







    evaluate(

        t:number

    ):

    Point {



        const angle =

        t * Math.PI * 2;



        return new Point(

            this.center.x +

            Math.cos(angle)

            *

            this.radius,


            this.center.y +

            Math.sin(angle)

            *

            this.radius,


            this.center.z

        );

    }







    circumference():

    number {



        return 2 *

        Math.PI *

        this.radius;

    }







    area():

    number {



        return Math.PI *

        this.radius *

        this.radius;

    }







    containsPoint(

        point:Point,


        tolerance:number = 1e-6

    ):

    boolean {



        const dx =

        point.x -

        this.center.x;



        const dy =

        point.y -

        this.center.y;



        const distance =

        Math.sqrt(

            dx*dx +

            dy*dy

        );



        return Math.abs(

            distance -

            this.radius

        )

        < tolerance;

    }







    translate(

        vector:Vector3

    ):

    void {



        this.center.x +=

        vector.x;



        this.center.y +=

        vector.y;



        this.center.z +=

        vector.z;

    }







    scale(

        factor:number

    ):

    void {



        this.radius *=

        factor;

    }







    toEdge():

    Edge {



        return new Edge(

            this.center,

            this.evaluate(0)

        );

    }







    clone():

    CircleEntity {



        return new CircleEntity(

            this.id,


            new Point(

                this.center.x,

                this.center.y,

                this.center.z

            ),


            this.radius

        );

    }



}