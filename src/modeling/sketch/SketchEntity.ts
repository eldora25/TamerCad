import { Point }
from "../../geometry/core/Point";


import { Vector3 }
from "../../geometry/core/Vector3";


import { Edge }
from "../../topology/core/Edge";



export enum SketchEntityType {


    Line = "Line",


    Circle = "Circle",


    Arc = "Arc",


    Ellipse = "Ellipse",


    Bezier = "Bezier",


    BSpline = "BSpline"

}







export abstract class SketchEntity {



    public construction:

    boolean = false;



    public visible:

    boolean = true;



    protected constraints:

    string[] = [];





    constructor(

        public id:string,


        public type:

        SketchEntityType

    ){}





    abstract getPoints():

    Point[];







    abstract evaluate(

        t:number

    ):

    Point;







    abstract toEdge():

    Edge;







    abstract clone():

    SketchEntity;







    addConstraintReference(

        constraintId:string

    ):

    void {



        this.constraints.push(

            constraintId

        );

    }







    getConstraintReferences():

    string[] {



        return this.constraints;

    }







    translate(

        vector:

        Vector3

    ):

    void {



        for(

            const point of

            this.getPoints()

        ){



            point.x +=

            vector.x;


            point.y +=

            vector.y;


            point.z +=

            vector.z;

        }

    }



}