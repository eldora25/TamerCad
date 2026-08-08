import {
    BRepSolid
}
from "./BRepSolid";





export interface Vector3 {


    x:number;


    y:number;


    z:number;


}





export interface BoundingBox {


    min:Vector3;


    max:Vector3;


}





export interface CollisionContact {


    point:Vector3;


    normal:Vector3;


    depth:number;


}





export interface CollisionResult {


    collided:boolean;


    contacts:CollisionContact[];


    distance:number;


}





export interface CollisionBody {


    id:string;


    solid:BRepSolid;


    bounds:BoundingBox;


}





export class BRepCollision {



    bodies:CollisionBody[];




    constructor(){


        this.bodies=[];


    }





    /**
     * Collision body ekleme
     */
    addBody(

        body:CollisionBody

    ){


        this.bodies.push(

            body

        );


    }





    /**
     * Ana collision testi
     */
    test(

        a:CollisionBody,

        b:CollisionBody

    ):CollisionResult {



        /*
        
        Pipeline:


        AABB


         ↓


        OBB


         ↓


        Mesh


         ↓


        BRep Intersection


        */



        if(

            !this.aabb(

                a.bounds,

                b.bounds

            )

        ){



            return {


                collided:false,


                contacts:[],


                distance:0


            };


        }





        return this.narrowPhase(

            a,

            b

        );


    }





    /**
     * AABB collision
     */
    aabb(

        a:BoundingBox,

        b:BoundingBox

    ){



        return !(

            a.max.x < b.min.x ||

            a.min.x > b.max.x ||

            a.max.y < b.min.y ||

            a.min.y > b.max.y ||

            a.max.z < b.min.z ||

            a.min.z > b.max.z

        );


    }





    /**
     * OBB collision
     */
    obb(

        a:CollisionBody,

        b:CollisionBody

    ){


        /*
        
        Separating Axis Theorem


        Axis projection


        */


        return true;


    }





    /**
     * Narrow phase
     */
    narrowPhase(

        a:CollisionBody,

        b:CollisionBody

    ):CollisionResult {



        /*
        
        BRep Intersector kullanılır:


        Face


          ↓


        Edge


          ↓


        Vertex


          ↓


        Contact Point


        */



        const contacts:

            CollisionContact[]=[];



        return {


            collided:

                contacts.length>0,


            contacts,


            distance:0


        };


    }





    /**
     * Mesh collision
     */
    meshCollision(

        meshA:any,

        meshB:any

    ){



        return {


            collided:false,


            triangles:0


        };


    }





    /**
     * Penetration depth
     */
    penetration(

        a:CollisionBody,

        b:CollisionBody

    ){



        return {


            depth:0,


            normal:{

                x:0,

                y:0,

                z:1

            }


        };


    }





    /**
     * Contact üretimi
     */
    generateContact(

        point:Vector3,

        normal:Vector3,

        depth:number

    ):CollisionContact {



        return {


            point,


            normal,


            depth


        };


    }





    /**
     * Continuous collision detection
     */
    continuous(

        body:CollisionBody,

        velocity:Vector3,

        delta:number

    ){



        /*
        
        Swept volume:


        Current position

              +

        Future position


        */


        return {


            collision:false,


            toi:1


        };


    }





    /**
     * Çift body testi
     */
    checkAll(){



        const results:



            CollisionResult[]=[];



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



                results.push(

                    this.test(

                        this.bodies[i],

                        this.bodies[j]

                    )

                );


            }


        }



        return results;


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepCollision",


            bodies:

                this.bodies.length,


            status:

                "READY"


        };


    }


}