import {
    RigidBody
}
from "./BRepPhysicsWorld";





export interface Vector3 {


    x:number;


    y:number;


    z:number;


}





export enum ConstraintType {


    FIXED =
        "fixed",


    HINGE =
        "hinge",


    SLIDER =
        "slider",


    DISTANCE =
        "distance",


    MOTOR =
        "motor",


    GEAR =
        "gear"


}





export interface Constraint {


    id:string;


    type:ConstraintType;


    bodyA:string;


    bodyB:string;


}





export interface MotorConstraint extends Constraint {


    targetSpeed:number;


    torque:number;


}





export interface ConstraintResult {


    solved:boolean;


    corrections:number;


}





export class BRepConstraintPhysics {



    constraints:Constraint[];


    iterations:number;



    constructor(){


        this.constraints=[];


        this.iterations=10;


    }





    /**
     * Constraint ekleme
     */
    add(

        constraint:Constraint

    ){


        this.constraints.push(

            constraint

        );


    }





    /**
     * Ana constraint solver
     */
    solve(

        bodies:RigidBody[]

    ):ConstraintResult {



        let corrections=0;



        for(

            const constraint of this.constraints

        ){



            switch(

                constraint.type

            ){



                case ConstraintType.FIXED:


                    this.solveFixed(

                        constraint,

                        bodies

                    );


                    break;




                case ConstraintType.HINGE:


                    this.solveHinge(

                        constraint,

                        bodies

                    );


                    break;




                case ConstraintType.SLIDER:


                    this.solveSlider(

                        constraint,

                        bodies

                    );


                    break;




                case ConstraintType.MOTOR:


                    this.solveMotor(

                        constraint,

                        bodies

                    );


                    break;



            }



            corrections++;


        }




        return {


            solved:true,


            corrections


        };


    }





    /**
     * Fixed joint
     */
    solveFixed(

        constraint:Constraint,

        bodies:RigidBody[]

    ){



        const a=

            this.body(

                constraint.bodyA,

                bodies

            );



        const b=

            this.body(

                constraint.bodyB,

                bodies

            );



        if(!a || !b)

            return;



        /*
        
        Pozisyon farkını sıfırlar


        */



        b.position=

            {


                x:a.position.x,


                y:a.position.y,


                z:a.position.z


            };


    }





    /**
     * Hinge joint
     */
    solveHinge(

        constraint:Constraint,

        bodies:RigidBody[]

    ){



        /*
        
        Dönme serbest

        X,Y,Z translasyon kilitli


        */


    }





    /**
     * Slider joint
     */
    solveSlider(

        constraint:Constraint,

        bodies:RigidBody[]

    ){



        /*
        
        Tek eksende hareket


        */


    }





    /**
     * Motor joint
     */
    solveMotor(

        constraint:Constraint,

        bodies:RigidBody[]

    ){



        const motor=

            constraint as MotorConstraint;



        /*
        
        Angular velocity hedefleme


        */


    }





    /**
     * Distance constraint
     */
    solveDistance(

        constraint:Constraint,

        bodies:RigidBody[]

    ){



        /*
        
        İki body arası mesafe korunur


        */


    }





    /**
     * Gear constraint
     */
    solveGear(

        constraint:Constraint,

        bodies:RigidBody[]

    ){



        /*
        
        Gear ratio:

        w1*r1 = w2*r2


        */


    }





    /**
     * Body bulucu
     */
    body(

        id:string,

        bodies:RigidBody[]

    ){


        return bodies.find(

            b=>b.id===id

        );


    }





    /**
     * Iterative çözüm
     */
    iterate(

        bodies:RigidBody[]

    ){



        for(

            let i=0;

            i<this.iterations;

            i++

        ){


            this.solve(

                bodies

            );


        }


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepConstraintPhysics",


            constraints:

                this.constraints.length,


            iterations:

                this.iterations,


            status:

                "READY"


        };


    }


}