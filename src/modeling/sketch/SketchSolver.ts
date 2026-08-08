import { SketchGeometry }
from "./Sketch";


import { SketchConstraint }
from "./SketchConstraint";



export enum SolverStatus {


    Solved = "Solved",


    UnderConstrained = "UnderConstrained",


    OverConstrained = "OverConstrained",


    Failed = "Failed"

}







export interface SolverResult {


    status:

    SolverStatus;


    iterations:number;


    error:number;


}







export class SketchSolver {



    constructor(

        public geometries:

        SketchGeometry[],


        public constraints:

        SketchConstraint[]

    ){}



    solve(

        maxIterations:number = 50

    ):

    SolverResult {



        let error =

        Number.MAX_VALUE;



        let iteration =

        0;



        for(

            iteration = 0;

            iteration < maxIterations;

            iteration++

        ){



            error = 0;



            for(

                const constraint of

                this.constraints

            ){



                const solved =

                constraint.solve(

                    this.geometries

                );



                if(

                    !solved

                ){

                    return {

                        status:

                        SolverStatus.Failed,


                        iterations:

                        iteration,


                        error

                    };

                }



                error +=

                this.constraintError(

                    constraint

                );

            }



            if(

                error < 1e-6

            ){



                return {

                    status:

                    SolverStatus.Solved,


                    iterations:

                    iteration + 1,


                    error

                };

            }

        }



        return {


            status:

            SolverStatus.UnderConstrained,


            iterations:

            iteration,


            error

        };

    }







    private constraintError(

        constraint:

        SketchConstraint

    ):

    number {



        if(

            constraint.solved

        ){

            return 0;

        }



        return 1;

    }







    getDegreesOfFreedom():

    number {



        let dof = 0;



        for(

            const geometry of

            this.geometries

        ){



            dof +=

            geometry.points.length * 2;

        }



        for(

            const constraint of

            this.constraints

        ){



            dof -=

            this.constraintReduction(

                constraint

            );

        }



        return Math.max(

            0,

            dof

        );

    }







    private constraintReduction(

        constraint:

        SketchConstraint

    ):

    number {



        switch(

            constraint.type

        ){



            case "Horizontal":

            case "Vertical":

                return 1;



            case "Coincident":

                return 2;



            case "Distance":

            case "Length":

                return 1;



            case "Radius":

                return 1;



            default:

                return 0;

        }

    }



}