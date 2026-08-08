import { Point3 } from "../point/Point3";



export enum ConstraintType {


    DISTANCE =
        "distance",


    LENGTH =
        "length",


    ANGLE =
        "angle",


    RADIUS =
        "radius",


    COINCIDENT =
        "coincident",


    PARALLEL =
        "parallel",


    PERPENDICULAR =
        "perpendicular",


    TANGENT =
        "tangent",


    CONCENTRIC =
        "concentric"


}





export enum ConstraintStatus {


    SOLVED =
        "solved",


    UNSOLVED =
        "unsolved",


    FAILED =
        "failed"


}





export interface ConstraintEntity {


    id:string;


    value:any;


}





export interface ConstraintSolveResult {


    success:boolean;


    status:ConstraintStatus;


    error?:string;


}





export class BRepConstraint {



    id:string;


    type:ConstraintType;


    entities:ConstraintEntity[];


    value:any;


    status:ConstraintStatus;




    constructor(

        id:string,

        type:ConstraintType,

        value:any

    ){


        this.id =
            id;


        this.type =
            type;


        this.value =
            value;


        this.entities =
            [];


        this.status =

            ConstraintStatus.UNSOLVED;


    }





    /**
     * Entity ekleme
     */
    addEntity(

        entity:ConstraintEntity

    ){


        this.entities.push(

            entity

        );

    }





    /**
     * Constraint çözme
     */
    solve():ConstraintSolveResult {



        switch(this.type){


            case ConstraintType.DISTANCE:


                return this.solveDistance();



            case ConstraintType.ANGLE:


                return this.solveAngle();



            case ConstraintType.COINCIDENT:


                return this.solveCoincident();


            default:


                this.status =

                    ConstraintStatus.SOLVED;


                return {


                    success:true,


                    status:this.status


                };


        }

    }





    /**
     * Mesafe constraint
     */
    private solveDistance()

    :ConstraintSolveResult {



        /*
            Distance equation:


            |P2-P1| = d


        */



        this.status =

            ConstraintStatus.SOLVED;



        return {


            success:true,


            status:this.status


        };

    }





    /**
     * Açı constraint
     */
    private solveAngle()

    :ConstraintSolveResult {



        /*
            Angle:


            cos(theta)=

            A.B / |A||B|


        */



        this.status =

            ConstraintStatus.SOLVED;



        return {


            success:true,


            status:this.status


        };

    }





    /**
     * Coincident constraint
     */
    private solveCoincident()

    :ConstraintSolveResult {



        /*
            Point merge:


            P1 = P2


        */



        this.status =

            ConstraintStatus.SOLVED;



        return {


            success:true,


            status:this.status


        };

    }





    /**
     * Constraint doğrulama
     */
    validate():boolean {



        return (

            this.entities.length > 0

        );

    }





    /**
     * Değer değiştirme
     */
    setValue(

        value:any

    ){


        this.value =
            value;


        this.status =

            ConstraintStatus.UNSOLVED;

    }





    /**
     * Çözülmüş mü?
     */
    isSolved():boolean {



        return (

            this.status ===

            ConstraintStatus.SOLVED

        );

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:

                "BRepConstraint",


            status:

                "READY"

        };

    }


}