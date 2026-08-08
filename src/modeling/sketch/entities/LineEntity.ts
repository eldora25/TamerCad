import { Point }
from "../../../geometry/core/Point";


import { Vector3 }
from "../../../geometry/core/Vector3";


import { Edge }
from "../../../topology/core/Edge";


import { SketchEntity,
         SketchEntityType }

from "../SketchEntity";







export class LineEntity

extends SketchEntity {



    constructor(

        id:string,


        public start:Point,


        public end:Point

    ){



        super(

            id,

            SketchEntityType.Line

        );

    }







    getPoints():

    Point[] {



        return [

            this.start,

            this.end

        ];

    }







    evaluate(

        t:number

    ):

    Point {



        if(

            t < 0 ||

            t > 1

        ){

            throw new Error(

                "Line parameter must be between 0 and 1"

            );

        }



        return new Point(

            this.start.x +

            (

                this.end.x -

                this.start.x

            )

            * t,


            this.start.y +

            (

                this.end.y -

                this.start.y

            )

            * t,


            this.start.z +

            (

                this.end.z -

                this.start.z

            )

            * t

        );

    }







    length():

    number {



        const dx =

        this.end.x -

        this.start.x;



        const dy =

        this.end.y -

        this.start.y;



        const dz =

        this.end.z -

        this.start.z;



        return Math.sqrt(

            dx*dx +

            dy*dy +

            dz*dz

        );

    }







    direction():

    Vector3 {



        const dx =

        this.end.x -

        this.start.x;



        const dy =

        this.end.y -

        this.start.y;



        const dz =

        this.end.z -

        this.start.z;



        const length =

        Math.sqrt(

            dx*dx +

            dy*dy +

            dz*dz

        );



        if(

            length === 0

        ){

            return new Vector3(

                0,

                0,

                0

            );

        }



        return new Vector3(

            dx / length,

            dy / length,

            dz / length

        );

    }







    midpoint():

    Point {



        return this.evaluate(

            0.5

        );

    }







    toEdge():

    Edge {



        return new Edge(

            this.start,

            this.end

        );

    }







    translate(

        vector:Vector3

    ):

    void {



        this.start.x +=

        vector.x;



        this.start.y +=

        vector.y;



        this.start.z +=

        vector.z;



        this.end.x +=

        vector.x;



        this.end.y +=

        vector.y;



        this.end.z +=

        vector.z;

    }







    reverse():

    void {



        const temp =

        this.start;



        this.start =

        this.end;



        this.end =

        temp;

    }







    clone():

    LineEntity {



        return new LineEntity(

            this.id,


            new Point(

                this.start.x,

                this.start.y,

                this.start.z

            ),


            new Point(

                this.end.x,

                this.end.y,

                this.end.z

            )

        );

    }



}