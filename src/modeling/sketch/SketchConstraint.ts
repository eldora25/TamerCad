import { SketchGeometry }
from "./Sketch";



export enum ConstraintType {


    Coincident = "Coincident",


    Horizontal = "Horizontal",


    Vertical = "Vertical",


    Parallel = "Parallel",


    Perpendicular = "Perpendicular",


    Tangent = "Tangent",


    Concentric = "Concentric",


    Distance = "Distance",


    Length = "Length",


    Radius = "Radius",


    Diameter = "Diameter",


    Angle = "Angle",


    Equal = "Equal",


    Symmetry = "Symmetry",


    Fix = "Fix"

}







export interface ConstraintReference {


    geometryId:string;


    pointIndex?:number;


}







export class SketchConstraint {



    public solved:boolean = false;



    constructor(


        public id:string,


        public type:

        ConstraintType,


        public references:

        ConstraintReference[],


        public value:number|null = null

    ){}



    solve(

        geometries:

        SketchGeometry[]

    ):

    boolean {



        switch(

            this.type

        ){



            case ConstraintType.Horizontal:


                return this.solveHorizontal(

                    geometries

                );



            case ConstraintType.Vertical:


                return this.solveVertical(

                    geometries

                );



            case ConstraintType.Distance:


                return this.solveDistance(

                    geometries

                );



            case ConstraintType.Radius:


                return this.solveRadius(

                    geometries

                );



            case ConstraintType.Coincident:


                return this.solveCoincident(

                    geometries

                );



            default:


                return false;

        }

    }







    private solveHorizontal(

        geometries:

        SketchGeometry[]

    ):

    boolean {



        const geo =

        this.getFirstGeometry(

            geometries

        );



        if(

            !geo ||

            geo.points.length < 2

        ){

            return false;

        }



        geo.points[1].y =

        geo.points[0].y;



        this.solved = true;



        return true;

    }







    private solveVertical(

        geometries:

        SketchGeometry[]

    ):

    boolean {



        const geo =

        this.getFirstGeometry(

            geometries

        );



        if(

            !geo ||

            geo.points.length < 2

        ){

            return false;

        }



        geo.points[1].x =

        geo.points[0].x;



        this.solved = true;



        return true;

    }







    private solveDistance(

        geometries:

        SketchGeometry[]

    ):

    boolean {



        // Gerçek kernel'de:

        // nonlinear constraint solver çalışır.



        this.solved = true;



        return true;

    }







    private solveRadius(

        geometries:

        SketchGeometry[]

    ):

    boolean {



        this.solved = true;


        return true;

    }







    private solveCoincident(

        geometries:

        SketchGeometry[]

    ):

    boolean {



        const a =

        this.getFirstGeometry(

            geometries

        );



        const b =

        this.getSecondGeometry(

            geometries

        );



        if(

            !a ||

            !b

        ){

            return false;

        }



        b.points[0].x =

        a.points[0].x;



        b.points[0].y =

        a.points[0].y;



        b.points[0].z =

        a.points[0].z;



        this.solved = true;



        return true;

    }







    private getFirstGeometry(

        geometries:

        SketchGeometry[]

    ):



    SketchGeometry|null {



        const ref =

        this.references[0];



        return geometries.find(

            g =>

            g.id === ref.geometryId

        ) ?? null;

    }







    private getSecondGeometry(

        geometries:

        SketchGeometry[]

    ):



    SketchGeometry|null {



        const ref =

        this.references[1];



        if(

            !ref

        ){

            return null;

        }



        return geometries.find(

            g =>

            g.id === ref.geometryId

        ) ?? null;

    }



}