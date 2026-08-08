import { Point }
from "../../geometry/core/Point";


import { Vector3 }
from "../../geometry/core/Vector3";


import { Transform }
from "../../geometry/core/Transform";







export enum SketchPlaneType {


    XY = "XY",


    XZ = "XZ",


    YZ = "YZ",


    Custom = "Custom"

}







export class SketchPlane {



    constructor(


        public type:

        SketchPlaneType,


        public origin:

        Point,


        public normal:

        Vector3,


        public xAxis:

        Vector3,


        public yAxis:

        Vector3

    ){}



    static XY():

    SketchPlane {



        return new SketchPlane(

            SketchPlaneType.XY,


            new Point(

                0,

                0,

                0

            ),


            new Vector3(

                0,

                0,

                1

            ),


            new Vector3(

                1,

                0,

                0

            ),


            new Vector3(

                0,

                1,

                0

            )

        );

    }







    static XZ():

    SketchPlane {



        return new SketchPlane(

            SketchPlaneType.XZ,


            new Point(

                0,

                0,

                0

            ),


            new Vector3(

                0,

                1,

                0

            ),


            new Vector3(

                1,

                0,

                0

            ),


            new Vector3(

                0,

                0,

                1

            )

        );

    }







    static YZ():

    SketchPlane {



        return new SketchPlane(

            SketchPlaneType.YZ,


            new Point(

                0,

                0,

                0

            ),


            new Vector3(

                1,

                0,

                0

            ),


            new Vector3(

                0,

                1,

                0

            ),


            new Vector3(

                0,

                0,

                1

            )

        );

    }







    toWorld(

        u:number,


        v:number

    ):

    Point {



        return new Point(

            this.origin.x

            +

            this.xAxis.x*u

            +

            this.yAxis.x*v,


            this.origin.y

            +

            this.xAxis.y*u

            +

            this.yAxis.y*v,


            this.origin.z

            +

            this.xAxis.z*u

            +

            this.yAxis.z*v

        );

    }







    projectPoint(

        point:Point

    ):

    {

        u:number,

        v:number

    } {



        const dx =

        point.x -

        this.origin.x;



        const dy =

        point.y -

        this.origin.y;



        const dz =

        point.z -

        this.origin.z;



        return {


            u:

            dx*this.xAxis.x

            +

            dy*this.xAxis.y

            +

            dz*this.xAxis.z,



            v:

            dx*this.yAxis.x

            +

            dy*this.yAxis.y

            +

            dz*this.yAxis.z

        };

    }







    normalVector():

    Vector3 {



        return this.normal;

    }







    transform():

    Transform {



        return new Transform();

    }



}