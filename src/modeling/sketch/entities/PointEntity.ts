import { Point }
from "../../../geometry/core/Point";


import { Vector3 }
from "../../../geometry/core/Vector3";


import { Edge }
from "../../../topology/core/Edge";


import { SketchEntity,
         SketchEntityType }

from "../SketchEntity";







export class PointEntity

extends SketchEntity {



    constructor(

        id:string,


        public position:

        Point

    ){



        super(

            id,

            SketchEntityType.Point

        );

    }







    getPoints():

    Point[] {



        return [

            this.position

        ];

    }







    evaluate(

        t:number = 0

    ):

    Point {



        return new Point(

            this.position.x,

            this.position.y,

            this.position.z

        );

    }







    moveTo(

        point:Point

    ):

    void {



        this.position.x =

        point.x;



        this.position.y =

        point.y;



        this.position.z =

        point.z;

    }







    translate(

        vector:

        Vector3

    ):

    void {



        this.position.x +=

        vector.x;



        this.position.y +=

        vector.y;



        this.position.z +=

        vector.z;

    }







    distanceTo(

        point:Point

    ):

    number {



        const dx =

        this.position.x -

        point.x;



        const dy =

        this.position.y -

        point.y;



        const dz =

        this.position.z -

        point.z;



        return Math.sqrt(

            dx*dx +

            dy*dy +

            dz*dz

        );

    }







    toEdge():

    Edge {



        // Point tek başına Edge oluşturmaz.

        // Kernel seviyesinde vertex olarak kullanılır.



        return new Edge(

            this.position,

            this.position

        );

    }







    clone():

    PointEntity {



        return new PointEntity(

            this.id,


            new Point(

                this.position.x,

                this.position.y,

                this.position.z

            )

        );

    }



}