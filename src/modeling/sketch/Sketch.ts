import { Point }
from "../../geometry/core/Point";


import { Vector3 }
from "../../geometry/core/Vector3";


import { Wire }
from "../../topology/core/Wire";


import { Edge }
from "../../topology/core/Edge";



export enum SketchGeometryType {


    Line = "Line",


    Circle = "Circle",


    Arc = "Arc",


    Spline = "Spline"

}







export interface SketchGeometry {


    id:string;


    type:

    SketchGeometryType;


    points:

    Point[];


}







export interface SketchConstraint {


    id:string;


    type:string;


    value?:number;


    references:string[];


}







export class Sketch {



    public geometries:

    SketchGeometry[] = [];



    public constraints:

    SketchConstraint[] = [];





    constructor(

        public name:string,


        public origin:

        Point =

        new Point(

            0,

            0,

            0

        ),


        public normal:

        Vector3 =

        new Vector3(

            0,

            0,

            1

        )

    ){}



    addGeometry(

        geometry:

        SketchGeometry

    ):

    void {



        this.geometries.push(

            geometry

        );

    }







    removeGeometry(

        id:string

    ):

    void {



        this.geometries =

        this.geometries.filter(

            g =>

            g.id !== id

        );

    }







    addConstraint(

        constraint:

        SketchConstraint

    ):

    void {



        this.constraints.push(

            constraint

        );

    }







    removeConstraint(

        id:string

    ):

    void {



        this.constraints =

        this.constraints.filter(

            c =>

            c.id !== id

        );

    }







    solve():

    boolean {



        // Gerçek kernel'de:

        // Constraint solver burada çalışır.



        return true;

    }







    isClosed():

    boolean {



        if(

            this.geometries.length === 0

        ){

            return false;

        }



        return true;

    }







    toWire():

    Wire {



        const wire =

        new Wire();



        for(

            const geometry of

            this.geometries

        ){



            const edge =

            this.geometryToEdge(

                geometry

            );



            wire.addEdge(

                edge

            );

        }



        return wire;

    }







    private geometryToEdge(

        geometry:

        SketchGeometry

    ):

    Edge {



        const start =

        geometry.points[0];



        const end =

        geometry.points[1];



        return new Edge(

            start,

            end

        );

    }



}