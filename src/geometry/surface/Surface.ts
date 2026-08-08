import { Point }
from "../core/Point";


import { Vector3 }
from "../core/Vector3";


import { BoundingBox }
from "../core/BoundingBox";


import { Transform }
from "../core/Transform";



export abstract class Surface {



    /**
     * Minimum U parameter
     */
    abstract get uMin():

    number;



    /**
     * Maximum U parameter
     */
    abstract get uMax():

    number;



    /**
     * Minimum V parameter
     */
    abstract get vMin():

    number;



    /**
     * Maximum V parameter
     */
    abstract get vMax():

    number;





    /**
     * Surface evaluation

     S(u,v)

     */
    abstract evaluate(

        u:number,

        v:number

    ):

    Point;





    /**
     * First derivative in U direction

     ∂S/∂u

     */
    abstract derivativeU(

        u:number,

        v:number

    ):

    Vector3;





    /**
     * First derivative in V direction

     ∂S/∂v

     */
    abstract derivativeV(

        u:number,

        v:number

    ):

    Vector3;







    /**
     * Surface normal

     N = Su x Sv

     */
    normal(

        u:number,

        v:number

    ):

    Vector3 {


        return this

        .derivativeU(

            u,

            v

        )

        .cross(

            this.derivativeV(

                u,

                v

            )

        )

        .normalize();

    }





    /**
     * Approximate closest point

     */
    closestPoint(

        point:Point

    ):

    Point {



        let closest =

        this.evaluate(

            this.uMin,

            this.vMin

        );



        let distance =

        closest.distanceTo(

            point

        );



        const samples = 50;



        for(

            let i=0;

            i<=samples;

            i++

        ){


            const u =

            this.uMin +

            (

                this.uMax -

                this.uMin

            )

            *

            i

            /

            samples;



            for(

                let j=0;

                j<=samples;

                j++

            ){


                const v =

                this.vMin +

                (

                    this.vMax -

                    this.vMin

                )

                *

                j

                /

                samples;



                const candidate =

                this.evaluate(

                    u,

                    v

                );



                const d =

                candidate.distanceTo(

                    point

                );



                if(

                    d < distance

                ){

                    distance=d;

                    closest=candidate;

                }

            }

        }



        return closest;

    }







    /**
     * Projection

     */
    projectPoint(

        point:Point

    ):

    Point {


        return this.closestPoint(

            point

        );

    }






    /**
     * Surface bounding box
     */
    abstract boundingBox():

    BoundingBox;





    /**
     * Orientation reverse

     */
    abstract reverse():

    Surface;





    /**
     * Transformation

     */
    abstract transform(

        transform:Transform

    ):

    Surface;



}