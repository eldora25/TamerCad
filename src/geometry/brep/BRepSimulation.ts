import {
    BRepSolid
}
from "./BRepSolid";


import {
    BRepAssembly
}
from "./BRepAssembly";





export interface Vector3 {


    x:number;


    y:number;


    z:number;


}





export interface PhysicsBody {


    id:string;


    solid:BRepSolid;


    mass:number;


    position:Vector3;


    velocity:Vector3;


    acceleration:Vector3;


    dynamic:boolean;


}





export interface Force {


    bodyId:string;


    value:Vector3;


}





export interface Contact {


    bodyA:string;


    bodyB:string;


    point:Vector3;


    normal:Vector3;


}





export interface SimulationResult {


    success:boolean;


    time:number;


    bodies:number;


    collisions:number;


}





export class BRepSimulation {



    assembly:BRepAssembly|null;


    bodies:PhysicsBody[];


    forces:Force[];


    contacts:Contact[];


    gravity:Vector3;


    time:number;



    constructor(

        assembly?:BRepAssembly

    ){


        this.assembly=

            assembly ?? null;



        this.bodies=[];


        this.forces=[];


        this.contacts=[];


        this.gravity={


            x:0,


            y:0,


            z:-9.81


        };


        this.time=0;


    }





    /**
     * Rigid body ekleme
     */
    addBody(

        body:PhysicsBody

    ){


        this.bodies.push(

            body

        );


    }





    /**
     * Force uygulama
     */
    applyForce(

        force:Force

    ){


        this.forces.push(

            force

        );


    }





    /**
     * Simulation step
     */
    step(

        delta:number

    ):SimulationResult {



        /*
            Physics Loop:


            Forces


              ↓


            Acceleration


              ↓


            Velocity


              ↓


            Position


              ↓


            Collision


              ↓


            Contact Solve

        */



        this.integrate(

            delta

        );



        this.detectCollisions();



        this.resolveContacts();



        this.time += delta;



        return {


            success:true,


            time:this.time,


            bodies:this.bodies.length,


            collisions:

                this.contacts.length


        };


    }





    /**
     * Physics integration
     */
    integrate(

        delta:number

    ){



        for(

            const body of this.bodies

        ){



            if(

                !body.dynamic

            )

                continue;



            body.acceleration = {


                x:

                    this.gravity.x,


                y:

                    this.gravity.y,


                z:

                    this.gravity.z


            };



            body.velocity.x +=

                body.acceleration.x *

                delta;



            body.velocity.y +=

                body.acceleration.y *

                delta;



            body.velocity.z +=

                body.acceleration.z *

                delta;



            body.position.x +=

                body.velocity.x *

                delta;



            body.position.y +=

                body.velocity.y *

                delta;



            body.position.z +=

                body.velocity.z *

                delta;


        }


    }





    /**
     * Collision detection
     */
    detectCollisions(){



        this.contacts=[];



        for(

            let i=0;

            i<this.bodies.length;

            i++

        ){


            for(

                let j=i+1;

                j<this.bodies.length;

                j++

            ){



                const a =

                    this.bodies[i];


                const b =

                    this.bodies[j];



                /*
                    Placeholder:

                    BRep Intersector

                    kullanılır.
                */



            }


        }


    }





    /**
     * Contact çözümü
     */
    resolveContacts(){



        for(

            const contact of

            this.contacts

        ){


            // impulse solver


        }


    }





    /**
     * Gravity değiştirme
     */
    setGravity(

        gravity:Vector3

    ){


        this.gravity=

            gravity;


    }





    /**
     * Body reset
     */
    reset(){



        this.time=0;



        for(

            const body of this.bodies

        ){


            body.velocity={

                x:0,

                y:0,

                z:0

            };


        }


    }





    /**
     * Assembly simulation hazırlığı
     */
    prepare(){

        return {


            ready:true,


            bodies:

                this.bodies.length


        };


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepSimulation",


            bodies:

                this.bodies.length,


            time:

                this.time,


            status:

                "READY"


        };


    }


}