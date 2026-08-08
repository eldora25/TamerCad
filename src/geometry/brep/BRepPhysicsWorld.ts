import {
    BRepSolid
}
from "./BRepSolid";





export interface Vector3 {


    x:number;


    y:number;


    z:number;


}





export interface Material {


    name:string;


    density:number;


    friction:number;


    restitution:number;


}





export interface RigidBody {


    id:string;


    solid:BRepSolid;


    mass:number;


    position:Vector3;


    rotation:Vector3;


    velocity:Vector3;


    angularVelocity:Vector3;


    material:Material;


    static:boolean;


}





export interface ContactManifold {


    bodyA:string;


    bodyB:string;


    points:Vector3[];


    normal:Vector3;


    penetration:number;


}





export interface PhysicsWorldResult {


    success:boolean;


    timestep:number;


    bodies:number;


    contacts:number;


}





export class BRepPhysicsWorld {



    bodies:RigidBody[];


    materials:Material[];


    contacts:ContactManifold[];


    gravity:Vector3;


    time:number;



    constructor(){


        this.bodies=[];


        this.materials=[];


        this.contacts=[];


        this.gravity={


            x:0,


            y:0,


            z:-9.81


        };


        this.time=0;


    }





    /**
     * Material ekleme
     */
    addMaterial(

        material:Material

    ){


        this.materials.push(

            material

        );


    }





    /**
     * Body ekleme
     */
    addBody(

        body:RigidBody

    ){


        this.bodies.push(

            body

        );


    }





    /**
     * Dünya simülasyonu
     */
    step(

        dt:number

    ):PhysicsWorldResult {



        /*
        
        Physics Pipeline:


        1. Apply Forces


        2. Broad Phase


        3. Narrow Phase


        4. Contact Solve


        5. Integrate Motion


        6. Update State


        */



        this.applyGravity();



        this.broadPhase();



        this.narrowPhase();



        this.solveContacts();



        this.integrate(

            dt

        );



        this.time += dt;



        return {


            success:true,


            timestep:dt,


            bodies:

                this.bodies.length,


            contacts:

                this.contacts.length


        };


    }





    /**
     * Gravity
     */
    applyGravity(){



        for(

            const body of this.bodies

        ){



            if(body.static)

                continue;



            body.velocity.z +=

                this.gravity.z *

                0.016;


        }


    }





    /**
     * Broad phase collision
     *
     * AABB filtering
     */
    broadPhase(){



        /*
        
        Büyük alan taraması:


        Body A

          |

        Body B


        possible collision pair


        */



    }





    /**
     * Narrow phase collision
     *
     * Precise geometry test
     */
    narrowPhase(){



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



                const a=

                    this.bodies[i];


                const b=

                    this.bodies[j];



                /*
                
                BRepIntersector

                çağrısı burada olur.


                */


            }


        }


    }





    /**
     * Contact solver
     */
    solveContacts(){



        for(

            const contact of

            this.contacts

        ){



            /*
            
            Impulse resolution:


            Normal impulse

            Friction impulse


            */


        }


    }





    /**
     * Motion integration
     */
    integrate(

        dt:number

    ){



        for(

            const body of this.bodies

        ){



            if(body.static)

                continue;



            body.position.x +=

                body.velocity.x *

                dt;



            body.position.y +=

                body.velocity.y *

                dt;



            body.position.z +=

                body.velocity.z *

                dt;


        }


    }





    /**
     * Friction modeli
     */
    friction(

        a:Material,

        b:Material

    ){


        return (

            a.friction +

            b.friction

        )

        /

        2;


    }





    /**
     * Restitution
     */
    bounce(

        a:Material,

        b:Material

    ){



        return Math.max(

            a.restitution,

            b.restitution

        );


    }





    /**
     * Dünya reset
     */
    reset(){



        this.time=0;


        this.contacts=[];


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepPhysicsWorld",


            bodies:

                this.bodies.length,


            materials:

                this.materials.length,


            status:

                "READY"


        };


    }


}