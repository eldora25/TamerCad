import {
    Vector3,
    RigidBody,
    ContactManifold
}
from "./BRepPhysicsWorld";





export interface Impulse {


    x:number;


    y:number;


    z:number;


}





export interface SolverResult {


    solved:boolean;


    impulses:number;


    corrections:number;


}





export class BRepContactSolver {



    iterations:number;


    restitution:number;


    friction:number;



    constructor(){


        this.iterations = 10;


        this.restitution = 0.2;


        this.friction = 0.5;


    }





    /**
     * Contact çözüm ana fonksiyonu
     */
    solve(

        contacts:ContactManifold[],

        bodies:RigidBody[]

    ):SolverResult {



        let impulseCount = 0;


        let correctionCount = 0;



        for(

            const contact of contacts

        ){


            const a =

                bodies.find(

                    b=>b.id===contact.bodyA

                );



            const b =

                bodies.find(

                    b=>b.id===contact.bodyB

                );



            if(

                !a ||

                !b

            )

                continue;



            const impulse =

                this.solveNormalImpulse(

                    a,

                    b,

                    contact

                );



            this.applyImpulse(

                a,

                b,

                impulse

            );



            impulseCount++;



            this.correctPenetration(

                a,

                b,

                contact

            );



            correctionCount++;


        }



        return {


            solved:true,


            impulses:

                impulseCount,


            corrections:

                correctionCount


        };


    }





    /**
     * Normal impulse hesabı
     */
    solveNormalImpulse(

        a:RigidBody,

        b:RigidBody,

        contact:ContactManifold

    ):Impulse {



        const relativeVelocity = {


            x:

                b.velocity.x -

                a.velocity.x,


            y:

                b.velocity.y -

                a.velocity.y,


            z:

                b.velocity.z -

                a.velocity.z


        };



        const velocityAlongNormal =

            relativeVelocity.x *

                contact.normal.x

            +

            relativeVelocity.y *

                contact.normal.y

            +

            relativeVelocity.z *

                contact.normal.z;



        if(

            velocityAlongNormal > 0

        ){


            return {


                x:0,

                y:0,

                z:0

            };


        }



        const j =

            -(

                1 +

                this.restitution

            )

            *

            velocityAlongNormal;



        return {


            x:

                contact.normal.x *

                j,


            y:

                contact.normal.y *

                j,


            z:

                contact.normal.z *

                j


        };


    }





    /**
     * Impulse uygulama
     */
    applyImpulse(

        a:RigidBody,

        b:RigidBody,

        impulse:Impulse

    ){



        if(

            !a.static

        ){


            a.velocity.x -=

                impulse.x /

                a.mass;



            a.velocity.y -=

                impulse.y /

                a.mass;



            a.velocity.z -=

                impulse.z /

                a.mass;


        }



        if(

            !b.static

        ){


            b.velocity.x +=

                impulse.x /

                b.mass;



            b.velocity.y +=

                impulse.y /

                b.mass;



            b.velocity.z +=

                impulse.z /

                b.mass;


        }


    }





    /**
     * Sürtünme çözümü
     */
    solveFriction(

        a:RigidBody,

        b:RigidBody,

        contact:ContactManifold

    ):Impulse {



        return {


            x:

                -this.friction *


                contact.normal.x,


            y:

                -this.friction *


                contact.normal.y,


            z:

                -this.friction *


                contact.normal.z


        };


    }





    /**
     * Penetration correction
     */
    correctPenetration(

        a:RigidBody,

        b:RigidBody,

        contact:ContactManifold

    ){



        const correction =

            contact.penetration *

            0.8;



        if(

            !a.static

        ){


            a.position.x -=

                contact.normal.x *

                correction;



            a.position.y -=

                contact.normal.y *

                correction;



            a.position.z -=

                contact.normal.z *

                correction;


        }



        if(

            !b.static

        ){


            b.position.x +=

                contact.normal.x *

                correction;



            b.position.y +=

                contact.normal.y *

                correction;



            b.position.z +=

                contact.normal.z *

                correction;


        }


    }





    /**
     * Iterative solver
     */
    iterate(

        contacts:ContactManifold[],

        bodies:RigidBody[]

    ){



        for(

            let i=0;

            i<this.iterations;

            i++

        ){


            this.solve(

                contacts,

                bodies

            );


        }


    }





    /**
     * Stabilization
     */
    stabilize(

        bodies:RigidBody[]

    ){



        for(

            const body of bodies

        ){


            body.velocity.x *= 0.999;


            body.velocity.y *= 0.999;


            body.velocity.z *= 0.999;


        }


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepContactSolver",


            iterations:

                this.iterations,


            status:

                "READY"


        };


    }


}